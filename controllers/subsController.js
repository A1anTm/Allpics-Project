import Subscription from '../models/suscripcionModel.js';
import User from '../models/userModel.js';

//Obtener todas las suscripciones
export const getAllSubscriptionsController = (req, res) => {
    const subscriptions = [
        {
            plan: "premium",
            price: 5.9
        },
        {
            plan: "enterprise",
            price: 10.99
        },
        {
            plan: "free",
            price: 0
        }
    ];

    res.status(200).json({
        message: 'Suscripciones obtenidas correctamente.',
        subscriptions: subscriptions
    });
};


export const createSubscriptionController = async (req, res) => {
    const { plan } = req.body;
    const userId = req.user._id;

    // Determinar el precio basado en el plan
    let price;
    switch (plan) {
        case 'free':
            price = 0;
            break;
        case 'premium':
            price = 5.9;
            break;
        case 'enterprise':
            price = 10.99;
            break;
        default:
            return res.status(400).json({ message: 'Plan inválido' });
    }

    try {
        // Crear la nueva suscripción
        const subscription = new Subscription({
            user: userId,
            plan,
            price,
        });

        await subscription.save();

        await User.findByIdAndUpdate(userId, {
            subscription: subscription._id,
        });

        res.status(201).json({
            message: 'Suscripción creada y usuario actualizado.',
            subscription,
        });
    } catch (error) {
        console.error('Error al crear la suscripción:', error);
        res.status(500).json({ message: 'Error al crear la suscripción.' });
    }
};


export const cancelSubscriptionController = async (req, res) => {
    const userId = req.user._id;

    try {
        const subscription = await Subscription.findOne({ user: userId, isActive: true });

        if (!subscription) {
            return res.status(404).json({ message: 'No se encontró una suscripción activa.' });
        }

        subscription.isActive = false;
        await subscription.save();

        await User.findByIdAndUpdate(userId, { subscription: null });

        res.status(200).json({ message: 'Suscripción cancelada exitosamente.' });
    } catch (error) {
        console.error('Error al cancelar la suscripción:', error);
        res.status(500).json({ message: 'Error al cancelar la suscripción.' });
    }
};