import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const glassCard =
  "backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 transition hover:bg-white/20 text-white";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/income/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch incomes");
        }

        const data = await response.json();
        setIncomes(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 text-white">
        Loading income statements...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-6 py-18 md:px-20 md:py-20">

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Income Statements
        </h1>

        <button
          onClick={() => navigate("/income")}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl shadow-lg transition"
        >
          + Add Income
        </button>
      </div>

      {incomes.length === 0 ? (
        <div className={glassCard}>
          No income records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {incomes.map((income) => (
            <div key={income.id} className={glassCard}>
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/70">
                    {income.category}
                  </p>
                  <p className="text-2xl font-bold text-green-400 mt-1">
                    Rs. {income.amount}
                  </p>
                </div>

                {income.is_recurring && (
                  <span className="text-xs bg-green-400/20 text-green-300 px-3 py-1 rounded-full">
                    Recurring
                  </span>
                )}
              </div>

              {income.description && (
                <p className="text-sm text-white/60 mt-4">
                  {income.description}
                </p>
              )}

              <div className="mt-4 text-right text-sm text-white/70">
                {income.date}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Income;