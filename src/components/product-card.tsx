import { FaPlus } from "react-icons/fa"
import { server } from "../redux/store"
import { CartItem } from "../types/types"
import { Link } from "react-router-dom"

type ProductProps = {
  price: number,
  title: string,
  productId: string,
  handler: (cartItem: CartItem) => string | undefined,
  stock: number,
  image: string,
  // quantity: number,
}

const ProductCard = ({ image, productId, stock, price, title, handler }: ProductProps) => {



  return (
    <Link className="product-card" to={`/product/${productId}`}>
      <img src={`${server}/${image}`} height={100} width={100} alt={title} />
      <p>{title}</p>
      <span>${price}</span>
      <div>
        <button onClick={() => handler({ productId, image, stock, price, title, quantity: 1 })}>
          <FaPlus />
        </button>
      </div>

    </Link >
  )
}

export default ProductCard