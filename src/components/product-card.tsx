import { FaPlus, FaStar } from "react-icons/fa"
import { CartItem } from "../types/types"
import { Link } from "react-router-dom"

type ProductProps = {
  price: number,
  title: string,
  productId: string,
  handler: (cartItem: CartItem) => string | undefined,
  stock: number,
  image: string,
  ratings?: number,
  // quantity: number,
}

const ProductCard = ({ image, productId, stock, price, title, handler, ratings = 0 }: ProductProps) => {
  return (
    <Link className="product-card" to={`/product/${productId}`}>
      <div className="product-image-container">
        <img src={image} alt={title} />
        {stock <= 0 && <span className="out-of-stock">Out of Stock</span>}
      </div>
      <div className="product-details">
        <h3>{title}</h3>
        <div className="product-meta">
          <div className="product-rating">
            <FaStar />
            <span>{ratings.toFixed(1)}</span>
          </div>
          <span className="product-price">${price}</span>
        </div>
        <button 
          className="add-to-cart-btn" 
          onClick={(e) => {
            e.preventDefault();
            handler({ productId, image, stock, price, title, quantity: 1 })
          }}
          disabled={stock <= 0}
        >
          <FaPlus />
          <span>Add to Cart</span>
        </button>
      </div>
    </Link>
  )
}

export default ProductCard