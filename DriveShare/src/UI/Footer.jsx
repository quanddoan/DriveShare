import { useNavigate } from "react-router-dom"

export const Footer = () => {
    const navigate = useNavigate()
    
    return(
        <div className="pb-5 mt-7 bg-black text-white">
            <span className="text-xl pb-2 block underline my-2">Other Actions</span>
            <div className="grid grid-cols-3 gap-4 pb-8">
                <button onClick={()=>navigate('/host')} className="rounded-2xl border-2  px-4 py-6">Host a car</button>
                <button onClick={()=>navigate('/app')} className="rounded-2xl border-2  px-4 py-6">Car Listing</button>
                <button onClick={()=>navigate('/mycars')} className="rounded-2xl border-2  px-4 py-6">My Listings</button>
                <button onClick={()=>navigate('/notification')} className="rounded-2xl border-2  px-4 py-6">Notification</button>
                <button onClick={()=>navigate('/mail')} className="rounded-2xl border-2  px-4 py-6">Mailbox</button>
            </div>
        </div>
    )
}

