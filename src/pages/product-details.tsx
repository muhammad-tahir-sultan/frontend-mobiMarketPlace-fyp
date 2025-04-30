import { Link, Navigate, useParams } from "react-router-dom";
import { useProductDetailsQuery, useSubmitReviewMutation } from "../redux/api/ProductAPI";
import { Skeleton } from "../components/loader";
import { server } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState, UserReducerInitialState } from "../types/reducer-types";
import { CartItem, Review } from "../types/types";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducers/cartReducers";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUser } from "../redux/api/UserAPI";
import { userExist, userNotExist } from "../redux/reducers/userReducers";



const ProductDetails = () => {
    // https://backend-mobimarketplace-fyp.onrender.com

    const dispatch = useDispatch()
    const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const data = await getUser(user.uid)

                dispatch(userExist(data.user))
            } else {
                dispatch(userNotExist())
                console.log("Not Logged in");
            }
        })
    }, [dispatch])


    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [ratingValue, setRatingValue] = useState<number | null>(0);
    const [open, setOpen] = useState(false);
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, isError, refetch } = useProductDetailsQuery(id!)
    const [submitReview, { isLoading: reviewSubmitting }] = useSubmitReviewMutation();



    const { category, images, price, stock, title, reviews, ratings = 0, numOfReviews = 0 } = data?.product || {
        title: "",
        images: [],
        price: 0,
        stock: 0,
        category: "",
        reviews: [],
        ratings: 0,
        numOfReviews: 0
    }

    // Get the first image URL or use a placeholder
    const imageUrl = images && images.length > 0 
        ? images[0].url 
        : "https://via.placeholder.com/400";

    const { cartItems } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)


    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock!")

        const itemInCart = cartItems.find(item => item.productId === cartItem.productId);
        const currentQuantity = itemInCart ? itemInCart.quantity : 0;

        if (cartItem.stock <= currentQuantity) {
            return toast.error("Can't Add More than Available Stock!");
        }


        dispatch(addToCart(cartItem))
        toast.success("Added to Cart");
    }

    if (isError) return <Navigate to={"/404"} />


    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };


    const reviewSubmitHandler = async () => {
        if (!rating) {
            return toast.error("Please select a rating");
        }
        
        try {
            const res = await submitReview({
                id: id!,
                rating,
                comment,
                user: user?._id || ""
            }).unwrap();
            
            toast.success(res.message || "Review Added!");
            setOpen(false);
            setComment("");
            setRating(0);
            setRatingValue(0);
            // Refetch product details to update the reviews
            refetch();
        } catch (error) {
            toast.error("Something Went Wrong!");
            console.error("Review submission error:", error);
            setOpen(false);
        }
    };
    return (
        <>
            {
                isLoading ? <Skeleton length={20} /> :
                    <>
                        <section className="product-detail-section">
                            <div className="product-detail-container">
                                <div className="product-image-wrapper">
                                    <div className="main-image-container">
                                        <img 
                                            alt={title} 
                                            className="product-main-image" 
                                            src={imageUrl} 
                                            width={500}
                                            height={500}
                                        />
                                    </div>
                                </div>
                                <div className="product-info">
                                    <div className="product-category">{category}</div>
                                    <h1 className="product-title">{title}</h1>
                                    <div className="product-rating-container">
                                        <div className="stars-container">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg 
                                                    key={star}
                                                    fill={star <= Math.round(ratings) ? "currentColor" : "none"} 
                                                    stroke="currentColor" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth="2" 
                                                    className="star-icon" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="review-count">{numOfReviews} {numOfReviews === 1 ? 'Review' : 'Reviews'}</span>
                                    </div>
                                    <div className="product-description">
                                        <p>Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan.</p>
                                    </div>
                                    <div className="product-stock-status">
                                        {stock >= 1 ? (
                                            <div className="in-stock">
                                                <span className="status-icon">✅</span>
                                                <span className="status-text">In Stock</span>
                                                <span className="stock-count">({stock} available)</span>
                                            </div>
                                        ) : (
                                            <div className="out-of-stock">
                                                <span className="status-icon">❌</span>
                                                <span className="status-text">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-actions">
                                        <div className="product-price">${price}</div>
                                        <button 
                                            className="add-to-cart-button" 
                                            onClick={() => addToCartHandler({ 
                                                productId: id!, 
                                                image: imageUrl, 
                                                stock, 
                                                price, 
                                                title, 
                                                quantity: 1 
                                            })}
                                            disabled={stock <= 0}
                                        >
                                            {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="product-reviews-section">
                            <div className="reviews-container">
                                <div className="reviews-header">
                                    <h2 className="reviews-title">Reviews & Ratings</h2>
                                    {
                                        user?._id ? 
                                            <button 
                                                className="write-review-button" 
                                                onClick={submitReviewToggle} 
                                            >
                                                Write a Review
                                            </button> 
                                            : 
                                            <Link 
                                                to={"/login"} 
                                                className="login-to-review-button"
                                            >
                                                Login to Add Review
                                            </Link>
                                    }
                                </div>
                                <Dialog
                                    aria-labelledby="simple-dialog-title"
                                    open={open}
                                    onClose={submitReviewToggle}
                                    className="review-dialog"
                                >
                                    <DialogTitle className="review-dialog-title">Submit Review</DialogTitle>
                                    <DialogContent className="review-dialog-content">
                                        <div className="rating-container">
                                            <p className="rating-label">Your Rating</p>
                                            <div className="rating-input-container">
                                                <Rating
                                                    onChange={(_, newValue) => {
                                                        setRating(newValue!);
                                                        setRatingValue(newValue);
                                                    }}
                                                    value={rating}
                                                    size="large"
                                                    precision={0.5}
                                                    className="rating-stars"
                                                />
                                                {ratingValue !== null && (
                                                    <span className="rating-value">{ratingValue} out of 5</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="comment-container">
                                            <p className="comment-label">Your Review</p>
                                            <textarea
                                                className="comment-textarea"
                                                name="comment"
                                                cols={30}
                                                rows={5}
                                                value={comment}
                                                placeholder="Write your feedback here..."
                                                onChange={(e) => setComment(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </DialogContent>
                                    <DialogActions className="review-dialog-actions">
                                        <Button 
                                            color="warning" 
                                            onClick={submitReviewToggle} 
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={reviewSubmitHandler} 
                                            className="submit-button"
                                            disabled={!rating || reviewSubmitting}
                                        >
                                            {reviewSubmitting ? "Submitting..." : "Submit Review"}
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                {reviews && reviews.length > 0 ? (
                                    <div className="reviews-list">
                                        {reviews.map((review: Review, index: number) => {
                                            // Handle Cloudinary or local image URL
                                            const userImageUrl = review.user.image && 
                                                (review.user.image.startsWith('http') 
                                                    ? review.user.image 
                                                    : `${server}/${review.user.image}`);
                                                    
                                            return (
                                                <div className="review-item" key={index}>
                                                    <div className="review-card">
                                                        <div className="review-header">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="quote-icon" viewBox="0 0 975.036 975.036">
                                                                <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                                                            </svg>
                                                            <div className="review-rating">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <svg 
                                                                        key={star}
                                                                        fill={star <= Math.round(review.rating) ? "currentColor" : "none"} 
                                                                        stroke="currentColor" 
                                                                        strokeLinecap="round" 
                                                                        strokeLinejoin="round" 
                                                                        strokeWidth="2" 
                                                                        className="review-star" 
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                                    </svg>
                                                                ))}
                                                                <span className="review-rating-value">({review.rating})</span>
                                                            </div>
                                                        </div>
                                                        <p className="review-comment">{review.comment}</p>
                                                        <div className="reviewer-info">
                                                            <img 
                                                                alt="reviewer" 
                                                                src={userImageUrl || "https://via.placeholder.com/100"} 
                                                                className="reviewer-avatar" 
                                                            />
                                                            <div className="reviewer-details">
                                                                <span className="reviewer-name">{review.user.name}</span>
                                                                <span className="reviewer-title">Customer</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="no-reviews">
                                        <p className="no-reviews-title">No Reviews Yet</p>
                                        <p className="no-reviews-subtitle">Be the first to review this product!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
            }
        </>
    )
}

export default ProductDetails