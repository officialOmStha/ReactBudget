import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { Routes, Route } from "react-router-dom";
import AddInc from "./components/AddInc";
import AddExp from "./components/AddExp";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
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
    </Routes>
  );
}

export default App;
