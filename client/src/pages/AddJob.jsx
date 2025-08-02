// import React, { useEffect, useRef, useState } from "react";
// import Quill from "quill";

// import { JobCategories, JobLocations } from "../assets/assets";
// import axios from "axios";
// import { useContext } from "react";
// import App from "../App";
// import { AppContext } from "../context/AppContext";
// import { toast } from "react-toastify";

// const AddJob = () => {
//   const [title, settitle] = useState("");
//   const [location, setlocation] = useState("Bangalore");
//   const [category, setcategory] = useState("programming");
//   const [level, setlevel] = useState("Beginner level");
//   const [salary, setsalary] = useState(0);

//   const editorRef = useRef(null);
//   const quillRef = useRef(null);

//   const {backendUrl, companyToken} = useContext(AppContext)

//   const onSubmithandler = async(e)=>{
//     e.preventDefault()

//     try {
//       const description = quillRef.current.root.innerHTML

//       const {data} = await axios.post(backendUrl + '/api/company/post-job',{
//         title,description,location,salary,category,level},
//         {headers:{token:companyToken}}
//       )

//       if(data.success){
//         toast.success(data.message)
//         settitle('')
//         setsalary(0)
//         quillRef.current.root.innerHTML = ""
//       } else{
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }
//   useEffect(() => {
//     // Initiate Quill only once
//     if (!quillRef.current && editorRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//       });
//     }
//   }, []);

  
//   return (
//     <form onSubmit={onSubmithandler} className="container flex flex-col items-start w-full gap-3 p-4">
//       <div className="w-full">
//         <p className="mb-2">Job Title</p>
//         <input
//           type="text"
//           placeholder="Type here"
//           onChange={(e) => settitle(e.target.value)}
//           value={title}
//           required
//           className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
//         />
//       </div>

//       <div className="w-full max-w-lg ">
//         <p className="my-2">Job Description</p>
//         <div ref={editorRef}></div>
//       </div>

//       <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
//         <div>
//           <p className="mb-2">Job Category</p>
//           <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setcategory(e.target.value)}>
//             {JobCategories.map((category, index) => (
//               <option key={index} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <p className="mb-2">Job Location</p>
//           <select className="w-full px-3 py-2 border-2 border-gray-300 rounded"  onChange={(e) => setlocation(e.target.value)}>
//             {JobLocations.map((location, index) => (
//               <option key={index} value={location}>
//                 {location}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <p className="mb-2">Job Level</p>
//           <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setlevel(e.target.value)}>
//             <option value="Beginner Level">Beginner Level</option>
//             <option value="Intermediate Level">Intermediate Level</option>
//             <option value="Senior Level">Senior Level</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <p className="mb-2">Job Salary</p>
//         <input min={0} className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]" onChange={e=>setsalary(e.target.value)} type="Number" placeholder="2500" />
//       </div> 

//       <button className="py-3 mt-4 text-white bg-black rounded w-28">ADD</button>   
//       </form>
//   );
// };

// export default AddJob;


import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Add this

const AddJob = () => {
  const [title, settitle] = useState("");
  const [location, setlocation] = useState("Bangalore");
  const [category, setcategory] = useState("programming");
  const [level, setlevel] = useState("Beginner level");
  const [salary, setsalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const navigate = useNavigate(); // Add this

  const { backendUrl, companyToken } = useContext(AppContext);

  // Authentication check - Add this
  useEffect(() => {
    if (!companyToken) {
      toast.error("Please login to access this page");
      navigate("/"); // Redirect to home
      return;
    }
  }, [companyToken, navigate]);

  const onSubmithandler = async (e) => {
    e.preventDefault();

    // Double check authentication
    if (!companyToken) {
      toast.error("Please login first");
      return;
    }

    try {
      const description = quillRef.current.root.innerHTML;

      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
        { title, description, location, salary, category, level },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        settitle("");
        setsalary(0);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  // Show loading or redirect message while checking auth
  if (!companyToken) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-gray-600">Please login to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmithandler} className="container flex flex-col items-start w-full gap-3 p-4">
      {/* Rest of your form code remains same */}
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input
          type="text"
          placeholder="Type here"
          onChange={(e) => settitle(e.target.value)}
          value={title}
          required
          className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
        />
      </div>

      {/* Rest of your existing code... */}
      <div className="w-full max-w-lg ">
        <p className="my-2">Job Description</p>
        <div ref={editorRef}></div>
      </div>

      <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
        <div>
          <p className="mb-2">Job Category</p>
          <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setcategory(e.target.value)}>
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Location</p>
          <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setlocation(e.target.value)}>
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Job Level</p>
          <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setlevel(e.target.value)}>
            <option value="Beginner Level">Beginner Level</option>
            <option value="Intermediate Level">Intermediate Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2">Job Salary</p>
        <input min={0} className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]" onChange={e=>setsalary(e.target.value)} value={salary} type="Number" placeholder="2500" />
      </div>

      <button className="py-3 mt-4 text-white bg-black rounded w-28">ADD</button>
    </form>
  );
};

export default AddJob;