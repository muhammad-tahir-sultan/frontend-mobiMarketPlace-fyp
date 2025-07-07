import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, shippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    tax: 0,
    shippingCharges: 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
    }
}

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;

            const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);

            if (index !== -1) {
                // Increment the quantity by 1 if the item already exists
                state.cartItems[index].quantity += 1;
            } else {
                // Add new item to cart
                state.cartItems.push({ ...action.payload, quantity: 1 });
            }
            state.loading = false;
        },
        decrementQuantity: (state, action: PayloadAction<CartItem>) => {
            const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);
            if (index !== -1 && state.cartItems[index].quantity > 1) {
                // Decrease the quantity if it's greater than 1
                state.cartItems[index].quantity -= 1;
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter((item) => item.productId !== action.payload);
            state.loading = false;
        },
        calculatePrice: (state) => {
            let subtotal = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
            state.subtotal = subtotal;
            
            // More realistic shipping charges
            if (subtotal >= 2000) {
                state.shippingCharges = 0;  // Free shipping for orders ≥ ₹2000
            } else if (subtotal >= 1000) {
                state.shippingCharges = 100;  // ₹100 shipping fee for orders ₹1000-₹2000
            } else {
                state.shippingCharges = 200;  // ₹200 shipping fee for smaller orders
            }
            
            // Standard GST/VAT tax rate (12%)
            state.tax = Math.round(subtotal * 0.12);
            
            // More realistic discount structure - 10% for orders above ₹5000
            state.discount = subtotal > 5000 ? Math.round(subtotal * 0.1) : 0;
            
            state.total = state.subtotal + state.shippingCharges + state.tax - state.discount;
        },
        discountApplied: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state, action: PayloadAction<shippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        resetCart: () => initialState
    }
});

export const { addToCart, decrementQuantity, removeFromCart, calculatePrice, discountApplied, saveShippingInfo, resetCart } = cartReducer.actions;
