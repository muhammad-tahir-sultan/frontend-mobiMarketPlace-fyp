import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { server } from "../redux/store"
import { CartItem } from "../types/types"

type CartItemProps = {
    cartItem: CartItem,
    incrementHandler: (cartItem: CartItem) => void,
    decrementHandler: (cartItem: CartItem) => void,
    removeHandler: (id: string) => void,
}



const CartItemCard = ({ cartItem, decrementHandler, removeHandler, incrementHandler }: CartItemProps) => {
    const { image, title, productId, price, quantity } = cartItem
    return (
        <div className="cart-item">
            <img src={`${server}/${image}`} alt={title} />
            <article>
                <Link to={`/product/${productId}`}>{title}</Link>
                <span>${price} </span>
            </article>

            <div>
                <button onClick={() => decrementHandler(cartItem)}>-</button>
                <button>{quantity}</button>
                <button onClick={() => incrementHandler(cartItem)}>+</button>
            </div>

            <button onClick={() => removeHandler(productId)}>
                <FaTrash />
            </button>
        </div>
    )
}

export default CartItemCard