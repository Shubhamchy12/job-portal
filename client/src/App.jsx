// import React, { useContext } from "react";
// import Home from "./pages/Home";
// import ApplyJob from "./pages/ApplyJob";
// import Application from "./pages/Application";
// import { Route, Routes } from "react-router-dom";
// import RecurientLogin from "./components/RecurientLogin";
// import { AppContext } from "./context/AppContext";
// import Dashboard from "./pages/Dashboard";
// import AddJob from "./pages/AddJob";
// import MangeJob from "./pages/MangeJob";
// import ViewApplication from "./pages/ViewApplication";
// import "quill/dist/quill.snow.css";
// import { ToastContainer, toast } from "react-toastify";
// const App = () => {
//   const { showRecruit, companyToken } = useContext(AppContext);
//   console.log('App.jsx - companyToken:', companyToken);
//   return (
//     <div>
//       {showRecruit && <RecurientLogin />}
//       <ToastContainer />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/apply-job/:id" element={<ApplyJob />} />
//         <Route path="/applications" element={<Application />} />
//         <Route path="/dashboard" element={<Dashboard />}>
//           {companyToken ? (
//             <>
//               <Route path="add-job" element={<AddJob />} />
//               <Route path="mange-job" element={<MangeJob />} />
//               <Route path="view-application" element={<ViewApplication />} />
//             </>
//           ) : null}
//         </Route>
//       </Routes>
//     </div>
//   );
// };

// export default App;


import React, { useContext } from "react";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Application from "./pages/Application";
import { Route, Routes } from "react-router-dom";
import RecurientLogin from "./components/RecurientLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import MangeJob from "./pages/MangeJob";
import ViewApplication from "./pages/ViewApplication";
import 'quill/dist/quill.snow.css'
import { ToastContainer } from 'react-toastify';

const App = () => {
  const { showRecruit, companyToken } = useContext(AppContext);
  
  console.log('App.jsx - companyToken:', companyToken);
  
  return (
    <div>
      {showRecruit && <RecurientLogin />}
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Application />} />
        
        {/* Routes hamesha define karo - conditional rendering NAHI! */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob/>} />
          <Route path="mange-job" element={<MangeJob/>} />
          <Route path="view-application" element={<ViewApplication/>} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
