import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDriveShareContext } from '../context/DriveShareProvider';

export const CarReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { carID } = useParams();
  const { getReviewsForCar, postReview, getCarInfo } = useDriveShareContext();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCarAndReviews = async () => {
      try {
        const carData = await getCarInfo(carID);
        setCar(carData);
        const reviewsData = await getReviewsForCar(carID);
        setReviews(reviewsData);
      } catch (error) {
        setError("Failed to load information.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarAndReviews();
  }, [carID, getCarInfo, getReviewsForCar]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText) {
      setError("Please enter a review before submitting.");
      return;
    }
    try {
      setError(""); // Reset error message before attempting
      const newReview = { CarID: carID, Rating: rating, Review: reviewText };
      await postReview(newReview);
      setReviews([...reviews, newReview]); // Assume the new review will be appended to the current list
      setReviewText(""); // Clear input after submission
    } catch (error) {
      setError("Failed to submit review.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col mx-7 text-start min-h-screen w-full">
      <h1 className="text-3xl text-center font-bold py-3">{car ? `Reviews for ${car.brand} ${car.type}` : 'Car Reviews'}</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleReviewSubmit} className="mb-5">
        <label className="block mb-1 font-bold">Rating:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="mb-2 p-2 border rounded">
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
        <label className="block mb-1 font-bold">Review:</label>
        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full p-2 border rounded mb-4" />
        <button type="submit" className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 ease-in-out">Submit Review</button>
      </form>
      <div className="px-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.length === 0 ? (
          <div className="font-bold text-xl text-center">
            No reviews yet.
          </div>
        ) : (
          reviews.map((review, index) => (
            <div className="text-xl flex flex-col m-2 p-4 bg-white rounded-lg shadow-md" key={index}>
              <span>Rating: {review.Rating} Stars</span>
              <p>{review.Review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};