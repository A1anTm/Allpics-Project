import jwt from 'jsonwebtoken';  // Usa la exportación por defecto

export const generatetoken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.username,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,  // Usa la variable de entorno JWT_SECRET aquí
        {
            expiresIn: "20m",  // Tiempo de expiración del token
        }
    );
};

// Verificar autenticación
export const isAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado 'Authorization'

    if (!token) {
        return res.status(401).json({ message: 'Token no enviado.' });
    }

    try {
        // Verificar el token usando la clave secreta almacenada en el archivo .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log('Token decodificado:', decoded); // Verifica el token decodificado
        
        req.user = decoded;  // Asegúrate de que 'req.user' contenga el objeto decodificado
        
        next(); // Continuamos al siguiente middleware o controlador
    } catch (error) {
        console.error("Error al verificar el token:", error);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};



export const generateTokenEmail = (userId) => {
    return jwt.sign({ id: userId }, process.env.PASSWORD, { expiresIn: '10m' });
};