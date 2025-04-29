import { CartItem, shippingInfo, User } from "./types";


export interface UserReducerInitialState {
    user: User | null,
    loading: boolean,
}

export interface CartReducerInitialState {
    loading: boolean,
    cartItems: CartItem[],
    subtotal: number,
    total: number,
    discount: number,
    shippingCharges: number,
    shippingInfo: shippingInfo,
    tax: number,
    // order: Order | null,
}

