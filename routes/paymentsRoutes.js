import { Router } from 'express';
import { createTransactionController, getPaymentHistoryController  } from '../controllers/payController.js'; 
import { isAuth } from '../middlewares/auth.js'; 

const paymentsRoutes = Router();

paymentsRoutes.post('/payments', isAuth, createTransactionController);

paymentsRoutes.get('/payments/history', isAuth, getPaymentHistoryController);

export default paymentsRoutes;