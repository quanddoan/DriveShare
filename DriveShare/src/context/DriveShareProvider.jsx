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
            //Save user data after logging in
            case 'LOGIN':
                return{
                    ...state,
                    isLoggedIn: true,
                    userData: action.payload
                }
            //Delete user data after logging out
            case 'LOGOUT':
                return{
                    ...state,
                    isLoggedIn: false,
                    userData:  null
                }
            //Update user balance after payment
            case 'PAY':
                return {
                    ...state,
                    isLoggedIn: true,
                    userData: action.payload
                }
            default:
                return state;



        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const {isLoggedIn, userData
    } = state;

    
    //Get all availablable vehicles
    const fetchCars = async() =>{
        try{
            const response = await fetch ('/api');
          
            if(!response.ok){
                throw new Error('Failed to fetch')
            }
            const data = await response.json();
            console.log(data)
            return data

        }catch (error) {
            console.error('Error fetching cars', error)

        }

    }
    //Get all vehicles
    const fetchAllCars = async() => {
        try{
            const response = await fetch ('/api/all');
          
            if(!response.ok){
                throw new Error('Failed to fetch')
            }
            const data = await response.json();
            console.log(data)
            return data

        }catch (error) {
            console.error('Error fetching cars', error)

        }
    }
    //Get security questions from username
    const getSecurityQuestions = async (user_name) => {
        const response = await fetch('/api/forgotpassword',{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({user_name: user_name})
        })
        if(!response.ok){
            throw new Error('Network response was not ok.');
        }
        const data = await response.json()
        console.log(data)
        return data
        
    }
    //Deny a booking request
    const denyRequest = async (requestID) => {
        try {
            const response = await fetch('/api/confirm', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestID, action: 'deny' }),
                credentials: 'include', // For session-based authentication
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Deny request response:", data);
            return data; // Typically contains success message or updated data
        } catch (error) {
            console.error("Error denying request:", error);
            throw error; // Rethrowing for further handling
        }
    };
    //Submit a password recovery form
    async function submitPasswordRecovery(username, answers, newPassword) {
        try {
            const response = await fetch('/api/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name: username,
                    answer1: answers.answer1,
                    answer2: answers.answer2,
                    answer3: answers.answer3,
                    password: newPassword,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const data = await response.json(); 
            console.log(data); return data; 
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            throw error; 
        }
    }
    
    
    //Approve booking request
    const approveRequest = async (requestID) => {
        try {
            const response = await fetch('/api/confirm', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestID, action: 'approve' }),
                credentials: 'include', // For session-based authentication
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Approve request response:", data);
            return data; // Typically contains success message or updated data
        } catch (error) {
            console.error("Error approving request:", error);
            throw error; // Rethrowing to handle it further up in the component tree
        }
    };
    
    //Get info of a vehicle based on carid
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
    //Get notifications for a logged in user
    const getNotification = async () => {
        try {
            const response = await fetch('/api/notification');
            if (!response.ok){
                console.error("Error getting notification: ", response);
                throw new Error(`Failed to fetch notifications: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Fetch error at notification: ", error);
            throw error;
        }
    };

    const getMail = async() => {
        try{
            const response = await fetch('/api/mail');
            if (!response.ok){
                console.error("Error getting mail: ", response);
                throw new Error(`Failed to fetch mail: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Fetch error at get mail: ", error);
            throw error;
        }
    };
    //Send mail
    const postMail = async (mailData) => {
        try {
            const response = await fetch('/api/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mailData),
                credentials: 'include'
            })
            if (!response.ok) {
                console.error("Error getting mail: ", response);
                throw new Error(`Failed to fetch mail: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Fetch error at postmail: ", error);
            throw error;
        }
    };
    //Submit a payment for a logged in user
    const payBalance = async (payment) => {
        try {
            const response = await fetch('/api/payment', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payment),
                credentials: 'include'
            })

            if (!response.ok && response.status != 400) {
                console.error("Error posting payment: ", response);
                throw new Error(`Failed to post payment: ${response.statusText}`);
            }
            const data = await response.json();
            if (response.ok){
                var newBalanceData = userData;
                newBalanceData.balance = data.balance;
                dispatch({
                    type: "PAY",
                    payload: newBalanceData
                });
                console.log("New balance: ", data.balance)
                console.log("Logged in user data", newBalanceData)
            }
            return data;
        }
        catch (error) {
            console.error("Fetch error at payment: ", error);
            throw error;
        }
    }
    //Take down a vehicle in the my listing page
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

    //Get all vehicles listed by the user
    const getCarListings = async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}/cars`)
            if (!response.ok) {
                console.error("error response", response)
                throw new Error(`Failed to fetch: ${response.statusText}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error("Fetch error:", error)
            throw error
        }

    }


    const hostVehicle = async (formData) => {
        try {
            const response = await fetch('/api/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            })
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error submitting form:', error);

        }
    }
    //Send a booking request for a vehicle
    const rentCar = async (rentData) => {
        try {
            const response = await fetch('/api/rent', {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    carId: rentData.carID,
                    start_date: rentData.startDate,
                    end_date: rentData.endDate
                })
            });
            if (!response.ok) {
                const errData = await response.json();
                console.error("Booking failed", errData.message)
                throw new Error(`Failed to book car: ${response.statusText}`);

            }
            const data = await response.json();
            console.log('Booking successful:', data);
            return data
        } catch (error) {
            console.error("Error sending rent request")
        }
    }
    //Get details of requests for vehicles listed by the user
    const fetchRequestDetails = async () => {
        try {
            const response = await fetch('/api/request', {
                method: 'GET',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const data = await response.json();
            return data; 
        } catch (error) {
            console.error('Fetching request details failed:', error);
            return []; 
        }
    };
    //Get all log entires associated with the user
    const getRentHistory = async () => {
        try {
            const response = await fetch('/api/history', {
                method: 'GET',
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            return data; 
        } catch (error) {
            console.error("Error fetching rent history:", error);
            throw error; 
        }
    };
    // Handler function to get reviews for a specific car
    const getReviewsForCar = async (carID) => {
        try {
            const response = await fetch(`/api/reviews/${carID}`);
            if (!response.ok) throw new Error('Failed to fetch reviews.');
            const reviews = await response.json();
            return reviews;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    };

    // Handler function to post a new review for a car
    const postReview = async ({ CarID, Rating, Reviews }) => {
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ CarID, Rating, Reviews }),
            });
            if (!response.ok) throw new Error('Failed to submit review.');
            return await response.json(); 
        } catch (error) {
            console.error('Post error:', error);
            throw error;
        }
    };
  
    
    //Send a registration form
    const registerUser =async  (userData) =>{
        const response = await fetch ('/api/register', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            }, body: JSON.stringify(userData),
        })
        if(!response.ok){
            const errorData= await response.json()
            throw new Error(errorData.message||"Failed to register")
        }
        return response.json()
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
  
    const logout = async () => {
        try {
            const response = await fetch('/api/logout', { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }); 
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                dispatch({ type: "LOGOUT" });
                return data;
            } else {
                console.error("Logout Error:", response.statusText);
            }
        } catch (error) {
            console.error("Logout Exception:", error);
        }
    };


    return (
        <DriveShareContext.Provider
        value={{isLoggedIn, userData, submitPasswordRecovery, getSecurityQuestions, logout, registerUser, login, getCarListings, approveRequest, denyRequest, fetchCars, fetchRequestDetails, getRentHistory, getReviewsForCar, postReview, hostVehicle, getCarInfo, delistCar, rentCar, getNotification, postMail, getMail, payBalance, fetchAllCars}}>
            {children}
        </DriveShareContext.Provider>
    )
}

const useDriveShareContext = () => {
    const context = useContext(DriveShareContext);
    if (context === undefined) {
        throw new Error("CityContext was used outside of the CityProvider")
    }

    return context;


}
export { useDriveShareContext, DriveShareProvider };
