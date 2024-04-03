import { useDriveShareContext } from "../context/DriveShareProvider";
import { useEffect, useState } from "react";

export const PaymentPage = () => {
    const {isLoggedIn, userData, payBalance} = useDriveShareContext();
    const [result, setResult] = useState("");
    const [amount, setAmount] = useState();
    const [balance, setBalance] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const allFieldsFilled = Object.values(amount).every(field => field !== '')
        if (!allFieldsFilled) {
            alert('Please fill all fields')
            return
        }
        try{
            const response = await payBalance(amount)
            setResult(response.message);
            if (response.balance != undefined){
                setBalance(`New balance: ${response.balance}`);
            }
            else{
                setBalance("");
            }
        }
        catch(e){
            setResult("Something went wrong!");
        }
    }

    const handleChange = (e) =>{
        const {name, value} = e.target
        setAmount(prevState => ({
            ...prevState,
            [name]:value
        }))

    }


    if (!isLoggedIn){
        return (
            <div className="flex flex-col justify-center text-center items-center min-h-screen w-full">
                <span className="text-3xl font-bold" style = {{color : "gray"}}>
                    You need to sign in first
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center text-center items-center min-h-screen w-full">
            <div style={{color: "gray"}} className="font-bold text-7xl mb-7">Pay balance</div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center text-center items-center">
                <label className="font-bold text-3xl mb-5">Amount:</label>
                <input onChange={handleChange} type="number" name="amount" className="border border-black"></input>

                <button style={{width : '5em'}} className="text-white bg-black border mb-5 border-black m-auto rounded-2xl py-4 mt-6" type="submit">Pay</button>
            </form>
            <div className="flex flex-row justify-center text-center items- center text-black font-bold">{result}</div>
            <div className="flex flex-row justify-center text-center items- center text-black font-bold">{balance}</div>
        </div>
    )
}