// import React, { useContext, useState } from "react";
// import Navbar from "../components/Navbar";
// import { assets, jobsApplied } from "../assets/assets";
// import moment from "moment";
// import Footer from "../components/Footer";
// import { AppContext } from "../context/AppContext";
// import { useAuth, useUser } from "@clerk/clerk-react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Application = () => {
//   const { user } = useUser();
//   const { getToken } = useAuth();
//   const [isEdit, setisEdit] = useState(false);
//   const [resume, setresume] = useState(null);

//   const { backendUrl, userData, userApplication, fetchUserData } =
//     useContext(AppContext);

//     //console.log("From Application.jsx → userApplication:", userApplication);

//   const updateResume = async () => {
//     try {
//       const formData = new FormData();

//       formData.append("resume", resume);

//       const token = await getToken();

//       const { data } = await axios.post(
//         backendUrl + "/api/users/update-resume",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         await fetchUserData();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }

//     setisEdit(false);
//     setresume(null);
//   };
//   return (
//     <>
//       <Navbar />
//       <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
//         <h2 className="text-xl font-semibold">Your Resume</h2>
//         {/* // Fix the resume section */}
//         <div className="flex gap-2 mt-3 mb-6 ">
//           {isEdit ||
//           (userData && (!userData.resume || userData.resume.trim() === "")) ? (
//             <>
//               <label
//                 className="flex items-center cursor-pointer"
//                 htmlFor="resumeupload"
//               >
//                 <p className="px-4 py-2 mr-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200">
//                   {resume ? resume.name : "Select Resume"}
//                 </p>
//                 <input
//                   id="resumeupload"
//                   onChange={(e) => setresume(e.target.files[0])}
//                   accept="application/pdf"
//                   type="file"
//                   hidden
//                 />
//                 <img src={assets.profile_upload_icon} alt="" />
//               </label>

//               {/* FIX: Call updateResume instead of setisEdit(false) */}
//               <button
//                 onClick={updateResume}
//                 disabled={!resume}
//                 className={`px-4 py-2 rounded-lg ${
//                   resume
//                     ? "bg-green-100 border border-green-400 hover:bg-green-200"
//                     : "bg-gray-100 border border-gray-300 cursor-not-allowed"
//                 }`}
//               >
//                 Save
//               </button>

//               <button
//                 onClick={() => setisEdit(false)}
//                 className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//             </>
//           ) : (
//             <div className="flex gap-2 ">
//               <a
//                 className="px-4 py-2 text-blue-600 bg-blue-100 rounded-lg"
//                 href={userData?.resume || "#"}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Resume
//               </a>
//               <button
//                 onClick={() => setisEdit(true)}
//                 className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Edit
//               </button>
//             </div>
//           )}
//         </div>
//         {/* <div className="flex gap-2 mt-3 mb-6 ">
//         {
//           isEdit || userData && userData.resume === "" ?
//          <>
//          <label className="flex items-center" htmlFor="resumeupload">
//           <p className="px-4 py-2 mr-2 text-blue-600 bg-blue-100 rounded-lg">{resume ? resume.name : "Select Resume"}</p>
//           <input id="resumeupload" onChange={e => setresume(e.target.files[0])} accept="application/pdf" type="file" hidden  />
//           <img src={assets.profile_upload_icon} alt="" />
//          </label>

//          <button onClick={e=>setisEdit(false)} className="px-4 py-2 bg-green-100 border border-green-400 rounded-lg">Save</button>

//          </> : 
//          <div className="flex gap-2 ">
//           <a className="px-4 py-2 text-blue-600 bg-blue-100 rounded-lg" href="">
//             Resume
//           </a>
//           <button onClick={()=>setisEdit(true)} className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg">
//             Edit
//           </button>
//           </div>
//         }
//           </div> */}
//         {/* applied section */}
//         <h2 className="mb-4 text-xl font-semibold ">Jobs Applied</h2>
//         <table className="min-w-full bg-white border rounded-lg">
//           <thead>
//             <tr>
//               <th className="px-4 py-3 text-left border-b">Company</th>
//               <th className="px-4 py-3 text-left border-b">Job Title</th>
//               <th className="px-4 py-3 text-left border-b max-sm:hidden">
//                 Location
//               </th>
//               <th className="px-4 py-3 text-left border-b max-sm:hidden">
//                 Date
//               </th>
//               <th className="px-4 py-3 text-left border-b">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {userApplication.map((job, index) =>
//               true ? (
//                 <tr>
//                   <td className="flex items-center gap-2 px-4 py-3 border-b">
//                     <img className="w-8 h-8" src={job.logo} alt="" />
//                     {job.company}
//                   </td>
//                   <td className="px-4 py-2 border-b">{job.title}</td>
//                   <td className="px-4 py-2 border-b max-sm:hidden">
//                     {job.location}
//                   </td>
//                   <td className="px-4 py-2 border-b max-sm:hidden">
//                     {moment(job.date).format("ll")}
//                   </td>
//                   <td className="px-4 py-2 border-b">
//                     <span
//                       className={`${
//                         job.status === "Accepted"
//                           ? "bg-green-100"
//                           : job.status === "Rejected"
//                           ? "bg-red-100"
//                           : "bg-blue-100"
//                       } px-4 py-1.5 rounded`}
//                     >
//                       {" "}
//                       {job.status}
//                     </span>
//                   </td>
//                 </tr>
//               ) : null
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Application;







