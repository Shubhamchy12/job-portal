import express from 'express'
import { changeVisiblity, companyPostedJob, getCompanyData, getCompanyJobApplication, jobApplicationStatus, loginCompany, postJob, registerCompany } from '../controllers/companyControllers.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router =  express.Router()

// register a company

router.post('/register', upload.single('image'), registerCompany)

//company login

router.post('/login',loginCompany)

// get company data

router.get('/company',protectCompany,getCompanyData)

// post a job

router.post('/post-job',protectCompany,postJob)

//get Applicants Data of company

router.get('/applicants',protectCompany,getCompanyJobApplication)

// get company job list

router.get('/list-job',protectCompany,companyPostedJob)

// change applications status

router.post('/change-status',protectCompany,jobApplicationStatus)

// change Applications visiblity

router.post('/change-visiblity',protectCompany,changeVisiblity)

export default router

