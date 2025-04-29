import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/UserAPI";
import { RootState } from "../../redux/store";
import { CustomEror } from "../../types/api-types";
import { responseToast } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Avatar", accessor: "avatar" },
  { Header: "Name", accessor: "name" },
  { Header: "Gender", accessor: "gender" },
  { Header: "Email", accessor: "email" },
  { Header: "Role", accessor: "role" },
  { Header: "Action", accessor: "action" },
];

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isError, isLoading, error, data } = useAllUsersQuery(user?._id!);

  if (isError) {
    const err = error as CustomEror;
    toast.error(err.data.message);
  }

  const [rows, setRows] = useState<DataType[]>([]);
  const [deleteUser] = useDeleteUserMutation();

  const confirmDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteHandler(userId);
    }
  };

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminId: user?._id! });
    responseToast(res, null, "");
  };

  useEffect(() => {
    if (data)
      setRows(
        data.users.map((user) => ({
          avatar: <img src={`${user.image}`} alt={user.name} />,
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          action: (
            <button onClick={() => confirmDelete(user._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
