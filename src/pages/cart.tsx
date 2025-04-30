import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import CartItemCard from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, decrementQuantity, discountApplied, removeFromCart } from "../redux/reducers/cartReducers";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../redux/store";


const Cart = () => {

  const { cartItems, discount, shippingCharges, subtotal, tax, total } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)

  const [couponCode, setCouponCode] = useState<string>("")
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false)

  const dispatch = useDispatch()


  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return toast.error("Maximum quantity reached");
    ;
    dispatch(addToCart({ ...cartItem, quantity: 1 }));
    toast.success("Added to Cart");
  }


  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity > 1) {
      dispatch(decrementQuantity(cartItem));
    } else {
      toast.error("Minimum quantity reached");
    }
  };



  const removeFromCartHandler = (productId: string) => {
    dispatch(removeFromCart(productId))
  }

  useEffect(() => {

    const { cancel, token } = axios.CancelToken.source();

    const timeOutID = setTimeout(() => {
      axios.get(`${server}/payment/discount?coupon=${couponCode}`, { cancelToken: token }).then((response) => {
        dispatch(discountApplied(response.data.discount))
        setIsValidCouponCode(true)
        dispatch(calculatePrice())

      }).catch((error) => {
        dispatch(discountApplied(0))
        console.log(error.response.data);
        dispatch(calculatePrice())
        setIsValidCouponCode(false)
      })

    }, 1000)

    return () => {
      clearTimeout(timeOutID)
      cancel()
      setIsValidCouponCode(false)
    }
  }, [couponCode])


  useEffect(() => {
    dispatch(calculatePrice())
  }, [cartItems])

  return (
    <div className="container">
      <h1 className="cart-page-title">
        <FaShoppingCart /> Your Shopping Cart
      </h1>
      
      <div className="cart">
        <main>
          {
            cartItems.length > 0 ? cartItems?.map((item, index) =>
              <CartItemCard cartItem={item} key={index} decrementHandler={decrementHandler} incrementHandler={addToCartHandler} removeHandler={removeFromCartHandler} />
            ) : <h1>Your cart is empty</h1>
          }
        </main>
        
        <aside>
          <h3>Order Summary</h3>
          <p>
            <span>Subtotal:</span> <span>${subtotal}</span>
          </p>
          <p>
            <span>Shipping:</span> <span>${shippingCharges}</span>
          </p>
          <p>
            <span>Tax:</span> <span>${tax}</span>
          </p>
          <p>
            <span>Discount:</span> <span className="red">- ${discount}</span>
          </p>
          <p>
            <span>Total:</span> <span>${total}</span>
          </p>

          <input 
            type="text" 
            placeholder="Enter Coupon Code" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)} 
          />
          
          {
            couponCode && (
              isValidCouponCode ? 
                <span className="green">${discount} off using <code>{couponCode}</code></span> : 
                <span className="red">
                  Invalid Coupon <VscError />
                </span>
            )
          }
          
          {
            cartItems.length > 0 && 
            <Link to={"/shipping"}>
              Proceed to Checkout <FaArrowRight />
            </Link>
          }
        </aside>
      </div>
    </div>
  )
}

export default Cart