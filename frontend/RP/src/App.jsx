import { SignIn, Landing, Test, Access, Login } from './pages/';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

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
    path: '/test',
    element: <Test />,
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
