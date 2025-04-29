import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/ProductAPI"
import toast from "react-hot-toast"
import { Skeleton } from "../components/loader"
import { CartItem } from "../types/types"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../redux/reducers/cartReducers"
import { CartReducerInitialState } from "../types/reducer-types"

const Home = () => {

  const { data, isError, isLoading } = useLatestProductsQuery("")

  const dispatch = useDispatch()

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

  if (isError) toast.error("Cannot Fetch Products")


  return (
    <div className="home">
      <section>

      </section>

      <h1>Latest Products
        <Link to={"/search"} className="findmore" >More</Link>
      </h1>

      <main>

        {
          isLoading ? <Skeleton width="80vw" />
            : data?.products?.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                title={product.title}
                stock={product.stock}
                // quantity={product.quantity}
                price={product.price}
                image={product.image}
                handler={addToCartHandler}
                
              />
            ))
        }
      </main>
    </div>
  )
}

export default Home