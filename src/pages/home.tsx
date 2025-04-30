import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/ProductAPI"
import toast from "react-hot-toast"
import { Skeleton } from "../components/loader"
import { CartItem } from "../types/types"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../redux/reducers/cartReducers"
import { CartReducerInitialState } from "../types/reducer-types"
import { FaArrowRight, FaMobile, FaDesktop, FaBatteryFull } from "react-icons/fa"

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
          <p>Discover premium smartphones and accessories at unbeatable prices with fast delivery</p>
          <Link to="/search" className="cta-button">
            Explore Collection <FaArrowRight />
          </Link>
        </div>
        <div className="feature-badges">
          <div className="badge">
            <FaMobile />
            <span>Sleek Design Phones</span>
          </div>
          <div className="badge">
            <FaDesktop />
            <span>High-Resolution Displays</span>
          </div>
          <div className="badge">
            <FaBatteryFull />
            <span>Long Battery Life</span>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <h2>Latest Products</h2>
        <Link to="/search" className="findmore">View All Products</Link>
      </div>

      <main>
        {isLoading ? (
          <Skeleton width="84vw" length={5} />
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

      {/* iPhone Categories Section */}
      <div className="section-heading">
        <h2>iPhone Categories</h2>
        <Link to="/search?category=mobile&brand=iphone" className="findmore">View All iPhones</Link>
      </div>

      <section className="mobile-banner-section">
        <div className="mobile-banner-container">
          {/* Banner Card 1 */}
          <div className="mobile-banner-card card-large" style={{ height: "420px" }}>
            <div className="banner-content">
              <span className="banner-label">Premium</span>
              <h3>iPhone Pro Series</h3>
              <p>Professional-grade cameras & displays</p>
              <Link to="/search?category=mobile&brand=iphone&tag=pro" className="banner-btn">Shop Now</Link>
            </div>
            <div className="banner-image">
              <img src="https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="iPhone Pro Series" />
            </div>
          </div>

          <div className="mobile-banners-small">
            {/* Banner Card 2 */}
            <div className="mobile-banner-card card-small">
              <div className="banner-content">
                <span className="banner-label">Popular</span>
                <h3>iPhone Standard</h3>
                <p>Powerful & affordable</p>
                <Link to="/search?category=mobile&brand=iphone&tag=standard" className="banner-btn">Shop Now</Link>
              </div>
              <div className="banner-image">
                <img src="https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="iPhone Standard" />
              </div>
            </div>

            {/* Banner Card 3 */}
            <div className="mobile-banner-card card-small">
              <div className="banner-content">
                <span className="banner-label">Compact</span>
                <h3>iPhone Mini</h3>
                <p>Small size, big performance</p>
                <Link to="/search?category=mobile&brand=iphone&tag=mini" className="banner-btn">Shop Now</Link>
              </div>
              <div className="banner-image">
                <img src="https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="iPhone Mini" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Android Categories Section */}
      <div className="section-heading">
        <h2>Android Categories</h2>
        <Link to="/search?category=mobile&os=android" className="findmore">View All Android</Link>
      </div>

      <section className="mobile-banner-section">
        <div className="mobile-banner-container">
          {/* Banner Card 1 */}
          <div className="mobile-banner-card card-large" style={{ height: "420px" }}>
            <div className="banner-content">
              <span className="banner-label">Flagship</span>
              <h3>Premium Android</h3>
              <p>Top-tier performance & cameras</p>
              <Link to="/search?category=mobile&os=android&price[gte]=700" className="banner-btn">Shop Now</Link>
            </div>
            <div className="banner-image">
              <img src="https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Premium Android Phones" />
            </div>
          </div>

          <div className="mobile-banners-small">
            {/* Banner Card 2 */}
            <div className="mobile-banner-card card-small" style={{ height: "200px", position: "relative", overflow: "visible" }}>
              <div className="banner-content" style={{ zIndex: "5", position: "relative", padding: "15px" }}>
                <span className="banner-label" style={{ display: "inline-block", marginBottom: "8px" }}>Mid-Range</span>
                <h3 style={{ marginBottom: "8px" }}>Value Android</h3>
                <p style={{ marginBottom: "12px" }}>Performance meets affordability</p>
                <Link to="/search?category=mobile&os=android&price[gte]=300&price[lte]=699" className="banner-btn" style={{ position: "relative", zIndex: "10" }}>Shop Now</Link>
              </div>
              <div className="banner-image" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "1" }}>
                <img src="https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Mid-Range Android" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            {/* Banner Card 3 */}
            <div className="mobile-banner-card card-small" style={{ height: "200px", position: "relative", overflow: "visible" }}>
              <div className="banner-content" style={{ zIndex: "5", position: "relative", padding: "15px" }}>
                <span className="banner-label" style={{ display: "inline-block", marginBottom: "8px" }}>Budget</span>
                <h3 style={{ marginBottom: "8px" }}>Affordable Android</h3>
                <p style={{ marginBottom: "12px" }}>Great features at lower prices</p>
                <Link to="/search?category=mobile&os=android&price[lte]=299" className="banner-btn" style={{ position: "relative", zIndex: "10" }}>Shop Now</Link>
              </div>
              <div className="banner-image" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "1" }}>
                <img src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Budget Android" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
          <div className="category-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <img src="https://img.icons8.com/color/96/000000/iphone.png" alt="iPhone Icon" style={{ maxHeight: "80px", objectFit: "contain" }} />
          </div>
          <h3>iPhone</h3>
          <p>Premium Apple devices</p>
          <Link to="/search?category=mobile&brand=iphone" className="category-link">Explore</Link>
        </div>
        
        <div className="category-card">
          <div className="category-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <img src="https://img.icons8.com/color/96/000000/samsung.png" alt="Samsung Icon" style={{ maxHeight: "80px", objectFit: "contain" }} />
          </div>
          <h3>Samsung</h3>
          <p>Galaxy smartphones</p>
          <Link to="/search?category=mobile&brand=samsung" className="category-link">Explore</Link>
        </div>
        
        <div className="category-card">
          <div className="category-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <img src="https://img.icons8.com/color/96/000000/android-os.png" alt="Android Icon" style={{ maxHeight: "80px", objectFit: "contain" }} />
          </div>
          <h3>Android Phones</h3>
          <p>Wide range selection</p>
          <Link to="/search?category=mobile&os=android" className="category-link">Explore</Link>
        </div>
        
        <div className="category-card">
          <div className="category-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <img src="https://img.icons8.com/color/96/000000/controller.png" alt="Gaming Phone Icon" style={{ maxHeight: "80px", objectFit: "contain" }} />
          </div>
          <h3>Gaming Phones</h3>
          <p>High-performance devices</p>
          <Link to="/search?category=mobile&tag=gaming" className="category-link">Explore</Link>
        </div>
      </section>

      {/* Brand Showcase Section */}
      <div className="section-heading">
        <h2>Top Brands</h2>
        <Link to="/search" className="findmore">View All</Link>
      </div>

      <section className="brands-section" style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div className="brand-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80px", width: "150px" }}>
          <Link to="/search?brand=apple">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{ maxHeight: "50px", maxWidth: "120px", objectFit: "contain" }} />
          </Link>
        </div>
        <div className="brand-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80px", width: "150px" }}>
          <Link to="/search?brand=samsung">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" alt="Samsung" style={{ maxHeight: "50px", maxWidth: "120px", objectFit: "contain" }} />
          </Link>
        </div>
        <div className="brand-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80px", width: "150px" }}>
          <Link to="/search?brand=oppo">
            <img src="/oppo.png" alt="Oppo" style={{ transform: "scale(2.75)", maxHeight: "50px", objectFit: "contain" }} />
          </Link>
        </div>
        <div className="brand-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80px", width: "150px" }}>
          <Link to="/search?brand=vivo">
            <img src="/vivo.png" alt="Vivo" style={{ maxHeight: "50px", maxWidth: "120px", objectFit: "contain" }} />
          </Link>
        </div>
        <div className="brand-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80px", width: "150px" }}>
          <Link to="/search?brand=tecno">
            <img src="/tecno.png" alt="Tecno" style={{ maxHeight: "50px", maxWidth: "120px", objectFit: "contain" }} />
          </Link>
        </div>
        <div className="brand-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80px", width: "150px" }}>
          <Link to="/search?brand=xiaomi">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/1024px-Xiaomi_logo_%282021-%29.svg.png" alt="Xiaomi" style={{ maxHeight: "50px", maxWidth: "120px", objectFit: "contain" }} />
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="section-heading">
        <h2>What Our Customers Say</h2>
      </div>

      <section className="testimonials-section">
        <div className="testimonial-card">
          <div className="quote-mark">"</div>
          <p className="testimonial-text">Mobile phone bohat acha hai. Delivery timing bhi perfect thi aur product ki quality bohot achi hai. Mein zaroor dobara khareedunga!</p>
          <div className="testimonial-author">
            <img src="/rehman.png" alt="Ahmed Khan" />
            <div>
              <h4>Ahmed Khan</h4>
              <div className="testimonial-stars">★★★★★</div>
            </div>
          </div>
        </div>
        
        <div className="testimonial-card">
          <div className="quote-mark">"</div>
          <p className="testimonial-text">Maine aaj tak MobiCommerce se kai phones kharide hain aur kabhi mayoos nahi huwa. Qeematein bhi market se kam hain aur service zabardast hai!</p>
          <div className="testimonial-author">
            <img src="/masroor.png" alt="Faisal Malik" />
            <div>
              <h4>Faisal Malik</h4>
              <div className="testimonial-stars">★★★★★</div>
            </div>
          </div>
        </div>
        
        <div className="testimonial-card">
          <div className="quote-mark">"</div>
          <p className="testimonial-text">Website par products ki variety bohat achi hai aur istemal karna bhi aasan hai. Yeh meri pasandida online mobile store hai. Shukriya team!</p>
          <div className="testimonial-author">
            <img className="w-10 h-10 rounded-full" src="/irshad-bibi.jpg" alt="Irshad Bibi" />
            <div>
              <h4>Irshad Bibi</h4>
              <div className="testimonial-stars">★★★★★</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home