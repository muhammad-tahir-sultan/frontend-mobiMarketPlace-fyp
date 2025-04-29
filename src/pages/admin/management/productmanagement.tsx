import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/ProductAPI";
import { server } from "../../../redux/store";
import { Skeleton } from "../../../components/loader";
import { responseToast } from "../../../utils/features";



const Productmanagement = () => {
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)

  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useProductDetailsQuery(id!)



  const { category, images, price, stock, title } = data?.product || {
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
  const [ImageUpdate, setImageUpdate] = useState<string>("");
  const [ImageFile, setImageFile] = useState<File>();


  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

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

    const formData = new FormData();

    if (titleUpdate) formData.set("title", titleUpdate);
    if (categoryUpdate) formData.set("category", categoryUpdate);
    if (ImageFile) formData.set("image", ImageFile);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate) formData.set("stock", stockUpdate.toString());
    const res = await updateProduct({ formData, userId: user?._id!, productId: id! })

    responseToast(res, navigate, "/admin/product")
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
    }
  }, [data])


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
              <button className="product-delete-btn" onClick={deleteHandler}>
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
                  <label>Image</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {ImageUpdate && <img src={ImageUpdate} alt="New Image" />}
                <button type="submit" style={{ margin: "10px 10px 80px 10px" }}>Update</button>
              </form>
            </article>
          </>
        }
      </main>
    </div>
  );
};

export default Productmanagement;
