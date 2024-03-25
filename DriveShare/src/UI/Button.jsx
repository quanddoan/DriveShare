/* eslint-disable react/prop-types */
export const Button = ({children ,onClick}) => {
    
    return(
        <button onClick={onClick}  className=" rounded-3xl p-2 m-auto mr-4 bg-white text-black ">
           {children} 
        </button>
    )
}

