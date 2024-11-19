import {
  SignIn,
  Landing,
  Test,
  Access,
  Favorites,
  Login,
  Reviews,
  EditProfile,
} from './pages/';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './helpers/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/test', //Ruta protegida
    element: (
      <ProtectedRoute>
        <Test />
      </ProtectedRoute>
    ),
  },
  {
    path: '/access',
    element: <Access />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/favorites',
    element: (
      <ProtectedRoute>
        <Favorites />,
      </ProtectedRoute>
    ),
  },
  {
    path: '/reviews/:id',
    element: <Reviews />,
  },
  {
    path: '/editProfile',
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
