import { Router } from 'express';
import { getAllUsersController, editUserController, deleteUserController, getReportedPostsController, deletePostController, generatePlatformReportController } from '../controllers/adminController.js';
import { isAuth } from "../middlewares/auth.js";


const admin = Router();


//Ruta para obtener todos los usuarios
admin.get('/admin/users', isAuth, getAllUsersController);

//Ruta para editar un usuario
admin.patch('/admin/users/:userId', isAuth, editUserController);

//Ruta para eliminar un usuario
admin.delete('/admin/users/:userId', isAuth, deleteUserController);

admin.get('/admin/posts/reports', isAuth, getReportedPostsController);

admin.delete('/admin/posts/:postId', isAuth, deletePostController);

admin.get('/admin/reports', isAuth, generatePlatformReportController);

export default admin;
