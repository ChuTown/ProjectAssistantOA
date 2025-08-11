import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import SignedInPage from './pages/SignedInPage';
import SignUpPage from './pages/SignUpPage';
import Header from './components/Header';

// Layout component that includes Header and renders child routes
const Layout = () => {
    return (
        <div className="app">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "signin",
                element: <SignedInPage />,
            },
            {
                path: "signup",
                element: <SignUpPage />,
            },
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};