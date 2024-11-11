import { Router } from "express";
import { createPostController, getAllPostsController, deletePostController, editPostController } from "../controllers/publicationsController.js";
import { isAuth } from "../middlewares/auth.js";

const publicationsRoutes = Router();

// Crear Publicaciones
publicationsRoutes.post("/posts", isAuth, createPostController);

// Obtener todas las publicaciones (Feed)
publicationsRoutes.get("/posts", getAllPostsController);

// Eliminar publicaciones
publicationsRoutes.delete('/posts/:postId', isAuth, deletePostController);

// Editar publicación
publicationsRoutes.patch('/posts/:postId', isAuth, editPostController);

export default publicationsRoutes;