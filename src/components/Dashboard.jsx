import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

const glassCard =
  "backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 transition hover:bg-white/20";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("access");
      const refreshToken = localStorage.getItem("refresh");

      try {
        let res = await fetch("http://127.0.0.1:8000/api/budget/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 401 && refreshToken) {
          const tokenRes = await fetch(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          );

          if (!tokenRes.ok) throw new Error("Refresh token failed");
          const tokenData = await tokenRes.json();
          localStorage.setItem("access", tokenData.access);

          res = await fetch("http://127.0.0.1:8000/api/budget/", {
            headers: { Authorization: `Bearer ${tokenData.access}` },
          });
        }

        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const result = await res.json();
        setData(Array.isArray(result) ? result[0] : result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  // Doughnut chart data
  const doughnutData = {
    labels: ["Total Income", "Total Expense", "Recommended Spending", "Remaining Balance"],
    datasets: [
      {
        label: "Budget Overview",
        data: [
          data?.total_income || 0,
          data?.total_expense || 0,
          data?.recommended_spending || 0,
          data?.remaining_balance || 0,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "white" },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={glassCard}>
            <p className="text-sm text-white/70">Total Income</p>
            <p className="text-xl font-bold">{data?.total_income}</p>
          </div>

          <div className={glassCard}>
            <p className="text-sm text-white/70">Total Expense</p>
            <p className="text-xl font-bold">{data?.total_expense}</p>
          </div>

          <div className={glassCard}>
            <p className="text-sm text-white/70">Recommended Spending</p>
            <p className="text-xl font-bold">{data?.recommended_spending}</p>
          </div>

          <div className={glassCard}>
            <p className="text-sm text-white/70">Remaining Balance</p>
            <p className="text-xl font-bold">{data?.remaining_balance}</p>
          </div>
        </div>

        {/* Analysis Cards */}
        <div className={glassCard}>
          <h2 className="text-lg font-semibold">Income Analysis</h2>
        </div>

        <div className={glassCard}>
          <h2 className="text-lg font-semibold">Expense Analysis</h2>
        </div>

        <div className={glassCard}>
          <h2 className="text-lg font-semibold mb-4">Budget Analysis</h2>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
