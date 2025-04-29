import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Column } from "react-table"
import TableHOC from "../components/admin/TableHOC"
import { Skeleton } from "../components/loader"
import { useMyOrdersQuery } from "../redux/api/OrderAPI"
import { CustomEror } from "../types/api-types"
import { UserReducerInitialState } from "../types/reducer-types"

type DataType = {
    _id: string,
    amount: number,
    discount: number,
    quantity: number,
    status: React.ReactElement,
    action: React.ReactElement

}

const column: Column<DataType>[] = [{
    Header: 'ID',
    accessor: '_id',
}, {
    Header: 'Quantity',
    accessor: 'quantity',
}, {
    Header: 'Discount',
    accessor: 'discount',
}, {
    Header: 'Amount',
    accessor: 'amount',
}, {
    Header: 'Status',
    accessor: 'status',
}, {
    Header: 'Action',
    accessor: 'action',
    // Cell: ({ row }) => <Link to={`/admin/orders/${row._id}`}>Manage</Link>,
}]
const Orders = () => {


    const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
    const { isError, isLoading, error, data } = useMyOrdersQuery(user?._id!)

    if (isError) {
        const err = error as CustomEror;
        toast.error(err.data.message)
    }
    if (error) {
        const err = error as CustomEror;
        toast.error(err.data.message)
    }

    const [rows, setRows] = useState<DataType[]>([]);

    useEffect(() => {

        if (data) setRows(data.orders.map((order) => (
            {
                _id: order._id,
                amount: order.total,
                discount: order.discount,
                quantity: order.quantity,
                status: <span className={order.status === "Processing" ? "red" : order.status === "Shipped" ? "green" : "purple"}>{order.status}</span>,
                action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>

            }
        )));
    }, [data])

    const Table = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)()
    return (
        <div className="container">
            <h1>My Orders</h1>
            {isLoading ? <Skeleton length={20} /> : Table}        </div>
    )
}

export default Orders