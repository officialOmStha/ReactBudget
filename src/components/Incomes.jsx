import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";

const glassCard =
  "backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 transition hover:bg-white/20 text-white";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/income/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setIncomes(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?"))
      return;

    try {
      await fetch(`http://127.0.0.1:8000/api/income/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncomes(incomes.filter((income) => income.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // 🟡 START EDIT
  const handleEditClick = (income) => {
    setEditingId(income.id);
    setEditAmount(income.amount);
  };

  // 🟢 SAVE EDIT
  const handleSave = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/income/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: editAmount,
        }),
      });

      setEditingId(null);
      fetchIncomes(); // refresh list
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 text-white">
        Loading income statements...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-6 py-18 md:px-20 md:py-20">
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

                  {editingId === income.id ? (
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="mt-2 p-2 rounded text-black"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-green-400 mt-1">
                      Rs. {income.amount}
                    </p>
                  )}
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

              <div className="mt-4 flex justify-between items-center text-sm text-white/70">
                <span>{income.date}</span>

                <div className="space-x-3">
                  {editingId === income.id ? (
                    <button
                      onClick={() => handleSave(income.id)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <FaSave />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(income)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FaEdit />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(income.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <MdAutoDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Income;