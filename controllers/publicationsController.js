import Publication from '../models/publicationModel.js'; // Asegúrate de importar el modelo de Post


//Crear Publicacion
export const createPostController = async (req, res) => {
    const { content, media } = req.body;
    const userId = req.user._id; 

    try {
        if (!content || !userId) {
            console.log('El contenido o el usuario no están presentes');
            return res.status(400).json({ message: 'El contenido de la publicación es obligatorio.' });
        }
        const newPost = new Publication({
            author: userId, 
            content: content, 
            media: media || [], 
        });

        await newPost.save();

        // Responder con el post recién creado
        res.status(201).json({
            message: 'Publicación creada con éxito.',
            post: newPost,
        });
    } catch (error) {
        console.error('Error al crear la publicación:', error);
        res.status(500).json({ message: 'Error al crear la publicación.' });
    }
};


//Obtener todas las Publicaciones

export const getAllPostsController = async (req, res) => {
    try {
        const posts = await Publication.find()
            .populate('author', 'name email') 
            .sort({ createdAt: -1 }); 

        res.status(200).json({
            message: 'Publicaciones obtenidas correctamente.',
            posts,
        });
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        res.status(500).json({ message: 'Error al obtener las publicaciones.' });
    }
};

//Eliminar Publicaciones
export const deletePostController = async (req, res) => {
    const { postId } = req.params;  // Obtenemos el ID de la publicación desde los parámetros de la URL
    
    try {
        // Buscar y eliminar la publicación
        const deletedPost = await Publication.findByIdAndDelete(postId);

        // Si no se encuentra la publicación, respondemos con un error
        if (!deletedPost) {
            return res.status(404).json({ message: 'Publicación no encontrada.' });
        }

        // Responder con éxito
        res.status(200).json({
            message: 'Publicación eliminada correctamente.',
            post: deletedPost,
        });
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        res.status(500).json({ message: 'Error al eliminar la publicación.' });
    }
};

// Editar una publicación
export const editPostController = async (req, res) => { 
    const { postId } = req.params;  
    const { content, media } = req.body;  

    try {
        
        if (!content && !media) {
            return res.status(400).json({ message: 'Se debe proporcionar al menos un campo para editar (contenido o medios).' });
        }
        const post = await Publication.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Publicación no encontrada.' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para editar esta publicación.' });
        }

        if (content) post.content = content;
        if (media) post.media = media;

        post.updatedAt = Date.now();

        await post.save();

        res.status(200).json({
            message: 'Publicación actualizada con éxito.',
            post,
        });

    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        res.status(500).json({ message: 'Error al actualizar la publicación.' });
    }
};