import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const Application = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isEdit, setisEdit] = useState(false);
  const [resume, setresume] = useState(null);
  const [loading, setLoading] = useState(true);

  const { backendUrl, userData, userApplication, fetchUserData, fetchUserApplications } =
    useContext(AppContext);

  // Debug: Check userApplication data
  console.log("From Application.jsx → userApplication:", userApplication);
  console.log("userApplication length:", userApplication?.length);
  console.log("userData:", userData);

  // Fetch applications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both user data and applications
        await fetchUserData();
        
        // If fetchUserApplications function exists, call it separately
        if (fetchUserApplications && typeof fetchUserApplications === 'function') {
          await fetchUserApplications();
        } else {
          // If no separate function, try to fetch applications directly
          await fetchApplicationsDirectly();
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  // Direct API call to fetch applications if context function doesn't exist
  const fetchApplicationsDirectly = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/users/applications", 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Direct API response:", data);
      
      if (data.success && data.applications) {
        // This should update userApplication in context
        // You might need to add a setter function in context
        console.log("Applications fetched:", data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications directly:", error);
    }
  };

  const updateResume = async () => {
    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/users/update-resume",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setisEdit(false);
    setresume(null);
  };

  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        
        {/* Resume section */}
        <div className="flex gap-2 mt-3 mb-6">
          {isEdit ||
          (userData && (!userData.resume || userData.resume.trim() === "")) ? (
            <>
              <label
                className="flex items-center cursor-pointer"
                htmlFor="resumeupload"
              >
                <p className="px-4 py-2 mr-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="resumeupload"
                  onChange={(e) => setresume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="" />
              </label>

              <button
                onClick={updateResume}
                disabled={!resume}
                className={`px-4 py-2 rounded-lg ${
                  resume
                    ? "bg-green-100 border border-green-400 hover:bg-green-200"
                    : "bg-gray-100 border border-gray-300 cursor-not-allowed"
                }`}
              >
                Save
              </button>

              <button
                onClick={() => setisEdit(false)}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="px-4 py-2 text-blue-600 bg-blue-100 rounded-lg"
                href={userData?.resume || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
              <button
                onClick={() => setisEdit(true)}
                className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Jobs Applied section */}
        <h2 className="mb-4 text-xl font-semibold">Jobs Applied</h2>
        
        {loading ? (
          <div className="py-8 text-center">
            <p>Loading applications...</p>
          </div>
        ) : !userApplication || userApplication.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No applications found. Apply to some jobs to see them here!</p>
          </div>
        ) : (
          <table className="min-w-full bg-white border rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left border-b">Company</th>
                <th className="px-4 py-3 text-left border-b">Job Title</th>
                <th className="px-4 py-3 text-left border-b max-sm:hidden">
                  Location
                </th>
                <th className="px-4 py-3 text-left border-b max-sm:hidden">
                  Date
                </th>
                <th className="px-4 py-3 text-left border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplication && Array.isArray(userApplication) ? userApplication.map((job, index) => (
                <tr key={job._id || index}>
                  <td className="flex items-center gap-2 px-4 py-3 border-b">
                    <img 
                      className="w-8 h-8 rounded" 
                      src={job.companyId?.image || job.jobId?.companyId?.image || job.logo || assets.company_icon} 
                      alt="Company Logo"
                      onError={(e) => {
                        e.target.src = assets.company_icon;
                      }}
                    />
                    {job.companyId?.name || job.jobId?.companyId?.name || job.company || "Unknown Company"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {job.jobId?.title || job.title || "Unknown Title"}
                  </td>
                  <td className="px-4 py-2 border-b max-sm:hidden">
                    {job.jobId?.location || job.location || "Unknown Location"}
                  </td>
                  <td className="px-4 py-2 border-b max-sm:hidden">
                    {moment(job.date || job.createdAt || job.appliedAt).format("ll")}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span
                      className={`${
                        job.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : job.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      } px-4 py-1.5 rounded`}
                    >
                      {job.status || "Pending"}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Application;