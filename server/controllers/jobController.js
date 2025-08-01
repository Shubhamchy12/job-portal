


// Get all Job

import JOB from "../models/job.js"

export const getJob = async (req,res)=>{

    try {
        const jobs = await JOB.find({visible:true})
        .populate({path:'companyId',select:'-password'})

        res.json({success:true,jobs})
    } catch (error) {
        res.json({success:false, message:error.message})
    }

}

// get a single job by id

export const getJobById = async(req,res)=>{
    try {
        const {id} = req.params

        const job = await JOB.findById(id)
        .populate({
            path:'companyId',
            select:'-password'
        })

        if(!job){
            return res.json({
                success:false,
                message:'Job Not Found'
            })
        }

        res.json({
            success:true,
            job
        })
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}