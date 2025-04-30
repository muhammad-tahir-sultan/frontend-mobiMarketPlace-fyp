import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/ProductAPI"
import toast from "react-hot-toast"
import { Skeleton } from "../components/loader"
import { CartItem } from "../types/types"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../redux/reducers/cartReducers"
import { CartReducerInitialState } from "../types/reducer-types"
import { FaArrowRight, FaShippingFast } from "react-icons/fa"

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
      <section className="hero-section">
        <div className="hero-content">
          <h1>The Ultimate Mobile Experience</h1>
          <p>Discover premium smartphones and accessories at unbeatable prices with free delivery</p>
          <Link to="/search" className="cta-button">
            Explore Collection <FaArrowRight />
          </Link>
        </div>
        <div className="feature-badges">
          <div className="badge">
            <FaShippingFast />
            <span>Free Express Shipping</span>
          </div>
          <div className="badge">
            <span>24/7 Premium Support</span>
          </div>
          <div className="badge">
            <span>30-Day Money Back Guarantee</span>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <h2>Latest Products</h2>
        <Link to="/search" className="findmore">View All Products</Link>
      </div>

      <main>
        {isLoading ? (
          <Skeleton width="100%" length={5} />
        ) : (
          data?.products?.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              title={product.title}
              stock={product.stock}
              price={product.price}
              image={product.images && product.images.length > 0 
                ? product.images[0].url 
                : "https://via.placeholder.com/300"}
              handler={addToCartHandler}
              ratings={product.ratings}
            />
          ))
        )}
      </main>

      {/* Mobile Banner Cards Section */}
      <div className="section-heading">
        <h2>Featured Deals</h2>
        <Link to="/search?category=mobile" className="findmore">View All Phones</Link>
      </div>

      <section className="mobile-banner-section">
        <div className="mobile-banner-container">
          {/* Banner Card 1 */}
          <div className="mobile-banner-card card-large">
            <div className="banner-content">
              <span className="banner-label">New Release</span>
              <h3>Premium Flagship Phones</h3>
              <p>Experience next-gen technology</p>
              <Link to="/search?category=mobile&sort=price" className="banner-btn">Shop Now</Link>
            </div>
            <div className="banner-image">
              <img src="https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=1000&auto=format&fit=crop" alt="Premium Smartphones" />
            </div>
          </div>

          <div className="mobile-banners-small">
            {/* Banner Card 2 */}
            <div className="mobile-banner-card card-small">
              <div className="banner-content">
                <span className="banner-label">Hot Deal</span>
                <h3>Mid-Range Phones</h3>
                <p>Best value for money</p>
                <Link to="/search?category=mobile&price[lte]=500" className="banner-btn">Shop Now</Link>
              </div>
              <div className="banner-image">
                <img src="https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=1000&auto=format&fit=crop" alt="Mid-Range Phones" />
              </div>
            </div>

            {/* Banner Card 3 */}
            <div className="mobile-banner-card card-small">
              <div className="banner-content">
                <span className="banner-label">Limited Offer</span>
                <h3>Accessories Sale</h3>
                <p>Up to 50% off</p>
                <Link to="/search?category=accessories" className="banner-btn">Shop Now</Link>
              </div>
              <div className="banner-image">
                <img src="https://images.unsplash.com/photo-1600086827875-a63b01f1335c?q=80&w=1000&auto=format&fit=crop" alt="Phone Accessories" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Categories Section */}
      <div className="section-heading">
        <h2>Trending Categories</h2>
        <Link to="/search?category=mobile" className="findmore">Browse All</Link>
      </div>

      <section className="categories-section">
        <div className="category-card">
          <div className="category-icon">📱</div>
          <h3>Smartphones</h3>
          <p>Latest flagship models</p>
          <Link to="/search?category=mobile&sort=price&order=desc" className="category-link">Explore</Link>
        </div>
        
        <div className="category-card">
          <div className="category-icon">🔋</div>
          <h3>Budget Phones</h3>
          <p>Affordable quality phones</p>
          <Link to="/search?category=mobile&price[lte]=300" className="category-link">Explore</Link>
        </div>
        
        <div className="category-card">
          <div className="category-icon">📲</div>
          <h3>Phone Cases</h3>
          <p>Protect your investment</p>
          <Link to="/search?category=accessories&subcategory=cases" className="category-link">Explore</Link>
        </div>
        
        <div className="category-card">
          <div className="category-icon">🔌</div>
          <h3>Chargers</h3>
          <p>Fast charging solutions</p>
          <Link to="/search?category=accessories&subcategory=chargers" className="category-link">Explore</Link>
        </div>
      </section>

      {/* Brand Showcase Section */}
      <div className="section-heading">
        <h2>Top Brands</h2>
        <Link to="/search" className="findmore">View All</Link>
      </div>

      <section className="brands-section">
        <div className="brand-card">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
        </div>
        <div className="brand-card">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" alt="Samsung" />
        </div>
        <div className="brand-card">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Xiaomi_logo.svg/1024px-Xiaomi_logo.svg.png" alt="Xiaomi" />
        </div>
        <div className="brand-card">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" />
        </div>
        <div className="brand-card">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="section-heading">
        <h2>What Our Customers Say</h2>
      </div>

      <section className="testimonials-section">
        <div className="testimonial-card">
          <div className="quote-mark">"</div>
          <p className="testimonial-text">The products arrived in perfect condition and much faster than I expected. The customer service was also excellent!</p>
          <div className="testimonial-author">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Emma Wilson" />
            <div>
              <h4>Emma Wilson</h4>
              <div className="testimonial-stars">★★★★★</div>
            </div>
          </div>
        </div>
        
        <div className="testimonial-card">
          <div className="quote-mark">"</div>
          <p className="testimonial-text">I've purchased multiple phones from MobiCommerce and have never been disappointed. Their prices are unbeatable!</p>
          <div className="testimonial-author">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="James Cooper" />
            <div>
              <h4>James Cooper</h4>
              <div className="testimonial-stars">★★★★★</div>
            </div>
          </div>
        </div>
        
        <div className="testimonial-card">
          <div className="quote-mark">"</div>
          <p className="testimonial-text">The selection is amazing and the website is so easy to navigate. Definitely my go-to store for all tech purchases.</p>
          <div className="testimonial-author">
            <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Sophia Chen" />
            <div>
              <h4>Sophia Chen</h4>
              <div className="testimonial-stars">★★★★★</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home