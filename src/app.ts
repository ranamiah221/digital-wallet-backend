import express, { Application, NextFunction, Request, Response } from 'express';
import { router } from './app/routes';

const app:Application=express();

app.use(express.json())
app.use('/api/v1', router)

app.get('/', (req:Request, res:Response)=>{
    res.send("WelCome To Digital Wallet System.")
})

export default app;

