/* eslint-disable no-unused-vars */
import { useDriveShareContext } from "../context/DriveShareProvider"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
export const MainAppPage = () => {
    const [CarList, setCarList] = useState([])
    const [carSearch, setCarSearch] = useState('')
    const{fetchCars} = useDriveShareContext()
    const navigate = useNavigate()
    //Display all retrieved vehicles
    useEffect(()=>{
        fetchCars().then(data => {
            setCarList(data);
          });

          console.log("Testing testing ",CarList)
          
    },[])



    const result = CarList?.filter(carList=>
        `${carList.brand} ${carList.type}`.toLowerCase().includes(carSearch.toLowerCase()))

    

    return(
    <div className="mx-7">
        
        <div className="flex flex-col justify-center text-center items-center min-h-screen w-full">
            <div>
                <span className="text-3xl font-bold">
                    Find your Drive
                </span>
            </div>

            <div>
                <form className="flex flex-col">
                    <label
                    className="text-xl py-2"
                    htmlFor="searchInput">
                        Search for cars
                    </label>
                    <input value={carSearch} onChange={(e)=>setCarSearch(e.target.value)} className="rounded-3xl text-xl  border border-black textarea-long px-2 py-4 "/>
                    <button onClick={(e)=>{e.preventDefault(); setCarSearch("")}} className=" text-white bg-black border mb-5 border-black m-auto rounded-2xl px-3 py-4 mt-6 ">Clear</button>
                </form>

                
                {result.length > 0 &&
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                        {result.map((car) => (
                            <Link to={`/rent/${car.ID}`} key={car.ID} className="border p-4">
                                <h5 className="text-xl">{car.brand} {car.type}</h5>
                                <p>Year: {car.year}</p>
                            </Link>
                        ))}
                    </div>}

            



            </div>

            
        </div>
        
    </div>
    )
}
