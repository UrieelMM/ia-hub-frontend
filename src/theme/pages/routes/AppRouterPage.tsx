import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from '..';
import { menuRoutes } from '../../../routes/router';
import Layout from '../../layout/Layout';


export const AppRouterPage = () => {
  const isUserAuthenticated = () => {
    // Lógica para determinar si el usuario está autenticado
    return true;
  }

  return (
    <Router>
    <Routes>
      {/* Página de inicio de sesión */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas por autenticación */}
      {isUserAuthenticated() && (
        <Route path="/" element={<Layout />}>
          {/* Rutas específicas dentro del Layout */}
          {...menuRoutes.map((route) => (
            <Route key={route.to} path={route.to} element={route.component} />
          ))}
          <Route index element={<Navigate to={menuRoutes[0].to} />} />
        </Route>
      )}

      {/* Redirige a la página de inicio de sesión si el usuario no está autenticado */}
      {!isUserAuthenticated() && <Navigate to="/login" />}
    </Routes>
  </Router>
  );
}
