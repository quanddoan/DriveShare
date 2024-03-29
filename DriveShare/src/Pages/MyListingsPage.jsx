/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { useDriveShareContext } from "../context/DriveShareProvider"
export const MyListingsPage = () => {
    const {isLoggedIn, getCarListings, userData, delistCar} = useDriveShareContext()
    const [myCarListings, setMyCarListings] = useState([])
    const fetchData =async()=>{
        if(userData.ID){
            const data = await getCarListings(userData.ID)
            setMyCarListings(data)
        }
        
    }
    useEffect(()=>{
        
        fetchData()
    },[fetchData, getCarListings, userData.ID])

    const handleDeleteCar = (ID) =>{
        delistCar(ID)
        fetchData()

    }
    
    return(
        <div className="flex flex-col mx-7 text-start min-h-screen w-full">
            <h1 className="text-3xl underline text-center font-bold py-3">My Listings</h1>
            < >
                {myCarListings.length>0? 
                <div className=" px-10 grid grid-rows-3  ">
                    {myCarListings.map((car)=>(
                        <div className="text-xl flex flex-col m-2 p-2 border border-black  " key={car.ID}>
                            
                            <div >Car Brand: {car.brand} </div>
                            <div>Car Type: {car.type} </div>
                            <div>Car Year: {car.year} </div>
                            <div>Car VIN: {car.VIN} </div>
                            <div className="flex flex-row ml-auto gap-5">
                            <button onClick={()=>handleDeleteCar(car.ID)} className=" border-b px-5 py-2 bg-red-500 text-black">DELETE</button>
                            <button className=" border-b px-5 py-2 bg-blue-500 text-black">UPDATE</button>
                            </div>
                            
                            
                        </div>
                    ))}
                </div>:
                <>

            </>
            }

            </>
        </div>
    )
}
