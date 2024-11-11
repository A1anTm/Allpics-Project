import Transaction from '../models/transactionModel.js'; 
import User from '../models/userModel.js';

export const createTransactionController = async (req, res) => {
    const { amount, currency, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!amount || !currency || !paymentMethod) {
        return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    try {
        const newTransaction = new Transaction({
            user: userId,
            amount,
            currency,
            status: 'pending',
            paymentMethod
        });

        await newTransaction.save();

        const user = await User.findById(userId);
        user.transactions.push(newTransaction._id);
        await user.save();

        res.status(201).json({
            message: 'Transacción creada correctamente.',
            transaction: newTransaction
        });
    } catch (error) {
        console.error('Error al crear la transacción:', error);
        res.status(500).json({ message: 'Error al crear la transacción.' });
    }
};

export const getPaymentHistoryController = async (req, res) => {
    try {
        const userId = req.user._id;

        const transactions = await Transaction.find({ user: userId });

        res.status(200).json({
            message: 'Historial de pagos obtenido correctamente.',
            transactions: transactions,
        });
    } catch (error) {
        console.error('Error al obtener el historial de pagos:', error);
        res.status(500).json({ message: 'Error al obtener el historial de pagos.' });
    }
};
