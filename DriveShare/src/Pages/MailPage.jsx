import { useDriveShareContext } from "../context/DriveShareProvider";
import { useEffect, useState } from "react";

export const MailPage = () => {
    const { isLoggedIn, postMail, getMail } = useDriveShareContext();
    const [showCompose, setShowCompose] = useState(false);
    const [displayCompose, setDisplay] = useState("hidden")
    const [mailList, setMailList] = useState([]);
    const [hasMail, setHasMail] = useState(false);
    const [mailData, setMailData] = useState();
    const [mailSender, setMailSender] = useState();
    const [mailContent, setMailContent] = useState();
    const [mailSent, setMailSent] = useState();

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col justify-center text-center items-center min-h-screen w-full">
                <span className="text-3xl font-bold" style={{ color: "gray" }}>
                    You need to sign in first
                </span>
            </div>
        )
    }

    const fetchData = async () => {
        const data = await getMail();
        if (data.length != 0) {
            setMailList(data)
            setHasMail(true)
        }
    }

    const handleButtonClick = () => {
        setShowCompose(!showCompose);
    }

    const handleClickOnMail = (username, message) => {
        setMailSender(username);
        setMailContent(message);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const allFieldsFilled = Object.values(mailData).every(field => field !== '')
        if (!allFieldsFilled) {
            alert('Please fill all fields')
            return
        }
        try{
            const response = await postMail(mailData)
            setMailSent(response.message);
        }
        catch(e){
            setMailSent("Something went wrong!");
        }
    }

    const handleChange = (e) =>{
        const {name, value} = e.target
        setMailData(prevState => ({
            ...prevState,
            [name]:value
        }))

    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (showCompose) {
            setDisplay("flex flex-col");
        }
        else{
            setDisplay("hidden");
        }
        console.log(showCompose)
        console.log(displayCompose)
    }, [showCompose])

    if (!hasMail) {
        return (
            <div>
                <div className="flex flex-row justify-center text-center">
                    <button className="flex flex-col justify-center text-center items-center rounded-2xl border border-black m-2 p-2 font-bold text-xl" style={{ width: '30%' }} onClick={() => handleButtonClick()}>
                        Compose
                    </button>
                </div>
                <div className={displayCompose}>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full gap-5">
                    <label className="text-xl font-bold">To:</label>
                        <input name="to" onChange={handleChange} className="border border-black" type="text"></input>

                        <label className="text-xl font-bold">Message:</label>
                        <textarea name="message" onChange={handleChange} className="flex flex-col border border-black" style={{ height:'10em', width: '70%'}} type="text"></textarea>
                        
                        <button className="text-white bg-black border mb-5 border-black m-auto rounded-2xl px-3 py-4 mt-6 font-bold" type="submit">Send</button>
                    </form>
                    <div className="flex flex-row justify-center text-center items- center text-black font-bold">{mailSent}</div>
                </div>
                <div className="flex flex-col justify-center text-center items-center min-h-screen">
                    <span className="text-3xl font-bold" style={{ color: "gray" }}>
                        You have no mails at the moment
                    </span>
                </div>
            </div>

        )
    }

    else{
        return(
            <div>
                <div className="flex flex-row justify-center text-center">
                    <button className="flex flex-col justify-center text-center items-center rounded-2xl border border-black m-2 p-2 font-bold text-xl" style={{ width: '30%' }} onClick={() => handleButtonClick()}>
                        Compose
                    </button>
                </div>
                <div className={displayCompose}>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
                        <label className="text-xl font-bold">To:</label>
                        <input name="to" onChange={handleChange} className="border border-black" type="text"></input>

                        <label className="text-xl font-bold">Message:</label>
                        <textarea name="message" onChange={handleChange} className="flex flex-col border border-black" style={{ height:'10em', width: '70%'}} type="text"></textarea>
                        
                        <button className="text-white bg-black border mb-5 border-black m-auto rounded-2xl px-3 py-4 mt-6 font-bold" type="submit">Send</button>
                    </form>
                    <div className="flex flex-row justify-center text-center items- center text-black font-bold">{mailSent}</div>
                </div>
                <div className="flex flex-row justify-start text-left items-start">
                    <div className="flex flex-col justify-center text-center items-center" style={{width:'50%'}}>
                        {mailList.map((mail) => (
                            <button className="flex flex-row justify-center text-center items-center border border-black rounded-3xl m-2 p-2 min-w-96 font-bold" onClick={() => handleClickOnMail(mail.user_name, mail.message)}>
                                From: {mail.user_name}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col m-2 p-5 shadow-2xl min-h-screen" style={{width:'40%'}}>
                        <div className="font-bold">From:</div>
                        {mailSender}
                        <div className="font-bold">Message:</div>
                        {mailContent}
                    </div>
                </div>
            </div>
        )
    }

}