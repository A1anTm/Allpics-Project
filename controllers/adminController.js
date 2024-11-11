import User from '../models/userModel.js';
import Publication from '../models/publicationModel.js';
import Subscription from '../models/suscripcionModel.js';

export const getAllUsersController = async (req, res) => {

    console.log('Usuario autenticado:', req.user);

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden ver los usuarios.' });
    }

    try {
        const users = await User.find();

        res.status(200).json({
            message: 'Usuarios obtenidos correctamente.',
            users: users,
        });
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios.' });
    }
};

export const editUserController = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden editar usuarios.' });
    }

    const { userId } = req.params;
    const { username, email, bio, profilePicture, role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, bio, profilePicture, role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario editado correctamente.', user: updatedUser });
    } catch (error) {
        console.error('Error al editar el usuario:', error);
        res.status(500).json({ message: 'Error al editar el usuario.' });
    }
};

export const deleteUserController = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden eliminar o bloquear usuarios.' });
    }

    const { userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario.' });
    }
};


export const getReportedPostsController = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden ver los reportes.' });
    }
    try {
        const reportedPosts = await Publication.find({ isReported: true });
        res.status(200).json({ message: 'Reportes obtenidos correctamente.', reportedPosts });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los reportes.' });
    }
};


export const deletePostController = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden eliminar publicaciones.' });
    }
    try {
        const { postId } = req.params;
        await Publication.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Publicación eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la publicación.' });
    }
};

export const generatePlatformReportController = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden generar reportes.' });
    }
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Publication.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({ isActive: true });
        
        res.status(200).json({
            message: 'Reporte de actividad generado correctamente.',
            report: {
                totalUsers,
                totalPosts,
                activeSubscriptions,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el reporte.' });
    }
};
