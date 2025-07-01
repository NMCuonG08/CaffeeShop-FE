// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import ProductList from '@/pages/product/ProductListPage';
import NotFound from '@/pages/NotFound';

import AuthCallback from '@/features/auth/components/AuthCallback';
import MainLayout from '@/layouts/MainLayout';
import AuthSignUpPage from '@/pages/auth/AuthSignUpPage';
import AuthLogInPage from '@/pages/auth/AuthLogInPage';
import AdminLayout from '@/layouts/AdminLayout';
import ListProductPage from '@/pages/admin/ListProductPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
import { ProductDetailPage } from '@/pages/product/ProductDetailPage';
import OrderSuccessPage from '@/pages/checkout/OrderSuccesspage';
import OrderFailedPage from '@/pages/checkout/OrderFailedPage';
import VNPayCallbackPage from '@/pages/checkout/VNPayCallbackPage';
import OrdersPage from '@/pages/OrdersPage';
import ProfilePage from '@/pages/ProfilePage';

import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
// import Login from '../pages/Login';
// import ProductDetail from '../pages/ProductDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/checkout',
    element: <MainLayout />,
    children: [
      { index: true, element: <CheckoutPage /> },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/order-success',
    element: <MainLayout />,
    children: [
      { index: true, element: <OrderSuccessPage /> },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/auth',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <AuthLogInPage /> },
      { path: 'signup', element: <AuthSignUpPage /> },
      { path: 'callback', element: <AuthCallback /> },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/products',
    element: <MainLayout />,
    children: [
      { index: true, element: <ProductList /> },
      { path: ':productId', element: <ProductDetailPage /> },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/admin',
    // element: <AdminRoute />,
    children: [
      {
        path: '',
        element: <AdminLayout />, 
        children: [
          // { index: true, element: <ListProductPage /> },
           { path: 'products', element: <ListProductPage /> },
           { path: 'analytics', element: <AnalyticsPage /> },
        ],
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: '/payment',
    element: <MainLayout />,
    children: [
      { path: 'success', element: <OrderSuccessPage/> },
      { path: 'failed', element: <OrderFailedPage /> },
      { path: 'vnpay-callback', element: <VNPayCallbackPage /> },
    ],
    errorElement: <NotFound />,
  },
])


export default router;
