import { SignIn, Landing, Test, Access, Login } from './pages/';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
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
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
