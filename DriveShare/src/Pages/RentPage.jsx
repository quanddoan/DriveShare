import { useEffect, useState } from "react"
import { useDriveShareContext } from "../context/DriveShareProvider"
import { useParams } from "react-router-dom"
/* eslint-disable no-unused-vars */

export const RentPage = () => {
    const {carID} = useParams();
    const [carData, setCarData] = useState()
    const {getCarInfo, rentCar} = useDriveShareContext()
    const [feedbackMessage, setFeedBackMessage] = useState('')
    

    useEffect(()=>{
        const fetchCarInfo =async ()=>{
            if(carID){
                try{
                    const carIDNum= Number(carID)
                    const data = await getCarInfo(carIDNum)
                    setCarData(data)
                    console.log(data)
                }catch(error){
                    console.log("Failed to fetch car info: ", error)
                }
            }
        }

        fetchCarInfo()
    },[carID, getCarInfo])

    const [rentFormData,setRentFormData] = useState({
        carID:carID,
        startDate: '',
        endDate:''
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setRentFormData(prevState => ({
            ...prevState,
            [name]:value
        }))

    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const allFieldsFilled = Object.values(rentFormData).every(field=>field!=='')
        if(!allFieldsFilled){
            alert('Please fill all fields')
            return
        }
        const response = await rentCar(rentFormData)
        setFeedBackMessage(response.message)
        console.log(response)
        console.log(response.message)
        

    }

    return(
        <div className=" flex flex-col justify-center text-center items-center min-h-screen w-full">
            <div className="">
                <h1 className="text-3xl font-bold pb-2">Rent a Car</h1>
                <span>Car of Interest</span>
                {carData?(<div className="flex flex-col gap-6 m-2 p-4 bg-gray-100 text-start ">
                    
                    <span>Brand: {carData.brand}</span>
                    <span>Type: {carData.type}</span>
                    <span>VIN:{carData.VIN}</span>

                    
                </div>): 
                <div className="m-2 p-4 bg-gray-100">
                    Loading Car Details...    
                </div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="mr-3">Start Date</label>
                        <input name="startDate" onChange={handleChange} className="border border-black" type="date"/>
                    </div>

                    <div>
                        <label className="mr-3">End Date</label>
                        <input name="endDate" onChange={handleChange} className="border border-black" type="date"/>
                    </div>

                    <button className="text-white bg-black border mb-5 border-black m-auto rounded-2xl px-3 py-4 mt-6">Submit request</button>
                </form>
                <div className="text-black ">{feedbackMessage}</div>
            </div>
        </div>
    )
}

