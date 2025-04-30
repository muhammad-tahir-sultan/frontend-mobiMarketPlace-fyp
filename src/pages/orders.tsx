import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Skeleton } from "../components/loader"
import { useMyOrdersQuery } from "../redux/api/OrderAPI"
import { CustomEror } from "../types/api-types"
import { UserReducerInitialState } from "../types/reducer-types"
import { FaShoppingBag, FaArrowRight, FaBoxOpen } from "react-icons/fa"

const Orders = () => {
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
  const { isError, isLoading, error, data } = useMyOrdersQuery(user?._id!)

  if (isError) {
    const err = error as CustomEror;
    toast.error(err.data.message)
  }

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (data) setOrders(data.orders);
  }, [data])

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="page-title">
          <FaShoppingBag /> My Orders
        </h1>
        
        {isLoading ? (
          <Skeleton length={10} /> 
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <FaBoxOpen />
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet. Browse our products and make your first purchase!</p>
            <Link to="/search" className="shop-now-btn">
              Shop Now <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="orders-table">
            <div className="table-header">
              <div className="header-id">Order ID</div>
              <div className="header-quantity">Quantity</div>
              <div className="header-discount">Discount</div>
              <div className="header-amount">Amount</div>
              <div className="header-status">Status</div>
              <div className="header-action">Action</div>
            </div>
            
            {orders.map((order) => (
              <div className="order-row" key={order._id}>
                <div className="order-id">{order._id}</div>
                <div className="order-quantity">{order.quantity}</div>
                <div className="order-discount">PKR {order.discount.toLocaleString()}</div>
                <div className="order-amount">PKR {order.total.toLocaleString()}</div>
                <div className="order-status">
                  <span className={
                    order.status === "Processing" 
                      ? "processing" 
                      : order.status === "Shipped" 
                        ? "shipped" 
                        : "delivered"
                  }>
                    {order.status}
                  </span>
                </div>
                <div className="order-action">
                  <Link to={`/order/${order._id}`}>View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders