import { Link, Navigate, useParams } from "react-router-dom";
import { useProductDetailsQuery } from "../redux/api/ProductAPI";
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
import axios from "axios";



const ProductDetails = () => {
    // https://mobilecommerce-backend.onrender.com

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
    }, [])


    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [open, setOpen] = useState(false);
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, isError } = useProductDetailsQuery(id!)



    const { category, images, price, stock, title, reviews } = data?.product || {
        title: "",
        images: [],
        price: 0,
        stock: 0,
        category: "",
        reviews: [],
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
        try {
            await axios.put(
                `${server}/product/review`,
                { id, rating, comment, user: user?._id });
            toast.success("Review Added!");
            setOpen(false);
        } catch (error) {
            toast.error("Something Went Wrong!");
            setOpen(false);
        }
    };
    return (
        <>
            {
                isLoading ? <Skeleton length={20} /> :
                    <>
                        <section className="text-gray-600 body-font overflow-hidden">
                            <div className="container px-5 py-24 mx-auto">
                                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                                    <img 
                                        alt="ecommerce" 
                                        className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" 
                                        src={imageUrl} 
                                    />
                                    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                                        <h2 className="text-sm title-font text-gray-500 tracking-widest">{category}</h2>
                                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{title}</h1>
                                        <div className="flex mb-4">
                                            <span className="flex items-center">
                                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                </svg>
                                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                </svg>
                                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                </svg>
                                                <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                </svg>
                                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                                </svg>
                                                <span className="text-gray-600 ml-3">4 Reviews</span>
                                            </span>

                                        </div>
                                        <p className="leading-relaxed">Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan.</p>
                                        <div className="flex mt-3 items-center   border-b-2 border-gray-100 mb-6 py-2 bg-blue-100 w-36 px-4 rounded-lg">
                                            <span>{stock >= 1 ? `In-Stock✅ : ${stock}` : `Out of Stock 🙆: ${stock}`}</span>

                                        </div>
                                        <div className="flex">
                                            <span className="title-font font-medium text-2xl text-gray-900">${price}</span>
                                            <button 
                                                className="flex ml-auto text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded" 
                                                onClick={() => addToCartHandler({ 
                                                    productId: id!, 
                                                    image: imageUrl, 
                                                    stock, 
                                                    price, 
                                                    title, 
                                                    quantity: 1 
                                                })}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="text-gray-600 body-font">
                            <div className="container px-5 py-8 mx-auto">
                                <div className="flex h-16 items-center justify-center px-2 mb-2">
                                    <h1 className="text-3xl font-bold title-font text-gray-900 text-center">Testimonials</h1>
                                    {
                                        user?._id ? <button className="flex ml-auto text-white bg-blue-600 border-0 px-6 focus:outline-none hover:bg-blue-700 rounded text-center py-2" onClick={submitReviewToggle} >Add Review</button> : <Link to={"/login"} className="flex ml-auto text-white bg-blue-600 border-0 px-6 focus:outline-none hover:bg-blue-700 rounded text-center py-2" onClick={submitReviewToggle} >Login to Add Review</Link>
                                    }
                                </div>
                                <Dialog
                                    aria-labelledby="simple-dialog-title"
                                    open={open}
                                    onClose={submitReviewToggle}
                                >
                                    <DialogTitle>Submit Review</DialogTitle>
                                    <DialogContent className="submitDialog">
                                        <Rating
                                            onChange={(_, newValue) => {
                                                setRating(newValue!);
                                            }}
                                            value={rating}
                                            size="large"
                                        />

                                        <textarea
                                            className="submitDialogTextArea"
                                            name=""
                                            cols={30}
                                            rows={5}
                                            value={comment}
                                            placeholder="Write Feedback"
                                            onChange={(e) => setComment(e.target.value)}
                                        ></textarea>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button color="warning" onClick={submitReviewToggle}>
                                            Cancel
                                        </Button>
                                        <Button onClick={reviewSubmitHandler}>Submit</Button>
                                    </DialogActions>
                                </Dialog>

                                {reviews ? reviews?.map(({ comment, user }: Review) => (
                                    <div className="flex flex-wrap -m-4">


                                        <div className="p-4 md:w-1/2 w-full">
                                            <div className="h-full bg-gray-100 p-8 rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-5 h-5 text-gray-400 mb-4" viewBox="0 0 975.036 975.036">
                                                    <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                                                </svg>
                                                <p className="leading-relaxed mb-6">{comment}</p>
                                                <a className="inline-flex items-center">
                                                    <img alt="testimonial" src={user.image} className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center" />
                                                    <span className="flex-grow flex flex-col pl-4">
                                                        <span className="title-font font-medium text-gray-900">{user.name}</span>
                                                        <span className="text-gray-500 text-sm">Customer</span>
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="text-center my-8 mt-12 text-2xl">No Reviews Yet</div>
                                }
                            </div>
                        </section>
                    </>
            }
        </>
    )
}

export default ProductDetails