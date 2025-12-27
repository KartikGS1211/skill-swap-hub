import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';

// Pages
import HomePage from '@/components/pages/HomePage';
import UsersPage from '@/components/pages/UsersPage';
import UserDetailPage from '@/components/pages/UserDetailPage';
import SkillsPage from '@/components/pages/SkillsPage';
import SkillDetailPage from '@/components/pages/SkillDetailPage';
import MatchesPage from '@/components/pages/MatchesPage';
import MatchDetailPage from '@/components/pages/MatchDetailPage';
import LocationsPage from '@/components/pages/LocationsPage';
import ContactPage from '@/components/pages/ContactPage';
import ProfilePage from '@/components/pages/ProfilePage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />, // MIXED ROUTE: Shows different content for authenticated vs anonymous users
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/:id",
        element: <UserDetailPage />,
      },
      {
        path: "skills",
        element: <SkillsPage />,
      },
      {
        path: "skills/:id",
        element: <SkillDetailPage />,
      },
      {
        path: "matches",
        element: <MatchesPage />,
      },
      {
        path: "matches/:id",
        element: <MatchDetailPage />,
      },
      {
        path: "locations",
        element: <LocationsPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
            <ProfilePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
