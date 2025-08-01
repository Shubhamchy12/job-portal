import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import LoadingComponent from "../components/LoadingComponent";
import Navbar from "../components/Navbar";
import kconvert from "k-convert";
import moment from "moment";
import JobCart from "../components/JobCart";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
const ApplyJob = () => {
  const { id } = useParams();

  const { getToken } = useAuth();

  const navigate = useNavigate();

  // yeah data ko static fetch kar raha hai
  const [jobdata, setjobdata] = useState(null);

  const [isAlreadyApplied,setisAlreadyApplied] = useState(false)

  const { jobs, backendUrl, userData, userApplication,fetchUserApplications } =
    useContext(AppContext);
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);

      if (data.success) {
        setjobdata(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const applyHandler = async () => {
    try {
      if (!userData) {
        return toast.error("Login to apply for jobs");
      }

      if (!userData.resume || userData.resume.trim() === "") {
        navigate("/applications");
        return toast.error("Upload resume to apply");
      }

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/users/apply",
        { jobId: jobdata._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const checkAlreadyApplied = ()=>{
    const hasApplied = userApplication.some(item => item.jobId._id === jobdata._id)

    setisAlreadyApplied(hasApplied)
  }




  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(()=>{
    if(userApplication && userApplication.length > 0 && jobdata){
      checkAlreadyApplied()
      
    }
  },[jobdata,userApplication,id])
  return jobdata ? (
    <>
      <Navbar />

      <div className="container flex flex-col min-h-screen px-4 py-10 mx-auto 2xl:px-20">
        <div className="w-full text-black bg-white rounded-lg">
          <div className="flex flex-wrap justify-center gap-8 py-20 mb-6 border md:justify-between px-14 bg-sky-50 border-sky-400 rounded-xl">
            <div className="flex flex-col items-center md:flex-row">
              <img
                className="h-24 p-4 mr-4 bg-white border rounded-lg max-md:mb-4"
                src={jobdata.companyId.image}
                alt=""
              />
              <div className="text-center md:text-left text-neutral-700 ">
                <h1 className="text-2xl font-medium sm:text-4xl">
                  {jobdata.title}
                </h1>
                <div className="flex flex-row flex-wrap items-center gap-6 mt-2 text-gray-600 max-md:justify-center gap-y-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobdata.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobdata.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobdata.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(jobdata.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-sm text-end max-md:mx-auto max-md:text-center">
              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded"
              >
                {isAlreadyApplied? 'Already Applied':'Apply Now'}
              </button>
              <p className="mt-1 text-gray-600 ">
                Posted {moment(jobdata.date).fromNow()}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between lg:flex-row">
            <div className="w-full lg:w-2/3">
              <h2 className="mb-4 text-2xl font-bold">Job description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobdata.description }}
              ></div>
              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded mt-10"
              >
                {isAlreadyApplied? 'Already Applied':'Apply Now'}
              </button>
            </div>
            {/* right section more job */}

            <div className="w-full mt-8 space-y-5 lg:w-1/3 lg:mt-0 lg:ml-8">
              <h2>More jobs from {jobdata.companyId.name}</h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobdata._id &&
                    job.companyId._id === jobdata.companyId._id
                )
                .filter((job) => {
                  
                      // set of job applied
                      {
                        const appliedJobs = new set(userApplication.map(app => app.jobId && app.jobId._id))

                          // return true if the user has not already applied for this job
                        return  !appliedJobs.has(job._id)
                      }
                })
                .slice(0, 4)
                .map((job, index) => (
                  <JobCart key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <LoadingComponent />
  );
};

export default ApplyJob;


// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import LoadingComponent from "../components/LoadingComponent";
// import Navbar from "../components/Navbar";
// import kconvert from "k-convert";
// import moment from "moment";
// import JobCart from "../components/JobCart";  
// import Footer from "../components/Footer";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "@clerk/clerk-react";
// import { set } from "mongoose";

// const ApplyJob = () => {
//   const { id } = useParams();
//   const { getToken } = useAuth();
//   const navigate = useNavigate();

//   const [jobdata, setjobdata] = useState(null);
//   const [isAlreadyApplied, setisAlreadyApplied] = useState(false);

//   const { jobs, backendUrl, userData, userApplication, fetchUserApplications } =
//     useContext(AppContext);

//   const fetchJob = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);

//       if (data.success) {
//         setjobdata(data.job);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const checkAlreadyApplied = () => {
//     // Safe check for userApplication and jobdata
//     if (userApplication && Array.isArray(userApplication) && jobdata) {
//       const hasApplied = userApplication.some(
//         item => item.jobId && item.jobId._id === jobdata._id
//       );
//       setisAlreadyApplied(hasApplied);
//     }
//   };

//   const applyHandler = async () => {
//     try {
//       if (!userData) {
//         return toast.error("Login to apply for jobs");
//       }

//       if (!userData.resume || userData.resume.trim() === "") {
//         navigate("/applications");
//         return toast.error("Upload resume to apply");
//       }

//       const token = await getToken();

//       const { data } = await axios.post(
//         backendUrl + "/api/users/apply",
//         { jobId: jobdata._id },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         setisAlreadyApplied(true);
//         fetchUserApplications()
//         // Refresh applications data
//         if (fetchUserApplications) {
//           fetchUserApplications();
//         }
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchJob();
//   }, [id]);

//   useEffect(() => {
//     // Safe check for userApplication length - THIS FIXES LINE 85 ERROR
//     if (userApplication && Array.isArray(userApplication) && userApplication.length > 0 && jobdata) {
//       checkAlreadyApplied();
//     }
//   }, [jobdata, userApplication, id]);

//   return jobdata ? (
//     <>
//       <Navbar />
//       <div className="container flex flex-col min-h-screen px-4 py-10 mx-auto 2xl:px-20">
//         <div className="w-full text-black bg-white rounded-lg">
//           <div className="flex flex-wrap justify-center gap-8 py-20 mb-6 border md:justify-between px-14 bg-sky-50 border-sky-400 rounded-xl">
//             <div className="flex flex-col items-center md:flex-row">
//               <img
//                 className="h-24 p-4 mr-4 bg-white border rounded-lg max-md:mb-4"
//                 src={jobdata.companyId?.image || assets.company_icon}
//                 alt="Company Logo"
//               />
//               <div className="text-center md:text-left text-neutral-700">
//                 <h1 className="text-2xl font-medium sm:text-4xl">
//                   {jobdata.title}
//                 </h1>
//                 <div className="flex flex-row flex-wrap items-center gap-6 mt-2 text-gray-600 max-md:justify-center gap-y-2">
//                   <span className="flex items-center gap-1">
//                     <img src={assets.suitcase_icon} alt="" />
//                     {jobdata.companyId?.name || "Unknown Company"}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <img src={assets.location_icon} alt="" />
//                     {jobdata.location}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <img src={assets.person_icon} alt="" />
//                     {jobdata.level}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <img src={assets.money_icon} alt="" />
//                     CTC: {kconvert.convertTo(jobdata.salary)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col justify-center text-sm text-end max-md:mx-auto max-md:text-center">
//               <button
//                 onClick={applyHandler}
//                 disabled={isAlreadyApplied}
//                 className={`p-2.5 px-10 text-white rounded ${
//                   isAlreadyApplied 
//                     ? "bg-gray-400 cursor-not-allowed" 
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
//               </button>
//               <p className="mt-1 text-gray-600">
//                 Posted {moment(jobdata.date).fromNow()}
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col items-start justify-between lg:flex-row">
//             <div className="w-full lg:w-2/3">
//               <h2 className="mb-4 text-2xl font-bold">Job description</h2>
//               <div
//                 className="rich-text"
//                 dangerouslySetInnerHTML={{ __html: jobdata.description }}
//               ></div>
//               <button
//                 onClick={applyHandler}
//                 disabled={isAlreadyApplied}
//                 className={`p-2.5 px-10 text-white rounded mt-10 ${
//                   isAlreadyApplied 
//                     ? "bg-gray-400 cursor-not-allowed" 
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {isAlreadyApplied ? 'Already Applied' : 'Apply Now'}
//               </button>
//             </div>

//             {/* Right section - more jobs */}
//             <div className="w-full mt-8 space-y-5 lg:w-1/3 lg:mt-0 lg:ml-8">
//               <h2>More jobs from {jobdata.companyId?.name || "this company"}</h2>
//               {jobs && Array.isArray(jobs) ? 
//                 jobs
//                   .filter(
//                     (job) =>
//                       // job._id !== jobdata._id &&
//                       // job.companyId?._id === jobdata.companyId?._id

//                       // set of job applied
//                       {
//                         const appliedJobs = new set(userApplication.map(app => app.jobId && app.jobId._id))

//                           // return true if the user has not already applied for this job
//                         return  !appliedJobs.has(job._id)
                        
//                       }

                    

                      
//                   )
//                   .slice(0, 4)
//                   .map((job, index) => (
//                     <JobCart key={job._id || index} job={job} />
//                   ))
//                 : 
//                 <p>No similar jobs found</p>
//               }
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   ) : (
//     <LoadingComponent />
//   );
// };

// export default ApplyJob;