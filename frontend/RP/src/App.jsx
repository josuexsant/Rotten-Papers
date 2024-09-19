import { SignIn, Landing, Test } from './pages/';
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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
