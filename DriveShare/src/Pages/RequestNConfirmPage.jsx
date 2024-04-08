import { useEffect, useState } from "react";
import { useDriveShareContext } from "../context/DriveShareProvider";

export const RequestNConfirmPage = () => {
    const [requestData, setRequestData] = useState([]);
    const [carInfo, setCarInfo] = useState({});
    const { fetchRequestDetails, approveRequest, denyRequest, getCarInfo } = useDriveShareContext();
    const [feedBackMessage, setFeedBackMessage] = useState("")
    //Get all outstanding requests
    const fetchRequestData = async () => {
        const requests = await fetchRequestDetails();
        setRequestData(requests);
    };

    useEffect(() => {
        fetchRequestData();
    }, []);

    // Fetch car information for each request
    useEffect(() => {
        requestData.forEach(async (request) => {
            if (!carInfo[request.carID]) {
                const info = await getCarInfo(request.carID);
                setCarInfo(prev => ({ ...prev, [request.carID]: info }));
            }
        });
    }, [requestData]);
    //Send a request approval
    const handleApproveRequest = async  (requestID) =>{
        const response = await approveRequest(requestID)
        setFeedBackMessage(response.message)
        fetchRequestData()
    }
    //Send a request denial
    const handleDenyRequest = (requestID) =>{
        
        const response = denyRequest(requestID)
        setFeedBackMessage(response.message)
        fetchRequestData()
    }

 



    return (
        <div className="flex flex-col mx-7 text-start min-h-screen w-full">
            <div>
                <h1 className="text-3xl text-center font-bold py-3">Requests</h1>
                {requestData && requestData.length > 0 ? (
                    <div className="mt-4">
                        <span>{feedBackMessage} </span>
                        {requestData.map((data) => (
                            <div key={data.requestID} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mb-4">
                                <div className="md:flex">
                                    <div className="p-8">
                                        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Request from user: {data.user_name}</div>
                                        <div className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">First name: {data.first_name}</div>
                                        <p className="mt-2 text-gray-500">Last name: {data.last_name}</p>
                                        <p className="mt-2 text-gray-500">Start date: {data.start_date} --- End Date: {data.end_date}</p>
                                        <div className=" font-bold mt-2 text-gray-500">
                                            <span>User wants to rent: {carInfo[data.carID] ? `${carInfo[data.carID].brand} ${carInfo[data.carID].type}, Year: ${carInfo[data.carID].year}` : "Loading car info..."}</span>
                                        </div>
                                        <div className="mt-4">
                                            
                                            <button onClick={()=> handleApproveRequest(data.requestID)} 
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-l">
                                                Approve
                                            </button>
                                            <button onClick={()=>handleDenyRequest(data.requestID) }
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-r">
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4 text-center text-xl text-gray-400">No requests for your cars.</div>
                )}
            </div>
        </div>
    );
};
