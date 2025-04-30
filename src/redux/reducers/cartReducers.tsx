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
            
            // Updated shipping charges logic ($10-$20 range)
            if (subtotal >= 1000) {
                state.shippingCharges = 10;  // Minimum shipping fee for orders >= $1000
            } else if (subtotal >= 500) {
                state.shippingCharges = 15;  // Medium shipping fee for orders >= $500
            } else {
                state.shippingCharges = 20;  // Maximum shipping fee for smaller orders
            }
            
            // Drastically reduced tax rate (lower than shipping)
            // Using a fixed 2% rate to ensure it's always less than shipping charges
            state.tax = Math.round(subtotal * 0.02);
            
            // For very large orders, cap the tax at $8 to keep it below minimum shipping ($10)
            if (state.tax >= 9) {
                state.tax = 8;
            }
            
            state.discount = subtotal > 5000 ? 1000 : 0;
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
