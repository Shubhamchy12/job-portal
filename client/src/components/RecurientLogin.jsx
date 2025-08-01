import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import App from '../App'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { data, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const RecurientLogin = () => {
    const navigate = useNavigate()
    const[state,setstate] = useState("login")
    const[name,setname] = useState(" ")
    const[password,setpassword] = useState(" ")
    const[email,setemail] = useState(" ")
    const[img,setimg] = useState(false)
    const[isNextDataSubmit,setisNextDataSubmit] = useState(false)

        
    const{setshowRecruit,backendUrl,setcompanyToken,setcompanyData} =useContext(AppContext)

    const onSubmitHandler = async(e)=>{
        e.preventDefault()

        if(state == 'sign-up' && !isNextDataSubmit)
        {
            return setisNextDataSubmit(true)
        }

        try {
            if(state === 'login'){
                const {data} = await axios.post(backendUrl + '/api/company/login',{email,password})

                if(data.success){
                
                setcompanyData(data.company)
                setcompanyToken(data.token)
                localStorage.setItem('companyToken',data.token)
                setshowRecruit(false)
                navigate('/dashboard')
            }
            else{
                toast.error(data.message)
            }
            } else{
                const formData = new FormData()
                formData.append('name',name)
                formData.append('password',password)
                formData.append('email',email)
                formData.append('image',img)

                const {data} = await axios.post(backendUrl + '/api/company/register',formData)

                if(data.success){

            
                setcompanyData(data.company)
                setcompanyToken(data.token)
                localStorage.setItem('companyToken',data.token)
                setshowRecruit(false)
                navigate('/dashboard')
                    
                }
                else{
                    toast.error(data.message)
                }
            }

        } catch (error) {

            toast.error(error.message)
            
        }
    }

    useEffect(()=>{
        document.body.style.overflow = 'hidden'

        return ()=>{
            
        document.body.style.overflow = 'unset'
        }
    },[])
  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center backdrop-blur-sm bg-black/30 '>
        <form onSubmit={onSubmitHandler} className='relative p-10 bg-white rounded-xl text-slate-500'>
            <h1 className='text-2xl font-medium text-center text-neutral-700'>Recruiter {state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue </p>

            {
                state === "sign-up" && isNextDataSubmit?<>

                <div className='flex items-center gap-4 my-10'>
                    <label htmlFor="image">
                        <img className='w-16 rounded-full' src={img ? URL.createObjectURL(img): assets.upload_area} alt="" />
                        <input onChange={e=>setimg(e.target.files[0])} type="file" hidden id='image'/>
                    </label>
                    <p>Upload Company <br />logo</p>
                    
                </div>
                </>:
                 <>
            {state !== 'login' &&(
                <div className='flex items-center gap-2 px-4 py-2 mt-5 border rounded-full'>
                <img src={assets.person_icon} alt="" />
                <input className='text-sm outline-none' onChange={e=>setname(e.target.value)} value={name} type="text" placeholder='Company Name' required />
            </div>
            )}
            
            <div className='flex items-center gap-2 px-4 py-2 mt-5 border rounded-full'>
                <img src={assets.email_icon} alt="" />
                <input className='text-sm outline-none' onChange={e=>setemail(e.target.value)} value={email} type="email" placeholder='Email Id' required />
            </div>

            <div className='flex items-center gap-2 px-4 py-2 mt-5 border rounded-full'>
                <img  src={assets.lock_icon} alt="" />
                <input className='text-sm outline-none' onChange={e=>setpassword(e.target.value)} value={password} type="password" placeholder ='Password' required />
            </div>
            </>
            }

            
            {state === "login" && <p className='mt-4 text-sm text-blue-600 cursor-pointer'>Forgot Password?</p>}
           

            <button type='submit' className='w-full py-2 mt-4 text-white bg-blue-600 rounded-full'>
                {state === 'login'? 'login': isNextDataSubmit?'createaccount':'next'}
            </button>
            
            {
                state === 'login'
                 ? <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={()=>setstate("sign-up")}>Sign Up</span></p>
                 :<p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={()=>setstate("login")}>Login</span></p>
            }

            <img onClick={e=>setshowRecruit(false)} className='absolute cursor-pointer top-5 right-5' src={assets.cross_icon} alt="" />
           
        </form>
    </div>
  )
}

export default RecurientLogin