/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDriveShareContext } from "../context/DriveShareProvider";
import { useNavigate } from 'react-router-dom';

export const SignUpPage = () => {
    const [feedbackMessage, setFeedBackMessage] = useState('')
    const navigate = useNavigate();

    const [userSignUpData, setUserSignUpData] = useState({
    user_name: "",
    password: "",
    first_name: "",
    last_name: "",
    question1: "",
    question2: "",
    question3: "",
    answer1: "",
    answer2: "",
    answer3: "",
    })

    const {registerUser} = useDriveShareContext()


    const handleSubmission = async (e)=>{
        e.preventDefault()
        const response = await registerUser(userSignUpData)
        if(response.ok){
            const data = response.json()
            console.log(data)
        }
        console.log(response)
        setFeedBackMessage(response.message)
        navigate('/login')
    }

    const handleChange = (e)=>{
        const {value, name} = e.target
        setUserSignUpData((prevState)=>({
        ...prevState, 
        [name]: value}))
    }

    
    const securityQuestions = [
        "What was the name of your first pet?",
        "What was the make of your first car?",
        "In what city were you born?",
        "Where did you go on your first flight?",
        "What was the model of your first car?", 
        "What is the name of your favorite childhood friend?",
        "What is the name of the first school you attended?",
        "In what city did your parents meet?", 
        "What was your childhood nickname?",
        "What is the name of your favorite teacher?"
    ];

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full">
            <form onSubmit={(e)=>handleSubmission(e)} className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Become a DriveShare Member Today.</h1>
                   
                <label htmlFor="first_name" className="block text-lg font-medium text-gray-700 mb-2">First Name</label>
                <input
                    onChange={handleChange} 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="Enter your first name"
                />

                <label htmlFor="last_name" className="block text-lg font-medium text-gray-700 mb-2">Last Name</label>
                <input 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    onChange={handleChange} 
                    id="last_name"
                    name="last_name"
                    placeholder="Enter your last name"
                />

                <label htmlFor="user_name" className="block text-lg font-medium text-gray-700 mb-2">Username</label>
                <input 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    onChange={handleChange} 
                    id="user_name"
                    name="user_name"
                    placeholder="Enter your username"
                />

                <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Password</label>
                <input 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange} 
                    placeholder="Enter your password"
                />

                <label htmlFor="question1" className="block text-lg font-medium text-gray-700 mb-2">Select Security Question 1</label>
                <select 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="question1"
                    name="question1"
                    onChange={handleChange} 
                >
                    {securityQuestions.map((question1, index) => (
                        <option key={index} value={question1}>{question1}</option>
                    ))}
                </select>

                <label htmlFor="answer1" className="block text-lg font-medium text-gray-700 mb-2">Your Answer</label>
                <input 
                    className="mb-6 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    onChange={handleChange} 
                    id="answer1"
                    name="answer1"
                    placeholder="Enter your answer"
                />

                <label htmlFor="question2" className="block text-lg font-medium text-gray-700 mb-2">Select Security Question 2</label>
                <select 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="question2"
                    onChange={handleChange} 
                    name="question2"
                >
                    {securityQuestions.map((question2, index) => (
                        <option key={index} value={question2}>{question2}</option>
                    ))}
                </select>

                <label htmlFor="answer2" className="block text-lg font-medium text-gray-700 mb-2">Your Answer</label>
                <input 
                    className="mb-6 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    id="answer2"
                    name="answer2"
                    onChange={handleChange} 
                    placeholder="Enter your answer"
                />

                <label htmlFor="question3" className="block text-lg font-medium text-gray-700 mb-2">Select Security Question 3</label>
                <select 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="question3"
                    name="question3"
                    onChange={handleChange} 
                >
                    {securityQuestions.map((question3, index) => (
                        <option key={index} value={question3}>{question3}</option>
                    ))}
                </select>

                <label htmlFor="answer3" className="block text-lg font-medium text-gray-700 mb-2">Your Answer</label>
                <input 
                    className="mb-6 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    id="answer3"
                    name="answer3"
                    onChange={handleChange} 
                    placeholder="Enter your answer"
                />

                <button type="submit" className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
                    Submit
                </button>

                <div className="mt-4">
                    <span>Already a member? </span>
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">Login</Link>
                </div>
            </form>
            <div className="text-black font-bold">{feedbackMessage}</div>
        </div>
    );
};
