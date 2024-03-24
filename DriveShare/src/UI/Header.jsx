/* eslint-disable no-unused-vars */
import Logo from "../assets/Logo.webp"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import React, { useEffect } from "react"
import { useDriveShareContext } from "../context/DriveShareProvider"

export const Header = () => {
    const navigate = useNavigate();
    const {isLoggedIn, userData} = useDriveShareContext()
    useEffect(()=>{console.log("Test",userData)},[userData])
    return(
        <div className=" fixed inset-x-0 top-0 w-full flex flex-row bg-black ">
            <Link to={"/"}>
                <img className="h-32 w-32"src={Logo} alt= "DriveShare Logo" />
            </Link>
            <h1 className="m-auto font-bold text-5xl text-white">
                DriveShare
            </h1>
                
            {isLoggedIn?<span className="py-3 px-2 rounded-3xl bg-white m-auto text-l">Welcome, {userData?.first_name}</span>:
            <button onClick={()=>navigate('/login')} className=" rounded-3xl p-2 m-auto mr-4 bg-white text-black ">Have an account?</button>}
                
            
        </div>
    )
}
