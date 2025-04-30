import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useOrderDetailsQuery } from '../redux/api/OrderAPI';
import { Skeleton } from '../components/loader';
import toast from 'react-hot-toast';
import { FaShoppingBag, FaMapMarkerAlt, FaBoxOpen, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserReducerInitialState } from '../types/reducer-types';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useOrderDetailsQuery(id!);
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer);
  
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  useEffect(() => {
    if (data) setOrderDetails(data.order);
    if (isError) {
      const err = error as any;
      toast.error(err.data?.message || 'Error fetching order details');
    }
  }, [data, isError, error]);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString)?.toLocaleDateString(undefined, options);
  };
  
  if (isLoading) return (
    <div className="orders-page">
      <div className="orders-container">
        <Skeleton length={15} />
      </div>
    </div>
  );
  
  if (!orderDetails) return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="empty-orders">
          <FaBoxOpen />
          <h2>Order Not Found</h2>
          <p>We couldn't find the order you're looking for.</p>
          <Link to="/orders" className="shop-now-btn">View All Orders</Link>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="receipt-page">
      <div className="receipt-container">
        {/* Header */}
        <div className="receipt-header">
          <div className="receipt-header-text">
            <h2>Thanks for your Order, {user?.name} !</h2>
            <div className="store-name">MobiCommerce</div>
          </div>
          <div className="receipt-logo">
            <FaShoppingBag />
          </div>
        </div>
        
        {/* Receipt Title */}
        <div className="receipt-title-section">
          <h3>Receipt</h3>
          <div className="receipt-voucher">Receipt Voucher: {orderDetails._id.substring(0, 10)}</div>
        </div>
        
        {/* Order Details Section - Now First */}
        <div className="order-summary">
          <div className="summary-title">Order Details</div>
          
          <div className="summary-details">
            <div className="summary-left">
              <div className="detail-item">
                <div className="detail-label">Invoice Number:</div>
                <div className="detail-value">{orderDetails._id.substring(0, 6)}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Invoice Date:</div>
                <div className="detail-value">{formatDate(orderDetails.createdAt)}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Status:</div>
                <div className="detail-value status">
                  <span className={
                    orderDetails.status === "Processing" 
                      ? "processing" 
                      : orderDetails.status === "Shipped" 
                        ? "shipped" 
                        : "delivered"
                  }>
                    {orderDetails.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="summary-right">
              <div className="detail-item">
                <div className="detail-label">Subtotal:</div>
                <div className="detail-value">PKR {orderDetails.subtotal?.toLocaleString()}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Discount:</div>
                <div className="detail-value">PKR {orderDetails.discount?.toLocaleString()}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Tax (GST):</div>
                <div className="detail-value">PKR {orderDetails.tax?.toLocaleString()}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Shipping:</div>
                <div className="detail-value">PKR {orderDetails.shippingCharges?.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="shipping-address">
            <div className="detail-label">
              <FaMapMarkerAlt /> Shipping Address:
            </div>
            <div className="address-text">
              <span>{orderDetails.shippingInfo.address}</span>
              <span>{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.postalCode}</span>
              <span>{orderDetails.shippingInfo.country}</span>
            </div>
          </div>
        </div>
        
        {/* Tracking Info - Now Middle */}
        <div className="tracking-section">
          <div className="tracking-label">Track Order</div>
          <div className="tracking-progress">
            <div className={`progress-bar ${
              orderDetails.status === "Processing" 
                ? "half-filled" 
                : orderDetails.status === "Shipped" 
                  ? "filled" 
                  : "completed"
            }`}></div>
          </div>
          <div className="tracking-states">
            <div>Processing</div>
            <div>Out for delivery</div>
            <div>Delivered</div>
          </div>
        </div>
        
        {/* Order Items - Now Last */}
        <div className="receipt-items">
          <div className="section-title">
            <FaBoxOpen /> Order Items ({orderDetails.orderItems.length})
          </div>
          {orderDetails.orderItems.map((item: any) => (
            <div className="receipt-item" key={item._id}>
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-specs">
                  <span>Quantity: {item.quantity}</span>
                </div>
              </div>
              <div className="item-price">
                PKR {item.price?.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        
        {/* Total Paid */}
        <div className="total-paid-section">
          <div className="total-label">TOTAL PAID</div>
          <div className="total-amount">PKR {orderDetails.total?.toLocaleString()}</div>
        </div>
        
        {/* Back Button */}
        <div className="back-to-orders">
          <Link to="/orders" className="back-btn">
            <span>Back to My Orders</span> <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;