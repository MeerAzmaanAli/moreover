import "./reviewCard.css";

const ReviewCard = ({ review }) => {
    return (
        <div className="review-card">
            <h4>{review.title}</h4>
            <p>{review.content}</p>
            <div className="review-rating">
                {Array.from({ length: review.rating }, (_, i) => (
                    <span key={i} className="star">★</span>
                ))}
            </div>
        </div>
    );
};

export default ReviewCard;
