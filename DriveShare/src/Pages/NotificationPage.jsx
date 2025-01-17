import { useDriveShareContext } from "../context/DriveShareProvider";
import { useEffect, useState } from "react";

export const NotificationPage = () => {
    const {isLoggedIn, getNotification} = useDriveShareContext();
    const [myNotification, setMyNotification] = useState([]);
    const [hasNotification, setHasNotification] = useState(false);
    if (!isLoggedIn){
        return (
            <div className="flex flex-col justify-center text-center items-center min-h-screen w-full">
                <span className="text-3xl font-bold" style = {{color : "gray"}}>
                    You need to sign in first
                </span>
            </div>
        )
    }
    //Get all notifications
    const fetchData = async() => {
        const data = await getNotification()
        if (data.length != 0){
            setMyNotification(data)
            setHasNotification(true)
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    if (!hasNotification){
        return (
            <div className="flex flex-col justify-center text-center items-center min-h-screen w-full">
                <span className="text-3xl font-bold" style = {{color : "gray"}}>
                    You have no notifications at the moment
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col text-center min-h-screen w-full">
            {myNotification.map((notification) => (
                <div className="m-2 p-2 shadow-lg">
                    <div className="font-bold">Notification</div>
                    {notification.notification}
                </div>
            ))}
        </div>
    )
}