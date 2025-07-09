import { useEffect } from "react";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import CartItemCard from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, decrementQuantity, removeFromCart } from "../redux/reducers/cartReducers";
import toast from "react-hot-toast";

const Cart = () => {

  const { cartItems, discount, shippingCharges, subtotal, tax, total } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)

  const dispatch = useDispatch()

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return toast.error("Maximum quantity reached");
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
    dispatch(calculatePrice())
  }, [cartItems])

  return (
    <div className="container">
      <h1 className="cart-page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <FaShoppingCart /> Your Shopping Cart
      </h1>
      
      <div className={`cart ${cartItems.length === 0 ? 'empty-cart-container' : ''}`}>
        <main className={cartItems.length === 0 ? 'empty-cart-main' : ''}>
          {
            cartItems.length > 0 ? cartItems?.map((item, index) =>
              <CartItemCard cartItem={item} key={index} decrementHandler={decrementHandler} incrementHandler={addToCartHandler} removeHandler={removeFromCartHandler} />
            ) : (
              <div className="empty-cart">
                <h1>Your cart is empty</h1>
                <Link to="/search" className="shop-now-btn">
                  Shop Now <FaArrowRight />
                </Link>
              </div>
            )
          }
        </main>
        
        {cartItems.length > 0 && (
          <aside>
            <h3>Order Summary</h3>
            <p>
              <span>Subtotal:</span> <span>PKR {subtotal}</span>
            </p>
            <p>
              <span>Shipping:</span> <span>PKR {shippingCharges}</span>
            </p>
            <p>
              <span>Tax:</span> <span>PKR {tax}</span>
            </p>
            <p>
              <span>Discount:</span> <span className="red">- PKR {discount}</span>
            </p>
            <p>
              <span>Total:</span> <span>PKR {total}</span>
            </p>
            
            <Link to="/shipping">
              Proceed to Checkout <FaArrowRight />
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Cart;