import { Router } from 'express';
import { getAllSubscriptionsController, createSubscriptionController, cancelSubscriptionController } from '../controllers/subsController.js';
import { isAuth } from "../middlewares/auth.js";

const subsRoutes = Router();

subsRoutes.get('/subscriptions', getAllSubscriptionsController);

subsRoutes.post('/subscriptions/subscribe', isAuth, createSubscriptionController);

subsRoutes.patch('/subscriptions/cancel', isAuth, cancelSubscriptionController);

export default subsRoutes;