import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { CartItem } from "../types/types"

type CartItemProps = {
    cartItem: CartItem,
    incrementHandler: (cartItem: CartItem) => void,
    decrementHandler: (cartItem: CartItem) => void,
    removeHandler: (id: string) => void,
}

const CartItemCard = ({ cartItem, decrementHandler, removeHandler, incrementHandler }: CartItemProps) => {
    const { image, title, productId, price, quantity } = cartItem
    
    // Determine if the image URL is a Cloudinary URL or a local path
    const imageUrl = image.startsWith('http') 
        ? image 
        : `http://localhost:5000/${image}`
    
    return (
        <div className="cart-item">
            <img src={imageUrl} alt={title} />
            <article>
                <Link to={`/product/${productId}`}>{title}</Link>
                <span>PKR {price}</span>
            </article>

            <div className="quantity-selector">
                <select 
                    value={quantity} 
                    onChange={(e) => {
                        const newQuantity = Number(e.target.value);
                        if (newQuantity > quantity) {
                            // Add more items
                            incrementHandler({...cartItem, quantity: newQuantity - quantity});
                        } else if (newQuantity < quantity) {
                            // Remove items
                            for (let i = 0; i < quantity - newQuantity; i++) {
                                decrementHandler(cartItem);
                            }
                        }
                    }}
                >
                    {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={() => removeHandler(productId)} title="Remove Item">
                <FaTrash />
            </button>
        </div>
    )
}

export default CartItemCard