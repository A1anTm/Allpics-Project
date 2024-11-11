import express, { json } from 'express';
import {config} from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes  from '../routes/userRoutes.js'
import publicationsRoutes  from '../routes/publicationRoutes.js'
import commentsRoutes  from '../routes/commentsRoutes.js'
import messagesRoutes from '../routes/messagesRoutes.js';
import adminRoutes from '../routes/adminRoutes.js';
import subsRoutes from '../routes/subsRoutes.js';
import paymentsRoutes from '../routes/paymentsRoutes.js';

config({path: './Config/.env'});

const corsOption = {
    origin: ["http://localhost:3002"], 
    optionsSuccessStatus: 200, 
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"] 
}



const app = express();
app.use(cors(corsOption))

const port = process.env.PORT


app.use(express.json());

app.use("/Users", userRoutes)
app.use("/Publication", publicationsRoutes)
app.use('/Comments', commentsRoutes);
app.use('/Messages', messagesRoutes);
app.use('/Admin', adminRoutes);
app.use('/Subs', subsRoutes);
app.use('/Payments', paymentsRoutes);

try {
    mongoose.connect(process.env.DATABASE_URL);
} catch (error) {
    
}


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})