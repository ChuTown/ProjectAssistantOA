import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import SignedInPage from './pages/SignedInPage';
import SignUpPage from './pages/SignUpPage';
import Header from './components/Header';

// Layout component that includes Header and renders child routes
const Layout = ({ isLoggedIn, onLogout }) => {
    return (
        <div className="app">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <main>
                <Outlet context={{ isLoggedIn, onLogout }} />
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

export const AppRoutes = ({ isLoggedIn, onLogout, onLogin }) => {
    // Update the router to use the current props
    const currentRouter = createBrowserRouter([
        {
            path: "/",
            element: <Layout isLoggedIn={isLoggedIn} onLogout={onLogout} />,
            children: [
                {
                    index: true,
                    element: <HomePage isLoggedIn={isLoggedIn} />,
                },
                {
                    path: "signin",
                    element: <SignedInPage onLogin={onLogin} />,
                },
                {
                    path: "signup",
                    element: <SignUpPage onLogin={onLogin} />,
                },
                {
                    path: "*",
                    element: <NotFoundPage />,
                },
            ],
        },
    ]);

    return <RouterProvider router={currentRouter} />;
};