/* eslint-disable no-unused-vars */
import Logo from "../assets/Logo.webp"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import React from "react"

export const Header = () => {
    const navigate = useNavigate();
    return(
        <div className=" fixed inset-x-0 top-0 w-full flex flex-row bg-black ">
            <Link to={"/"}>
                <img className="h-32 w-32"src={Logo} alt= "DriveShare Logo" />
            </Link>
            <h1 className="m-auto font-bold text-5xl text-white">
                DriveShare
            </h1>
                
            <button onClick={()=>navigate('/login')} className=" rounded-3xl p-2 m-auto mr-4 bg-white text-black ">Have an account?</button>
                
            
        </div>
    )
}
