import { Bar, CartItem, Line, Order, Pie, Product, shippingInfo, Stats, User } from "./types";

export type CustomEror = {
    status: number;
    data: {
        success: boolean;
        message: string;
    }
}

export type AllUsersMessageResponse = {
    success: boolean;
    users: User[];
}

export type MessageResponse = {
    success: boolean;
    message: string;
}

export type UserResponse = {
    success: boolean;
    user: User;
}


export type AllProductsResponse = {
    success: boolean;
    products: Product[];
}

export type ProductResponse = {
    success: boolean;
    product: Product;
}


export type SearchProductsResponse = AllProductsResponse & {
    totalPages: number;
}

export type SearchProductsRequest = {
    price: number;
    category: string;
    page: number;
    search: string;
}


export type AllCategoriesResponse = {
    success: boolean;
    categories: string[];
}



export type AllOrdersResponse = {
    success: boolean;
    orders: Order[];
}

export type OrderDetailsResponse = {
    success: boolean;
    order: Order;
}

export type UpdateOrderRequest = {
    userId: string;
    orderId: string;
}


export type StateResponse = {
    success: boolean;
    stats: Stats;
}

export type PieResponse = {
    success: boolean;
    charts: Pie;
}
export type BarResponse = {
    success: boolean;
    charts: Bar;
}
export type LineResponse = {
    success: boolean;
    charts: Line;
}






// Request APIs  -----------------------------


export type NewProductRequest = {
    id: string;
    formData: FormData;
}


export type UpdateProductRequest = {
    userId: string;
    productId: string;
    formData: FormData;
}

export type DeleteProductRequest = {
    userId: string;
    productId: string;
}

export type DeleteUserRequest = {
    userId: string;
    adminId: string;
}

export type NewOrderRequest = {
    user: string;
    shippingInfo: shippingInfo;
    orderItems: CartItem[],
    subtotal: number,
    total: number,
    discount: number,
    shippingCharges: number,
    tax: number,
}
