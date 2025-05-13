import {
  SignIn,
  Landing,
  Test,
  Access,
  Favorites,
  Login,
  Reviews,
  EditProfile,
  Payment,
  ShoppingCart,
  Purchase,
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
  {
    path: '/Payment',
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
      ),
   },
  {
    path: '/shoppingCart',
    element: (
      <ProtectedRoute>
        <ShoppingCart />
      </ProtectedRoute>
    ),
  },
  {
    path: '/confirmation',
    element: (
      <ProtectedRoute>
        <Purchase />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
