import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const[searchFilter,SetsearchFilter]=useState({
        title:"",
        location:""
    })

    const[isSearched,setIsSearched]=useState(false)
    const[jobs,setjobs] = useState([])

    const[showRecruit,setshowRecruit] = useState(false)

    // Function to fetch jobs

    const fetchjob = async()=>{
        setjobs(jobsData)
    }

    useEffect(()=>{
        fetchjob()
    },[])
    const value ={
        SetsearchFilter,searchFilter,
        isSearched,setIsSearched,
        jobs,setjobs,
        showRecruit,setshowRecruit
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
} 