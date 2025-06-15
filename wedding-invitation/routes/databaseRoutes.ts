import express from 'express';
import { initializeDatabase } from '../controllers/databaseController';

const router = express.Router();

router.get('/connect', initializeDatabase);

export default router;