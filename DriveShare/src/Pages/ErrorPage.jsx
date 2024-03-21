import { useNavigate, useRouteError } from 'react-router-dom';
export const ErrorPage = () => {
    
    const navigate = useNavigate();
    const error = useRouteError();

    const errorMessage = error.toString();

    console.log(errorMessage); 
    return (
        <div>
            <h1>Something went wrong 😢</h1>
            <p>{errorMessage}</p>
            <button onClick={() => navigate(-1)}>&larr; Go back</button>
        </div>
    );
}
