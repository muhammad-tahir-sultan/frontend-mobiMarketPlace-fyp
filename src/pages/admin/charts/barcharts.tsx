import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { Skeleton } from "../../../components/loader";
import { useBarQuery } from "../../../redux/api/DashboardAPI";
import { RootState } from "../../../redux/store";
import { CustomEror } from "../../../types/api-types";
import { getLastMonths } from "../../../utils/features";



const Barcharts = () => {
  const { last6Months, last12Months } = getLastMonths()

  const { user } = useSelector((state: RootState) => state.userReducer)

  const { isError, data, isLoading, error } = useBarQuery(user?._id!)

  const charts = data?.charts!;

  if (isError) {
    const err = error as CustomEror;
    toast.error(err.data.message)
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {
          isLoading ? <Skeleton length={20} /> : <>

            <section>
              <BarChart
                data_1={charts.product}
                title_1="Products"
                data_2={charts.users}
                title_2="Users"
                labels={last6Months}
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                data_1={charts.order}
                labels={last12Months}
                data_2={[]}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        }
      </main>
    </div>
  );
};

export default Barcharts;
