/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useEffect, useReducer, useContext, createContext } from "react";

const DriveShareContext = createContext();
const DriveShareProvider = ({children}) => {

    const initialState = {
        isLoggedIn: false,
        userData: null
    }

    

    const reducer =(state, action)=>{
        switch(action.type){
                       
            case 'LOGIN': 
                return{
                    ...state, 
                    isLoggedIn: true,
                    userData: action.payload
                }

            case 'LOGOUT': 
                return{
                    ...state, 
                    isLoggedIn: false,
                    userData:  null
                }

            default:
                return state;
                
            

        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const {isLoggedIn, userData} = state;

    useEffect(() => {
        console.log("Test Current state:", state);
    }, [state]);

    const login = async (username, password) => {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name: username, password: password }),
            });
            const data = await response.json();
            if (response.ok) {
                dispatch({ 
                    type: "LOGIN", 
                    payload: data.currentUserdata
                });
                console.log("Data: ", data)
                console.log("Logged in user data", data.currentUserdata)
            } else {
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = (token) => {
        localStorage.removeItem('userToken')
        dispatch({type: "LOGOUT", payload: token})
    }
    

    return(
        <DriveShareContext.Provider
        value={{isLoggedIn, userData, login, logout}}>
            {children}
        </DriveShareContext.Provider>
    )
}

const useDriveShareContext = () =>{
    const context = useContext(DriveShareContext);
    if (context === undefined ){
        throw new Error("CityContext was used outside of the CityProvider")
        }
       
    return context;


}
export { useDriveShareContext, DriveShareProvider };
