// frontend-isekai/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importa tus componentes de página
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Registro from './pages/Registro';
import Dashboard from './components/Dashboard';
import AdminPage from './pages/AdminPage';
import Home from './pages/Home';

// *** NUEVOS COMPONENTES DE PÁGINA PARA DESAFÍOS Y ACTIVIDADES (si aún existen, si no, se irán con la refactorización) ***
// import CrearDesafio from './pages/CrearDesafio';
// import CrearActividad from './pages/CrearActividad';

import './App.css';

// Componente para manejar la lógica de rutas protegidas y roles
// NOTA: Esta definición de PrivateRoute ya estaba en tu archivo.
// No la dupliques. La he dejado aquí para referencia, pero si ya está definida
// más arriba en tu archivo o en un archivo separado como './components/PrivateRoute',
// entonces quita esta segunda definición.
// Asumo que tu import 'PrivateRoute from './components/PrivateRoute'' es la correcta.

const PrivateRoute = ({ children, allowedRoles }) => {

  const token = localStorage.getItem('token');
  const usuarioGuardado = localStorage.getItem('usuario');
  let usuario = null;

  // Solo intentar parsear si el valor es válido y no es el string 'undefined'
  if (usuarioGuardado && usuarioGuardado !== 'undefined') {
    try {
      usuario = JSON.parse(usuarioGuardado);
    } catch (e) {
      console.error("Error al parsear usuario de localStorage:", e);
      // Si hay un error al parsear, trata como si no hubiera usuario válido
      localStorage.clear();
      return <Navigate to="/iniciar-sesion" replace />;
    }
  }

  // Si no hay token o usuario, redirigir al login
  if (!token || !usuario) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  // Si se especifican roles permitidos y el rol del usuario no está en ellos, redirigir al dashboard
  if (allowedRoles && !allowedRoles.includes(usuario.rol)) {
    console.log(`Acceso denegado. Rol ${usuario.rol} no está en los roles permitidos: ${allowedRoles.join(', ')}`);
    return <Navigate to="/dashboard" replace />; // O a una página de "Acceso Denegado"
  }

  // Si todo está bien, renderiza los componentes hijos
  return children;
};


// La definición de PrivateRoute que ya estaba importada debe ser la que uses
// Si el archivo PrivateRoute.jsx existe en components, entonces la línea de abajo es la que usas.



function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          {/* Rutas de autenticación (Públicas) */}
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Ruta Raíz: Landing page pública solo si NO hay sesión */}
          <Route
            path="/"
            element={
              localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Home />
            }
          />

          {/* Rutas Protegidas que requieren solo un token válido */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/terapias"
            element={
              <PrivateRoute>
                <ListaTerapias />
              </PrivateRoute>
            }
          /> */}
          {/* Aquí podrías añadir rutas como /mis-terapias, /explorar-logros para pacientes */}


          {/* Rutas Protegidas POR ROL (Solo para Administradores y/o Terapeutas) */}
          {/* <Route
            path="/terapias/crear"
            element={
              <PrivateRoute allowedRoles={['administrador', 'terapeuta']}>
                <CrearTerapia />
              </PrivateRoute>
            }
          /> */}

          {/*
          <Route
            path="/logros/crear"
            element={
              <PrivateRoute allowedRoles={['administrador', 'terapeuta']}>
                <CrearLogro />
              </PrivateRoute>
            }
          />
          <Route
            path="/logros"
            element={
              <PrivateRoute allowedRoles={['administrador', 'terapeuta']}>
                <ListaLogros />
              </PrivateRoute>
            }
          />
          */}


          {/*
          <Route
            path="/desafios/crear"
            element={
              <PrivateRoute allowedRoles={['administrador', 'terapeuta']}>
                <CrearDesafio />
              </PrivateRoute>
            }
          />
          <Route
            path="/actividades/crear"
            element={
              <PrivateRoute allowedRoles={['administrador', 'terapeuta']}>
                <CrearActividad />
              </PrivateRoute>
            }
          />
          */}

          {/* --- ¡NUEVA RUTA PARA ADMINPAGE CON CRUD MANAGER! --- */}
          <Route
            path="/admin" // Ruta para el panel de administración
            element={
              <PrivateRoute allowedRoles={['administrador', 'terapeuta']}>
                <AdminPage />
              </PrivateRoute>
            }
          />

          {/* Opcional: Ruta para manejar rutas no encontradas (404) */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>404 - Página No Encontrada</h2>
              <p>Lo sentimos, la página que buscas no existe.</p>
              <button onClick={() => window.location.href = '/dashboard'}>Volver al Dashboard</button>
            </div>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;