import { Router } from 'express';
import { addCommentController, deleteCommentController, editCommentController } from '../controllers/commentsController.js';
import { isAuth } from '../middlewares/auth.js';

const commentsRoutes = Router();

// Route to add a comment to a post
commentsRoutes.post('/posts/:postId/comments', isAuth, addCommentController);

// Ruta para eliminar comentarios
commentsRoutes.delete('/comments/:commentId', isAuth, deleteCommentController);

// Ruta para editar un comentario
commentsRoutes.patch('/comments/:commentId', isAuth, editCommentController);

export default commentsRoutes;