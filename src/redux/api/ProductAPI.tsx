import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllCategoriesResponse, AllProductsResponse, DeleteProductRequest, MessageResponse, NewProductRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types";


export const productAPI = createApi({
    reducerPath: "productApi", baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/product/` }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({ query: () => "latest", providesTags: ["product"] }),
        allProducts: builder.query<AllProductsResponse, string>({ query: (id) => `admin-products?id=${id}`, providesTags: ["product"] }),
        allCategories: builder.query<AllCategoriesResponse, string>({ query: () => `categories`, providesTags: ["product"] }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
            query: ({ price, category, page, search, sort }) => {
                let base = `all?search=${search}&page=${page}`
                if (price) base += `&price=${price}`;
                if (category) base += `&category=${category}`;
                if (sort) base += `&sort=${sort}`;

                return base
            }, providesTags: ["product"]
        }),
        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ formData, id }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData
            }), invalidatesTags: ["product"]
        }),
        productDetails: builder.query<ProductResponse, string>({ 
            query: (id) => id, 
            providesTags: (_, __, id) => [{ type: "product", id }] 
        }),
        updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({ formData, userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "PUT",
                body: formData
            }), invalidatesTags: ["product"]
        }),
        deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
            query: ({ userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "DELETE",
            }), invalidatesTags: ["product"]
        }),
        submitReview: builder.mutation<MessageResponse, { id: string; rating: number; comment: string; user: string }>({
            query: (reviewData) => ({
                url: "review",
                method: "PUT",
                body: reviewData
            }),
            invalidatesTags: (_, __, { id }) => [{ type: "product", id }]
        }),
    })

})


export const { useLatestProductsQuery, useAllProductsQuery, useAllCategoriesQuery, useSearchProductsQuery, useNewProductMutation, useProductDetailsQuery, useUpdateProductMutation, useDeleteProductMutation, useSubmitReviewMutation } = productAPI