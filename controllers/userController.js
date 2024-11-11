import User from "../models/userModel.js";
import {generatetoken, generateTokenEmail} from "../middlewares/auth.js"
import bcrypt from "bcrypt";    
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

//Register
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body; // Solo desestructuramos username, email y password

    try {
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
            return res.status(409).json({ message: 'El correo electrónico ya está en uso.' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username, // Campo obligatorio
            email,
            password: hashedPassword,
            profilePicture: null, // Valor por defecto
            bio: null, // Valor por defecto
            followers: [], // Inicializar como un array vacío
            following: [], // Inicializar como un array vacío
            posts: [], // Inicializar como un array vacío
            role: 'user', // Asignar rol por defecto
            subscription: null, // Valor por defecto
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();
        
        res.status(201).json({
            username: newUser.username,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
            bio: newUser.bio,
            followers: newUser.followers,
            following: newUser.following,
            posts: newUser.posts,
            role: newUser.role,
            subscription: newUser.subscription,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Login

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({ email: email });
        
        if (user) {
            // Compara la contraseña proporcionada con la almacenada en la base de datos
            const match = await bcrypt.compare(password, user.password);
            
            if (match) {
                // Genera el token con el ID, correo electrónico y nombre del usuario
                const token = generatetoken(user); // La función 'generatetoken' debe incluir 'name' en el payload
                
                // Enviar respuesta con el usuario y el token
                return res.status(200).json({
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username, // Nombre de usuario incluido
                    },
                    token: token
                });
            } else {
                return res.status(404).json({ password: "Contraseña incorrecta" });
            }
        } else {
            return res.status(404).json({ email: "Email incorrecto" });
        }
    } catch (error) {
        return res.status(500).json({ name: error.name, error: error.message });
    }
}

//Forgot-Password

export const forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No se encontró un usuario con ese correo electrónico.' });
        }

        // Generar un nuevo token de restablecimiento y código
        const resetPasswordToken = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
        const resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración

        // Guardar el código de restablecimiento y la expiración en el usuario
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        // Configurar el transportador de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Usamos el servicio de Gmail
            auth: {
                user: process.env.EMAIL_USER, // El correo que enviará el mensaje
                pass: process.env.EMAIL_PASS, // Contraseña o aplicación de contraseñas
            },
        });

        // Configurar el contenido del correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña',
            html: `<p>Para restablecer su contraseña, ingrese el siguiente código:</p>
                   <p><strong>${resetPasswordToken}</strong></p>`, // Mostrar el código generado
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Se ha enviado el código de recuperación de contraseña.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el correo.' });
    }
};


//Resetear Contraseña

export const resetPasswordController = async (req, res) => {
    const { code } = req.body; // Código recibido en el cuerpo de la solicitud
    const { password } = req.body; // Nueva contraseña enviada en el cuerpo de la solicitud

    try {
        // Buscar al usuario por el código y verificar que no haya expirado
        const user = await User.findOne({
            resetPasswordToken: code, // Comparar con el código de restablecimiento
            resetPasswordExpires: { $gt: Date.now() } // Asegura que la fecha de expiración sea mayor que la fecha actual
        });

        if (!user) {
            return res.status(400).json({ message: 'Código inválido o ha expirado.' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Actualizar la contraseña y limpiar el token de restablecimiento
        user.password = hashedPassword;
        user.resetPasswordToken = undefined; // Limpiar el token después de usarlo
        user.resetPasswordExpires = undefined; // Limpiar la fecha de expiración también
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};