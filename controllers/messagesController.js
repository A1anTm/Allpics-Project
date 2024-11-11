import DirectMessage from '../models/directMessageModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

// Obtener todas las conversaciones del usuario
export const getConversationsController = async (req, res) => {
    const userId = req.user._id; // Usuario autenticado

    try {
        // Obtener todas las conversaciones en las que el usuario es el remitente o el receptor
        const messages = await DirectMessage.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender', 'name') // Opcional: muestra nombre u otros campos del usuario
        .populate('receiver', 'name')
        .sort({ createdAt: -1 }); // Ordenar por la fecha de creación de más reciente a más antiguo

        // Agrupar mensajes por el otro usuario (remitente o receptor)
        const conversations = messages.reduce((acc, message) => {
            const otherUser = message.sender._id.equals(userId) ? message.receiver : message.sender;
            const otherUserId = otherUser._id.toString();

            if (!acc[otherUserId]) {
                acc[otherUserId] = {
                    user: otherUser,
                    lastMessage: message.content,
                    createdAt: message.createdAt,
                    read: message.read,
                };
            }
            return acc;
        }, {});

        // Convertir conversaciones en un array para devolver como respuesta
        const conversationList = Object.values(conversations);

        res.status(200).json({
            message: 'Conversaciones obtenidas correctamente.',
            conversations: conversationList,
        });
    } catch (error) {
        console.error('Error al obtener las conversaciones:', error);
        res.status(500).json({ message: 'Error al obtener las conversaciones.' });
    }
};

//Mensajes directos
export const sendMessageController = async (req, res) => {
    const { receiverId, content } = req.body; 
    const senderId = req.user._id; 

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: 'El ID del receptor no es válido.' });
    }

    try {
        // Verificar si el receptor existe
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: 'Receptor no encontrado.' });
        }

        // Verificar si el contenido del mensaje está presente
        if (!content) {
            return res.status(400).json({ message: 'El contenido del mensaje es obligatorio.' });
        }

        // Crear el nuevo mensaje
        const newMessage = new DirectMessage({
            sender: senderId,  // Usuario que envía el mensaje
            receiver: receiverId,  // Usuario que recibe el mensaje
            content: content,  // El contenido del mensaje
            read: false,  // El mensaje está inicialmente como no leído
        });

        // Guardar el mensaje en la base de datos
        await newMessage.save();

        // Responder con el mensaje recién creado
        res.status(201).json({
            message: 'Mensaje enviado correctamente.',
            message: newMessage,
        });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ message: 'Error al enviar el mensaje.' });
    }
};