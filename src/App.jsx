import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import AddInc from "./components/AddInc";
import AddExp from "./components/AddExp";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import Income from "./components/Incomes";
import Expenses from "./components/Expenses";

function App() {
  return (
    <>
    <NavBar />
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/incomestat"
        element={
          <PrivateRoute>
            <Income />
          </PrivateRoute>
        }
      />
      <Route
        path="/income"
        element={
          <PrivateRoute>
            <AddInc />
          </PrivateRoute>
        }
      />
      <Route
        path="/expense"
        element={
          <PrivateRoute>
            <AddExp />
          </PrivateRoute>
        }
      />
      <Route
        path="/expensestat"
        element={
          <PrivateRoute>
            <Expenses />
          </PrivateRoute>
        }
      />
    </Routes>
    </>
  );
}

export default App;
