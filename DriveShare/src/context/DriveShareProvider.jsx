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

    const fetchCars = async() =>{
        try{
            const response = await fetch ('/api');
            console.log("Testing Backend", response )
            if(!response.ok){
                throw new Error('Failed to fetch')
            }
            const data = await response.json();
            console.log(data)
            return data
            
        }catch(error){
            console.error('Error fetching cars', error)
            
        }
    }

    const getCarInfo = async (ID) => {
        try {
            const response = await fetch(`/api/cars/${ID}`);
            if (!response.ok) {
                console.error("Error response", response);
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            throw error; 
        }
    };

    const delistCar = async (carId) => {
        try {
          const response = await fetch('/api/delist', {
            method: 'PUT', 
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ carId }), 
            credentials: 'include', 
          });
      
          if (!response.ok) {
            const errorData = await response.json(); 
            console.error('Delisting failed:', errorData.message);
            throw new Error(`Failed to delist car: ${errorData.message}`);
          }
      
          const data = await response.json(); 
          console.log('Delisting successful:', data);
          return data; 
        } catch (error) {
          console.error('Error during delist operation:', error.message);
          throw error; 
        }
      };
      

    const getCarListings = async(userId) =>{
        try{
            const response = await fetch(`/api/user/${userId}/cars`)
            if(!response.ok){
                console.error("error response", response)
                throw new Error (`Failed to fetch: ${response.statusText}`)
            }
            const data = await response.json()
            return data
        }catch (error){
            console.error("Fetch error:", error)
            throw error
        }
        
    }
    

    const hostVehicle = async(formData) =>{
        try{
            const response = await fetch('/api/list', {
                method: 'POST', 
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            })
            const data = await response.json()
            return data
        }catch(error){
            console.error('Error submitting form:', error);
            
        }
    }

    const rentCar = async(rentData) =>{
        try{
            const response = await fetch('/api/rent',{
                method: 'PUT',
                headers: {'Content-type': 'application/json'},
                body:JSON.stringify({
                    carId: rentData.carID,
                    start_date: rentData.startDate,
                    end_date: rentData.endDate
                })
            });
            if(!response.ok){
                const errData = await response.json();
                console.error("Booking failed", errData.message)
                throw new Error(`Failed to book car: ${response.statusText}`);

            }
            const data = await response.json();
            console.log('Booking successful:', data);
            return data
        }catch(error){
            console.error("Error sending rent request")
        }
    }

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
        value={{isLoggedIn, userData, login, getCarListings, logout, fetchCars, hostVehicle, getCarInfo, delistCar, rentCar}}>
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
