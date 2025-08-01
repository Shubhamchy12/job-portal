import express from 'express'
import { getJob, getJobById } from '../controllers/jobController.js';

const router = express.Router()

// Route to get all job data

router.get('/',getJob)


// Route to get single job by ID

router.get('/:id',getJobById)


export default router;