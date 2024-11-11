import { Router } from 'express';
import { getConversationsController, sendMessageController  } from '../controllers/messagesController.js'; // Asegúrate de que la ruta del controlador sea correcta
import { isAuth } from '../middlewares/auth.js'; // Middleware para la autenticación

const messagesRoutes = Router();

// Ruta para obtener todas las conversaciones del usuario autenticado
messagesRoutes.get('/messages', isAuth, getConversationsController);

// Ruta para enviar un mensaje directo
messagesRoutes.post('/messages', isAuth, sendMessageController);


export default messagesRoutes;