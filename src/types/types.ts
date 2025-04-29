export type User = {
    name: string,
    email: string,
    image: string,
    gender: string,
    role: string,
    dob: string,
    _id: string,
}

export type Review = {
    comment: string;
    user: {
        _id: string;
        name: string;
        image: string;
    };
}


export type Product = {
    title: string,
    category: string,
    price: number,
    stock: number,
    images: {
        public_id: string,
        url: string
    }[],
    _id: string,
    quantity: number,
    reviews?: []
}

export type shippingInfo = {
    city: string,
    state: string,
    country: string,
    postalCode: string,
    address: string
}
export type CartItem = {
    productId: string,
    image: string,
    title: string,
    price: number,
    quantity: number,
    stock: number
}


export type Order = {
    orderItems: OrderItem[],
    shippingInfo: shippingInfo,
    subtotal: number,
    total: number,
    discount: number,
    shippingCharges: number,
    tax: number,
    quantity: number,
    _id: string,
    status: string,
    user: {
        name: string,
        _id: string
    },
}

type CountAndChange = {
    revenue: number;
    product: number;
    user: number;
    order: number;
}

type LatestTransactions = {
    _id: string;
    discount: number;
    amount: number;
    status: string;
    quantity: number;
}

export type Stats = {
    categoryCount: Record<string, number>[],
    percentChange: CountAndChange,
    count: CountAndChange,
    chart: {
        order: number[],
        revenue: number[]

    },
    userRatio: {
        male: number;
        female: number;
    },
    latestTransactions: LatestTransactions[]
}

type OrderFullfillment = {
    processing: number;
    shipped: number;
    delivered: number;
}

type StockAvailability = {
    inStock: number;
    outOfStock: number;
}


type RevenueDistribution = {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
}

type UsersAgeGroup = {
    teen: number;
    adult: number;
    old: number;
}

type AdminCustomers = {
    admin: number;
    customer: number;
}

export type Pie = {
    orderFullfillment: OrderFullfillment,
    productCategories: Record<string, number>[],
    stockAvailability: StockAvailability,
    revenueDistribution: RevenueDistribution,
    usersAgeGroup: UsersAgeGroup,
    adminCustomers: AdminCustomers
}


export type Bar = {
    users: number[],
    product: number[],
    order: number[],
}

export type Line = {
    users: number[],
    product: number[],
    discount: number[],
    revenue: number[]
}


export type OrderItem = Omit<CartItem, "stock"> & { _id: string }