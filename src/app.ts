import express, { Application, Request, Response } from 'express';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import cookieParser from 'cookie-parser';


const app:Application=express();

app.set("trust proxy",1);
app.use(cookieParser())
app.use(express.json())
app.use('/api/v1', router)

app.get('/', (req:Request, res:Response)=>{
    res.send("WelCome To Digital Wallet System.")
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;

