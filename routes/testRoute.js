import express from 'express';
import { getTestController } from '../controllers/testController.js';
const testRoute = express.Router();

testRoute.get('/test', getTestController);

export default testRoute;