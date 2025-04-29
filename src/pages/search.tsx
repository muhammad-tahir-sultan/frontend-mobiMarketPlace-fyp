import { useState } from "react"
import ProductCard from "../components/product-card"
import { useAllCategoriesQuery, useSearchProductsQuery } from "../redux/api/ProductAPI"
import toast from "react-hot-toast"
import { CustomEror } from "../types/api-types"
import { Skeleton } from "../components/loader"
import { useDispatch, useSelector } from "react-redux"
import { CartItem } from "../types/types"
import { addToCart } from "../redux/reducers/cartReducers"
import { CartReducerInitialState } from "../types/reducer-types"

const Search = () => {

  const { isError, isLoading: loadingCategories, error, data: categoriesResponse } = useAllCategoriesQuery("")


  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [sort, setSort] = useState("")
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [page, setPage] = useState(1)

  const { isLoading: searchLoading, data: searchedData, isError: productIsError } = useSearchProductsQuery({ search, category, sort, price: maxPrice, page })

  if (isError) {
    const err = error as CustomEror;
    toast.error(err.data.message)
  }

  if (productIsError) {
    const err = error as CustomEror;
    toast.error(err.data.message)
  }

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




  const isPrevPage = page > 1;
  const isNextPage = page < 4;
  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4> Sort </h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>

        <div>
          <h4> Max Price : {maxPrice || ""} </h4>
          <input type="range" min={100} max={1000000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </div>

        <div>
          <h4> Category </h4>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {
              !loadingCategories && categoriesResponse?.categories.map(category => <option key={category} value={category}>{category.toUpperCase()}</option>)
            }
          </select>
        </div>
      </aside >


      <main>

        <h1>Products</h1>
        <input type="text" placeholder="Search By Name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="search-product-list">
          {
            searchLoading ? <Skeleton /> : searchedData?.products.map(product => <ProductCard productId={product._id} title={product.title} stock={product.stock} price={product.price} image={product.image} handler={addToCartHandler} />)
          }
        </div>

        {
          searchedData && searchedData?.totalPages > 1 && <article>
            <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
            <span>{page} of {searchedData?.totalPages} </span>
            <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </article>
        }
      </main>
    </div >
  )
}

export default Search