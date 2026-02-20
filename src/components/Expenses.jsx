import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const glassCard =
  "backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 transition hover:bg-white/20 text-white";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/expense/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 text-white">
        Loading expense statements...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-6 py-18 md:px-20 md:py-20">

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Expense Statements
        </h1>

        <button
          onClick={() => navigate("/expense")}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-lg transition"
        >
          + Add Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className={glassCard}>
          No expense records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expenses.map((expense) => (
            <div key={expense.id} className={glassCard}>
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-white/70">
                    {expense.category}
                  </p>
                  <p className="text-2xl font-bold text-red-400 mt-1">
                    Rs. {expense.amount}
                  </p>
                </div>

                {expense.is_recurring && (
                  <span className="text-xs bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full">
                    Recurring
                  </span>
                )}
              </div>

              {expense.description && (
                <p className="text-sm text-white/60 mt-4">
                  {expense.description}
                </p>
              )}

              <div className="mt-4 text-right text-sm text-white/70">
                {expense.date}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;