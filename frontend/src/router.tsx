import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import VisualizerPage from './pages/VisualizerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'visualize/:slug',
        element: <VisualizerPage />,
      },
    ],
  },
]);
