import jwt from 'jsonwebtoken'

import Company from '../models/company.js'

export const protectCompany = async (req,res,next) => {


    const token = req.headers.token

    if(!token){
        return res.json({success:false,message:'Not authorized Login Again'})
    }

    try {
        const decode = jwt.verify(token,process.env.JWT_SECRET)

        req.company = await Company.findById(decode.id).select('-password')

        next()
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// import jwt from 'jsonwebtoken';
// import Company from '../models/company.js';

// export const protectCompany = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   console.log("Header: ", authHeader);  // Debug

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.json({ success: false, message: 'Token not found in headers' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token: ", decoded);  // Debug

//     const company = await Company.findById(decoded.id).select('-password');
//     console.log("Company found: ", company);  // Debug

//     if (!company) {
//       return res.json({ success: false, message: 'Company not found from token' });
//     }

//     req.company = company;
//     next();
//   } catch (error) {
//     console.log("JWT Error: ", error.message);  // Debug
//     res.json({ success: false, message: 'Invalid token or error verifying token' });
//   }
// };




