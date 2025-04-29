import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { Skeleton } from "../../../components/loader";
import { useLineQuery } from "../../../redux/api/DashboardAPI";
import { RootState } from "../../../redux/store";
import { CustomEror } from "../../../types/api-types";
import { getLastMonths } from "../../../utils/features";



const Linecharts = () => {
  const { last12Months } = getLastMonths()

  const { user } = useSelector((state: RootState) => state.userReducer)

  const { isError, data, isLoading, error } = useLineQuery(user?._id!)

  const charts = data?.charts!;

  if (isError) {
    const err = error as CustomEror;
    toast.error(err.data.message)
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Line Charts</h1>
        {
          isLoading ? <Skeleton length={20} /> : <>
            <section>
              <LineChart
                data={charts.users}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                labels={last12Months}
                backgroundColor="rgba(53, 162, 255, 0.5)"
              />
              <h2>Active Users</h2>
            </section>

            <section>
              <LineChart
                data={charts.product}
                backgroundColor={"hsla(269,80%,40%,0.4)"}
                borderColor={"hsl(269,80%,40%)"}
                labels={last12Months}
                label="Products"
              />
              <h2>Total Products (SKU)</h2>
            </section>

            <section>
              <LineChart
                data={charts.revenue}
                backgroundColor={"hsla(129,80%,40%,0.4)"}
                borderColor={"hsl(129,80%,40%)"}
                label="Revenue"
                labels={last12Months}
              />
              <h2>Total Revenue </h2>
            </section>

            <section>
              <LineChart
                data={charts.discount}
                backgroundColor={"hsla(29,80%,40%,0.4)"}
                borderColor={"hsl(29,80%,40%)"}
                label="Discount"
                labels={last12Months}
              />
              <h2>Discount Allotted </h2>
            </section>
          </>
        }
      </main>
    </div>
  );
};

export default Linecharts;
