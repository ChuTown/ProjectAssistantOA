import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Header from './components/Header';

// Layout component that includes Header and renders child routes
const Layout = ({ isLoggedIn, onLogout, username }) => {
    return (
        <div className="app">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <main>
                <Outlet context={{ isLoggedIn, onLogout, username }} />
            </main>
        </div>
    );
};

export const AppRoutes = ({ isLoggedIn, onLogout, onLogin, username }) => {
    // Update the router to use the current props
    const currentRouter = createBrowserRouter([
        {
            path: "/",
            element: <Layout isLoggedIn={isLoggedIn} onLogout={onLogout} username={username} />,
            children: [
                {
                    index: true,
                    element: <HomePage isLoggedIn={isLoggedIn} onLogout={onLogout} username={username} />,
                },
                {
                    path: "signin",
                    element: <SignInPage onLogin={onLogin} />,
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