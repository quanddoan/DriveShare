/* eslint-disable no-unused-vars */
import { useState } from "react"
import { useDriveShareContext } from "../context/DriveShareProvider"
import { useNavigate } from "react-router-dom"

export const HostPage = () => {
    const {hostVehicle, isLoggedIn} = useDriveShareContext()
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        carId:-1,
        vehicleBrand:'',
        vehicleType:'',
        vehicleYear:'',
        vehiclePrice:'',
        vehicleMileage:'',
        vehicleVIN:''
    })
   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value,
        }));
      };
      
      const handleFormSubmission = async (e) =>{
        e.preventDefault()
        const allFieldsFilled = Object.values(formData).every(field => field !== '');
        if (!allFieldsFilled) {
            alert("Please fill in all fields.");
            return;
        }
        const response = await hostVehicle(formData)
        console.log("response testing ", response.message)
        setMessage(response.message)
      }

    return(
        <div className="py-10 mx-7 m-10 flex flex-col  ">
            
            <form onSubmit={handleFormSubmission} className="bg-gray-100 p-10 m-auto mt-5 grid grid-rows-6 gap-6 ">
            <h1 className="font-bold text-2xl">Become a Host </h1>
                <div className="">
                    <span className="text-xl">Enter Vehicle Brand: </span>
                    <input name="vehicleBrand" onChange={handleChange} type="text" className="border-b-2 ml-5"/>
                </div>

                <div className="">
                    <span className="text-xl">Enter Vehicle Type: </span>
                    <input name="vehicleType" onChange={handleChange} type="text" className="border-b-2 ml-5"/>
                </div>

                <div className="">
                    <span className="text-xl">Enter Vehicle Year: </span>
                    <input name="vehicleYear" onChange={handleChange} type = "number" className="border-b-2 ml-5"/>
                </div>

                <div className="">
                    <span className="text-xl">Enter Vehicle Price: </span>
                    <input name="vehiclePrice" onChange={handleChange} type = "number" className="border-b-2 ml-5"/>
                </div>

                <div className="">
                    <span className="text-xl">Enter Vehicle Mileage: </span>
                    <input name="vehicleMileage" onChange={handleChange} type = "number" className="border-b-2 ml-5"/>
                </div>

                <div className="">
                    <span className="text-xl">Enter Vehicle VIN: </span>
                    <input name="vehicleVIN" onChange={handleChange} type = "number" className="border-b-2 ml-5"/>
                </div>

                <div className="flex flex-col items-center">
                    <button  className="border text-white  bg-blue-500 font-bold py-2 px-5 rounded hover:bg-blue-700 transition duration-300">
                        Host Vehicle
                    </button>
                </div>

                {message && 
                <div className="text-black text-xl m-auto ">
                    <div className="p-2 font-bold ">
                        {message}
                    </div>
                </div>}

            </form>
        </div>
    )
}
