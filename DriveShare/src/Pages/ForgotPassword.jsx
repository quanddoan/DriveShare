import { useState } from "react";
import { useDriveShareContext } from "../context/DriveShareProvider";

export const ForgotPassword = () => {
    const { getSecurityQuestions, submitPasswordRecovery } = useDriveShareContext();
    const [userName, setUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [message, setMessage] = useState('');

    const handleQuestionAnswer = (index, value) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!questions.length) {
            const response = await getSecurityQuestions(userName);
            const questionsArray = Object.values(response);
            setQuestions(questionsArray);
        } else {
            try {
                const response = await submitPasswordRecovery(userName, answers, newPassword);
                setMessage(response.message);
            } catch (error) {
                setMessage('Failed to change password. Please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full">
            <form className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl" onSubmit={handleSubmit}>
                <div className="block text-lg font-medium text-gray-700 mb-2">Please enter your user name</div>
                <input 
                    className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your username"
                    disabled={questions.length > 0}
                />
                {questions.map((question, index) => (
                    <div key={index}>
                        <div className="mb-4">
                            <label htmlFor={`question-${index}`} className="block text-lg font-medium text-gray-700">
                                {question}
                            </label>
                            <input 
                                id={`question-${index}`}
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => handleQuestionAnswer(`answer${index + 1}`, e.target.value)}
                                placeholder={`Answer ${index + 1}`}
                            />
                        </div>
                    </div>
                ))}
                {questions.length > 0 && (
                    <input 
                        className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                    />
                )}
                <button 
                    className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
                    {questions.length > 0 ? 'Change Password' : 'Get Security Questions'}
                </button>
                {message && <span>{message}</span>}
            </form>
        </div>
    );
};
