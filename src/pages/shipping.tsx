import { ChangeEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { CartReducerInitialState } from "../types/reducer-types"
import axios from "axios"
import { server } from "../redux/store"
import toast from "react-hot-toast"
import { saveShippingInfo } from "../redux/reducers/cartReducers"

const Shipping = () => {

    const { cartItems, total } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",

    })
    const location = useLocation();
    const clientSecret = location.state;

    console.log("main hoon client secret: " + clientSecret);


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(saveShippingInfo(shippingInfo));

        try {
            const { data } = await axios.post(`${server}/payment/create`, {
                amount: total,
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            console.log(data); // Debug if clientSecret is valid

            if (data?.client_secret) {
                navigate("/pay", {
                    state: data.client_secret, // Passing clientSecret as state
                });
            } else {
                throw new Error("Payment failed, clientSecret is missing.");
            }

        } catch (error: any) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (cartItems.length <= 0) return navigate("/cart")
    }, [cartItems])
    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}>
                <BiArrowBack />
            </button>

            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>
                <input required type="text" placeholder="Address" name="address" value={shippingInfo.address} onChange={handleChange} />
                <input required type="text" placeholder="City" name="city" value={shippingInfo.city} onChange={handleChange} />
                <input required type="text" placeholder="State" name="state" value={shippingInfo.state} onChange={handleChange} />
                <select required name="country" value={shippingInfo.country} onChange={handleChange} >
                    <option value="">Choose Country</option>
                    <option value="pakistan">Pakistan</option>
                </select>
                <input required type="number" placeholder="Postal Code" name="postalCode" value={shippingInfo.postalCode} onChange={handleChange} />
                <input type="submit" value="Pay Now" />
            </form>
        </div>
    )
}

export default Shipping