import express from 'express';
import { getUserData, login, logout, register } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRoutes = express.Router();

authRoutes.post('/register',register);
authRoutes.post('/login',login);
authRoutes.post('/logout',logout);
authRoutes.get('/data',userAuth,getUserData);

export default authRoutes;
