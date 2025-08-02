import { createContext, useEffect, useState } from "react";
// import { jobsData } from "../assets/assets";
import { use } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, SetsearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setjobs] = useState([]);

  const [showRecruit, setshowRecruit] = useState(false);

  const [companyToken, setcompanyToken] = useState(null);
  const [companyData, setcompanyData] = useState(null);

  const [userData, setuserData] = useState(null);
  const [userApplication, setuserApplication] = useState([]);

  // Function to fetch jobs

  const fetchjob = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs");

      if (data.success) {
        setjobs(data.jobs);
        console.log(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Function to fetch company data

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setcompanyData(data.company);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Functions to fetch user data

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/users/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setuserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to fetch user's applied applications

  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      console.log("Fetching applications with token:", token); // Add this
      const { data } = await axios.get(backendUrl + "/api/users/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Applications API response:", data); // Add this

      if (data.success) {
        setuserApplication(data.application); 
        console.log("Applications set:", data.application); // ✅ Ye bhi change karo
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Applications fetch error:", error); // Add this

      toast.error(error.message);
    }
  };

  //     const fetchUserApplications = async () => {
  //   try {
  //     const token = await getToken();
  //     console.log("Fetching user applications...");
  //     const { data } = await axios.get(
  //       backendUrl + "/api/users/applications",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     console.log("API Response:", data);

  //     if (data.success) {
  //       setuserApplication(data.applications);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  useEffect(() => {
    fetchjob();

    const storedCompanyToken = localStorage.getItem("companyToken");

    if (storedCompanyToken) {
      setcompanyToken(storedCompanyToken);
    }
  }, []);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);
  const value = {
    SetsearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setjobs,
    showRecruit,
    setshowRecruit,
    companyToken,
    setcompanyToken,
    companyData,
    setcompanyData,
    backendUrl,
    userData,
    setuserData,
    userApplication,
    setuserApplication,
    fetchUserData,
    fetchUserApplications,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
