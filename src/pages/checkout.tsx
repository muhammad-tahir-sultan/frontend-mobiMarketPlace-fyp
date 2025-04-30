import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useNewOrderMutation } from "../redux/api/OrderAPI"
import { resetCart } from "../redux/reducers/cartReducers"
import { RootState } from "../redux/store"
import { NewOrderRequest } from "../types/api-types"
import { responseToast } from "../utils/features"
import { FaCreditCard, FaShoppingBag, FaLock, FaMapMarkerAlt, FaSpinner } from "react-icons/fa"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY)

const CheckOutForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state: RootState) => state.userReducer)
    const { shippingInfo, cartItems, subtotal, tax, discount, shippingCharges, total } = useSelector((state: RootState) => state.cartReducer)

    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [newOrder] = useNewOrderMutation()

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setIsProcessing(true)
        const orderData: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal,
            total,
            tax,
            discount,
            shippingCharges,
            user: user?._id!
        }

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required"
        })

        if (error) {
            setIsProcessing(false)
            return toast.error(error.message! || "Something went wrong");
        }

        if (paymentIntent!.status === "succeeded") {
            const res = await newOrder(orderData)
            dispatch(resetCart());
            responseToast(res, navigate, "/orders")
        }
        setIsProcessing(false)
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="payment-section">
                    <h2>
                        <FaCreditCard /> Payment Details
                    </h2>
                    <form className="payment-form" onSubmit={submitHandler}>
                        <div className="payment-element-container">
                            <PaymentElement />
                        </div>
                        <button 
                            className="pay-button" 
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <FaSpinner /> Processing...
                                </>
                            ) : (
                                <>Pay ${total.toFixed(2)}</>
                            )}
                        </button>
                        <div className="secure-payment">
                            <FaLock /> Secure payment via Stripe
                        </div>
                    </form>
                </div>

                <div className="order-summary">
                    <h2>
                        <FaShoppingBag /> Order Summary
                    </h2>
                    <div className="order-items">
                        {cartItems.map(item => (
                            <div className="order-item" key={item.productId}>
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-quantity">Qty: {item.quantity}</div>
                                </div>
                                <div className="item-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>${shippingCharges.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="summary-row discount">
                                <span>Discount</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="shipping-info">
                        <div className="shipping-title">
                            <FaMapMarkerAlt /> Shipping Address
                        </div>
                        <div className="address">
                            <p>{shippingInfo.address}</p>
                            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
                            <p>{shippingInfo.country}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CheckOut = () => {
    const location = useLocation()
    const clientSecret: string | undefined = location.state

    if (!clientSecret) return <Navigate to={"/shipping"} />

    return (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CheckOutForm />
        </Elements>
    )
}

export default CheckOut