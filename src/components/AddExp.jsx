import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const glassCard =
  "backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-6 text-white";

const AddExp = () => {
  const [formData, setFormData] = useState({
    amount: "",
    exp_category: "",
    description: "",
    date: "",
    is_recurring: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const accessToken = localStorage.getItem("access");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/expense/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage(data.message || "Expense added successfully ✅");

      // Reset form
      setFormData({
        amount: "",
        exp_category: "",
        description: "",
        date: "",
        is_recurring: false,
      });

      // ✅ Navigate after success
      setTimeout(() => {
        navigate("/expensestat");
      }, 800); // small delay so user sees success message

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 md:py-20">
      <div className={`${glassCard} w-full max-w-md`}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Expense
        </h2>

        {message && <div className="mb-4 text-green-400 text-sm">{message}</div>}
        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Category</label>
            <input
              type="text"
              name="exp_category"
              value={formData.exp_category}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_recurring"
              checked={formData.is_recurring}
              onChange={handleChange}
            />
            <label className="text-sm text-white/70">Recurring Expense</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 transition p-2 rounded-lg font-semibold"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExp;