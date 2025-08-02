
import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const Application = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isEdit, setisEdit] = useState(false);
  const [resume, setresume] = useState(null);

  const {
    backendUrl,
    userData,
    userApplication,
    fetchUserData,
    fetchUserApplications,
  } = useContext(AppContext);

  // Debug: Check userApplication data
  console.log("From Application.jsx → userApplication:", userApplication);
  console.log("userApplication length:", userApplication?.length);
  console.log("userData:", userData);

  // Simple useEffect - context already handles fetching
  useEffect(() => {
    if (user) {
      // Context automatically fetches when user is available
      // No need for complex logic here
      console.log("User is available, context will handle fetching");
    }
  }, [user]);

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

        {!userApplication ? (
          <div className="py-8 text-center">
            <p>Loading applications...</p>
          </div>
        ) : userApplication.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No applications found. Apply to some jobs to see them here!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 font-medium text-left border-b">
                    Company
                  </th>
                  <th className="px-4 py-3 font-medium text-left border-b">
                    Job Title
                  </th>
                  <th className="px-4 py-3 font-medium text-left border-b max-sm:hidden">
                    Location
                  </th>
                  <th className="px-4 py-3 font-medium text-left border-b max-sm:hidden">
                    Date Applied
                  </th>
                  <th className="px-4 py-3 font-medium text-left border-b">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {userApplication.map((job, index) => (
                  <tr key={job._id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <img
                          className="object-cover w-8 h-8 rounded"
                          src={
                            job.companyId?.image ||
                            job.jobId?.companyId?.image ||
                            job.logo ||
                            assets.company_icon
                          }
                          alt="Company Logo"
                          onError={(e) => {
                            e.target.src = assets.company_icon;
                          }}
                        />
                        <span className="font-medium">
                          {job.companyId?.name ||
                            job.jobId?.companyId?.name ||
                            job.company ||
                            "Unknown Company"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b">
                      <span className="font-medium">
                        {job.jobId?.title || job.title || "Unknown Title"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 border-b max-sm:hidden">
                      {job.jobId?.location ||
                        job.location ||
                        "Unknown Location"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 border-b max-sm:hidden">
                      {moment(
                        job.date || job.createdAt || job.appliedAt
                      ).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : job.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {job.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Application;
