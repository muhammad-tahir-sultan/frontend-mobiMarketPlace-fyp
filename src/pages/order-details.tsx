import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useOrderDetailsQuery } from '../redux/api/OrderAPI';
import { UserReducerInitialState } from '../types/reducer-types';
import { Skeleton } from '../components/loader';
import toast from 'react-hot-toast';
import { FaShoppingBag, FaTruck, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer);
  const { data, isLoading, isError, error } = useOrderDetailsQuery({ orderId: id!, userId: user?._id! });
  
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
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="page-title">
          <FaShoppingBag /> Order Details
        </h1>
        <Skeleton length={15} />
      </div>
    </div>
  );
  
  if (!orderDetails) return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="page-title">
          <FaShoppingBag /> Order Details
        </h1>
        <div className="empty-orders">
          <h2>Order Not Found</h2>
          <p>We couldn't find the order you're looking for.</p>
        </div>
      </div>
    </div>
  );
  
    return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="page-title">
          <FaShoppingBag /> Order Details
        </h1>
        
        <div className="order-details">
          <div className="order-id">Order ID: {orderDetails._id}</div>
          
          <div className="detail-row">
            <div className="detail-label">
              <FaCalendarAlt /> Order Date
            </div>
            <div className="detail-value">
              {formatDate(orderDetails.createdAt)}
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">
              <FaTruck /> Status
            </div>
            <div className="detail-value">
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
          
          <div className="detail-row">
            <div className="detail-label">Subtotal</div>
            <div className="detail-value">${orderDetails.subtotal}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Shipping</div>
            <div className="detail-value">${orderDetails.shippingCharges}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Tax</div>
            <div className="detail-value">${orderDetails.tax}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Discount</div>
            <div className="detail-value">-${orderDetails.discount}</div>
          </div>
          
          <div className="detail-row">
            <div className="detail-label">Total</div>
            <div className="detail-value highlight">${orderDetails.total}</div>
          </div>
        </div>
        
        <div className="order-items">
          <h2 className="section-title">Order Items</h2>
          <div className="item-list">
            {orderDetails.orderItems.map((item: any) => (
              <div className="order-item" key={item._id}>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta">
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: ${item.price}</span>
                  </div>
                </div>
                <div className="item-price">
                  ${item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="shipping-info">
          <h2 className="section-title">
            <FaMapMarkerAlt /> Shipping Address
          </h2>
          <div className="address-details">
            <p>
              <span className="address-line">{orderDetails.shippingInfo.address}</span>
              <span className="address-line">{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.state} {orderDetails.shippingInfo.postalCode}</span>
              <span className="address-line">{orderDetails.shippingInfo.country}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;