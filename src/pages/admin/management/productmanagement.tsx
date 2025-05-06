import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash, FaImage } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { 
  useDeleteProductMutation, 
  useProductDetailsQuery, 
  useUpdateProductMutation,
  useUpdateProductDetailsMutation
} from "../../../redux/api/ProductAPI";
import { Skeleton } from "../../../components/loader";
import { responseToast } from "../../../utils/features";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Productmanagement = () => {
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)

  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useProductDetailsQuery(id!)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { category, images, price, stock, title, description = "" } = data?.product || {
    title: "",
    images: [],
    price: 0,
    stock: 0,
    category: "",
  }

  // Get the first image URL or use a placeholder
  const imageUrl = images && images.length > 0 
      ? images[0].url 
      : "https://via.placeholder.com/400";

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [titleUpdate, setTitleUpdate] = useState<string>(title);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>(description);
  const [ImageUpdate, setImageUpdate] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();

  const [updateProduct] = useUpdateProductMutation();
  const [updateProductDetails] = useUpdateProductDetailsMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUpdate(reader.result);
          setImageFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Split the update process into two steps: image upload and details update
      
      // Step 1: Only handle image upload if a new image was selected
      if (imageFile) {
        console.log("Handling image upload first...");
        const imageFormData = new FormData();
        imageFormData.set("image", imageFile);
        
        // Send minimal data required with image
        imageFormData.set("title", titleUpdate);
        imageFormData.set("price", priceUpdate.toString());
        imageFormData.set("stock", stockUpdate.toString());
        imageFormData.set("category", categoryUpdate);
        
        const imageRes = await updateProduct({ 
          formData: imageFormData, 
          userId: user?._id!, 
          productId: id! 
        });
        
        if (!imageRes.data?.success) {
          toast.error("Failed to update product image");
          setIsSubmitting(false);
          return;
        }
      }
      
      // Step 2: Update product details including description
      console.log("Updating product details...");
      console.log("Description to send:", descriptionUpdate);
      
      const productData = {
        title: titleUpdate,
        category: categoryUpdate,
        price: priceUpdate,
        stock: stockUpdate,
        description: descriptionUpdate
      };
      
      const res = await updateProductDetails({ 
        productData, 
        userId: user?._id!, 
        productId: id! 
      });
      
      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  }

  const deleteHandler = async () => {
    const res = await deleteProduct({ userId: user?._id!, productId: data?.product?._id! })
    responseToast(res, navigate, "/admin/product")
  }

  useEffect(() => {
    if (data) {
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setImageUpdate(data.product.images && data.product.images.length > 0 
        ? data.product.images[0].url 
        : "");
      setCategoryUpdate(data.product.category);
      setTitleUpdate(data.product.title);
      setDescriptionUpdate(data.product.description || "");
    }
  }, [data])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  if (isError) return <Navigate to={"/404"} />

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {
          isLoading ? <Skeleton length={20} /> : <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={imageUrl} alt="Product" />
              <p>{title}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>${price}</h3>
            </section>
            <article>
              <button 
                className="product-delete-btn" 
                onClick={deleteHandler}
                title="Delete Product"
              >
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={titleUpdate}
                    onChange={(e) => setTitleUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Description</label>
                  <ReactQuill
                    theme="snow"
                    value={descriptionUpdate}
                    onChange={setDescriptionUpdate}
                    modules={modules}
                    placeholder="Write product description here..."
                    style={{ height: "200px", marginBottom: "60px" }}
                  />
                </div>

                <div>
                  <label>Image</label>
                  <input 
                    type="file" 
                    onChange={changeImageHandler} 
                    accept="image/*" 
                  />
                </div>

                {ImageUpdate ? (
                  <img src={ImageUpdate} alt="Product Preview" />
                ) : (
                  <div className="empty-image-placeholder">
                    <FaImage />
                    <p>No new image selected</p>
                  </div>
                )}
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </form>
            </article>
          </>
        }
      </main>
    </div>
  );
};

export default Productmanagement;
