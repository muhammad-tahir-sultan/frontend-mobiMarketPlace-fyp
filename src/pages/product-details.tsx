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
import { FaShoppingCart, FaHeart, FaShare, FaCheck, FaTimes, FaMinus, FaPlus } from "react-icons/fa";

const ProductDetails = () => {
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
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, isError, refetch } = useProductDetailsQuery(id!)
    const [submitReview, { isLoading: reviewSubmitting }] = useSubmitReviewMutation();

    const { category, images, price, stock, title, description = "", reviews, ratings = 0, numOfReviews = 0 } = data?.product || {
        title: "",
        images: [],
        price: 0,
        stock: 0,
        category: "",
        description: "",
        reviews: [],
        ratings: 0,
        numOfReviews: 0
    }

    // Get the first image URL or use a placeholder
    const imageUrl = images && images.length > 0 
        ? images[0].url 
        : "https://via.placeholder.com/400";

    const { cartItems } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)

    // Format price with commas
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'PKR',
            maximumFractionDigits: 0 
        }).format(price);
    }

    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock!")

        const itemInCart = cartItems.find(item => item.productId === cartItem.productId);
        const currentQuantity = itemInCart ? itemInCart.quantity : 0;

        if (cartItem.stock <= currentQuantity) {
            return toast.error("Can't Add More than Available Stock!");
        }

        // Update with selected quantity
        cartItem.quantity = quantity;
        
        dispatch(addToCart(cartItem))
        toast.success("Added to Cart");
        
        // Show added animation
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    }

    const increaseQuantity = () => {
        if (quantity < stock) {
            setQuantity(prev => prev + 1);
        } else {
            toast.error("Cannot exceed available stock!");
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

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

    // Calculate average rating for display
    const averageRating = ratings || 0;
    
    // Generate product ID for display
    const productId = `Product # ${id?.substring(0, 15) || ""}`;
    
    return (
        <>
            {
                isLoading ? <Skeleton length={20} /> :
                    <div className="product-detail-container">
                        <div className="product-detail-layout">
                            <div className="product-image-section">
                                <div className="main-image-container">
                                    <img 
                                        alt={title} 
                                        className="product-main-image" 
                                        src={imageUrl} 
                                        width={500}
                                        height={500}
                                    />
                                </div>
                                <div className="image-pagination">
                                    <span className="active-dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                            
                            <div className="product-info-section">
                                <h1 className="product-title">{title}</h1>
                                <p className="product-id">{productId}</p>
                                
                                <div className="product-rating-row">
                                    <div className="stars-container">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} 
                                                className={`star ${star <= Math.round(ratings) ? 'filled' : 'empty'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                        <span className="review-count">({numOfReviews} Reviews)</span>
                                    </div>
                                </div>
                                
                                <div className="product-price">
                                    {formatPrice(price)}
                                </div>
                                
                                <div className="quantity-container">
                                    <button 
                                        className="quantity-btn minus" 
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                    >
                                        <FaMinus />
                                    </button>
                                    <input 
                                        type="text" 
                                        className="quantity-input" 
                                        value={quantity} 
                                        readOnly 
                                    />
                                    <button 
                                        className="quantity-btn plus" 
                                        onClick={increaseQuantity}
                                        disabled={quantity >= stock}
                                    >
                                        <FaPlus />
                                    </button>
                                    
                                    <button 
                                        className={`add-to-cart-button ${addedToCart ? 'added' : ''}`}
                                        onClick={() => addToCartHandler({ 
                                            productId: id!, 
                                            image: imageUrl, 
                                            stock, 
                                            price, 
                                            title, 
                                            quantity: quantity 
                                        })}
                                        disabled={stock <= 0}
                                    >
                                        {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                                    </button>
                                </div>
                                
                                <div className="product-status">
                                    Status: <span className={stock > 0 ? "in-stock" : "out-of-stock"}>
                                        {stock > 0 ? "InStock" : "Out of Stock"}
                                    </span>
                                </div>
                                
                                <div className="product-description-section">
                                    <h3 className="section-title">Description :</h3>
                                    <div className="product-description">
                                        {description ? (
                                            <div dangerouslySetInnerHTML={{ __html: description }} />
                                        ) : (
                                            <p>Timeless and versatile product with high-quality materials for long-lasting wear.</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="product-actions-row">
                                    <button className="submit-review-btn" onClick={submitReviewToggle}>
                                        Submit Review
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Review Dialog */}
                        <Dialog
                            aria-labelledby="review-dialog-title"
                            open={open}
                            onClose={submitReviewToggle}
                            className="review-dialog"
                        >
                            <DialogTitle className="review-dialog-title" id="review-dialog-title">
                                Submit Review
                            </DialogTitle>
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
                                        placeholder="Share your experience with this product..."
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </div>
                            </DialogContent>
                            <DialogActions className="review-dialog-actions">
                                <Button 
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

                        {/* Reviews Section */}
                        {reviews && reviews.length > 0 && (
                            <div className="reviews-section">
                                <h2 className="reviews-title">Customer Reviews</h2>
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
                                                        <div className="reviewer-info">
                                                            <img 
                                                                alt="reviewer" 
                                                                src={userImageUrl || "https://via.placeholder.com/100"} 
                                                                className="reviewer-avatar" 
                                                            />
                                                            <div className="reviewer-details">
                                                                <span className="reviewer-name">{review.user.name}</span>
                                                            </div>
                                                        </div>
                                                        <div className="review-rating">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span 
                                                                    key={star} 
                                                                    className={`star ${star <= Math.round(review.rating) ? 'filled' : 'empty'}`}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="review-comment">{review.comment}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        {reviews && reviews.length === 0 && (
                            <div className="no-reviews-section">
                                <h2 className="reviews-title">Customer Reviews</h2>
                                <div className="no-reviews">
                                    <p className="no-reviews-title">No Reviews Yet</p>
                                    <p className="no-reviews-subtitle">Be the first to review this product!</p>
                                </div>
                            </div>
                        )}
                    </div>
            }
        </>
    )
}

export default ProductDetails