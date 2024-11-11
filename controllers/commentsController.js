import Comments from '../models/commentsModel.js'; // Make sure this path is correct
import Publication from '../models/publicationModel.js'; // Import the Publication model to verify the post

// Add a Comment
export const addCommentController = async (req, res) => {
    const { postId } = req.params; // Post ID from the URL
    const { content } = req.body; // Comment content from the request body
    const userId = req.user._id; // Get the user ID from the authenticated user

    try {
        // Check if the publication exists
        const publication = await Publication.findById(postId);
        if (!publication) {
            return res.status(404).json({ message: 'Publicación no encontrada.' });
        }

        // Check if the comment content is provided
        if (!content) {
            return res.status(400).json({ message: 'El contenido del comentario es obligatorio.' });
        }

        // Create a new comment
        const newComment = new Comments({
            post: postId,
            author: userId,
            content: content,
        });

        // Save the comment to the database
        await newComment.save();

        // Respond with success
        res.status(201).json({
            message: 'Comentario agregado exitosamente.',
            comment: newComment,
        });
    } catch (error) {
        console.error('Error al agregar el comentario:', error);
        res.status(500).json({ message: 'Error al agregar el comentario.' });
    }
};


//eliminar un comentario
export const deleteCommentController = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Usar el ID del usuario autenticado a través del token

    try {
        // Buscar el comentario por su ID
        const comment = await Comments.findById(commentId);

        // Si el comentario no existe, retornar un error
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }

        // Verificar si el usuario autenticado es el autor del comentario
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario.' });
        }

        // Eliminar el comentario
        await Comments.findByIdAndDelete(commentId);

        // Opcional: eliminar la referencia del comentario en la publicación asociada
        await Publication.findByIdAndUpdate(comment.post, {
            $pull: { comments: commentId }
        });

        res.status(200).json({ message: 'Comentario eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        res.status(500).json({ message: 'Error al eliminar el comentario.' });
    }
};

// Editar un comentario
export const editCommentController = async (req, res) => {
    const { commentId } = req.params; // ID del comentario a editar
    const { content } = req.body; // Contenido nuevo del comentario
    const userId = req.user._id; // ID del usuario autenticado desde el token

    try {
        // Buscar el comentario por su ID
        const comment = await Comments.findById(commentId);

        // Si el comentario no existe, devolver un error
        if (!comment) {
            return res.status(404).json({ message: 'Comentario no encontrado.' });
        }

        // Verificar si el usuario autenticado es el autor del comentario
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para editar este comentario.' });
        }

        // Actualizar el contenido del comentario
        comment.content = content;
        comment.updatedAt = Date.now(); // Actualizar la fecha de modificación
        await comment.save(); // Guardar los cambios en la base de datos

        res.status(200).json({
            message: 'Comentario editado correctamente.',
            comment,
        });
    } catch (error) {
        console.error('Error al editar el comentario:', error);
        res.status(500).json({ message: 'Error al editar el comentario.' });
    }
};