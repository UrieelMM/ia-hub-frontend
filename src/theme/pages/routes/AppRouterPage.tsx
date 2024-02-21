import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "..";
import { menuRoutes } from "../../../routes/router";
import Layout from "../../layout/Layout";

export const AppRouterPage = () => {

  return (
    <Router>
    <Routes>
      {/* Página de inicio de sesión */}
      <Route path="/login" element={<LoginPage />} />
  
      {/* Rutas dentro del Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        {menuRoutes.map((route) => (
          <Route
            key={route.to}
            path={route.to}
            element={route.component}
          />
        ))}
        <Route index element={<Navigate to={menuRoutes[0].to} />} />
      </Route>
    </Routes>
  </Router>
  );
};
