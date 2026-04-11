import { createBrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ProductsPage } from '../features/products/ProductsPage';
import { MembershipsPage } from '../features/memberships/MembershipsPage';

export const router = createBrowserRouter([
  { path: '/', element: <DashboardPage /> },
  { path: '/products', element: <ProductsPage /> },
  { path: '/memberships', element: <MembershipsPage /> },
]);
