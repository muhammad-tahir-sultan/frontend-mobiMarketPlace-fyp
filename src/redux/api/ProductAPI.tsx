import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllCategoriesResponse, AllProductsResponse, DeleteProductRequest, MessageResponse, NewProductRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse, UpdateProductRequest } from "../../types/api-types";


export const productAPI = createApi({
    reducerPath: "productApi", baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/product/` }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({ 
            query: () => "latest", 
            providesTags: ["product"],
            // Force refresh on every call to ensure we get the latest data
            forceRefetch: () => true
        }),
        allProducts: builder.query<AllProductsResponse, string>({ query: (id) => `admin-products?id=${id}`, providesTags: ["product"] }),
        allCategories: builder.query<AllCategoriesResponse, string>({ query: () => `categories`, providesTags: ["product"] }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
            query: ({ price, category, page, search }) => {
                let url = `all?search=${search}&page=${page}`;
                if (price) url += `&price=${price}`;
                if (category) url += `&category=${category}`;
                
                console.log("Search API request with URL:", url);
                
                return url;
            }, 
            providesTags: ["product"],
            forceRefetch: ({ currentArg, previousArg }) => {
                if (!previousArg) return true;
                
                return (
                    currentArg?.category !== previousArg?.category ||
                    currentArg?.price !== previousArg?.price ||
                    currentArg?.search !== previousArg?.search ||
                    currentArg?.page !== previousArg?.page
                );
            }
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
        updateProductDetails: builder.mutation<MessageResponse, { userId: string; productId: string; productData: any }>({
            query: ({ userId, productId, productData }) => ({
                url: `${productId}/details?id=${userId}`,
                method: "PATCH",
                body: productData
            }), 
            invalidatesTags: ["product"]
        }),
        createProductWithDetails: builder.mutation<MessageResponse, { userId: string; productData: any }>({
            query: ({ userId, productData }) => ({
                url: `create-with-details?id=${userId}`,
                method: "POST",
                body: productData
            }), 
            invalidatesTags: ["product"]
        }),
    })

})


export const { useLatestProductsQuery, useAllProductsQuery, useAllCategoriesQuery, useSearchProductsQuery, useNewProductMutation, useProductDetailsQuery, useUpdateProductMutation, useDeleteProductMutation, useSubmitReviewMutation, useUpdateProductDetailsMutation, useCreateProductWithDetailsMutation } = productAPI