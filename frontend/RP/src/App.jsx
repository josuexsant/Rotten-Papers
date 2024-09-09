import { SignIn, Landing } from './pages/';
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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
