import express from 'express';
import { createBus, getAllBuses, getBusInfo } from '../controller/busController.js';

const router = express.Router();

router.get("/:busNumber",getBusInfo);
router.get("/",getAllBuses);
router.post("/",createBus);

export default router;