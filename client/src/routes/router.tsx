import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@layouts/RootLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import Landing from '@pages/Landing/Landing';
import Login from '@pages/Login/Login';
import Registration from '@pages/Registration/Registration';
import Dashboard from '@pages/Dashboard/Dashboard';
import TasksList from '@pages/Tasks/TasksList';
import Projects from '@pages/Projects/Projects';
import ProjectPage from '@pages/Projects/ProjectPage';
import TaskPage from '@pages/Tasks/TaskPage';
import ProfilePage from '@pages/Profile/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      {
        element: <PublicRoute />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'registration', element: <Registration /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'tasks-list', element: <TasksList /> },
          { path: 'projects', element: <Projects /> },
          { path: 'project-:id', element: <ProjectPage /> },
          { path: 'task-:id', element: <TaskPage /> },
          { path: 'profile-:id', element: <ProfilePage /> },
        ],
      },
      { path: '*', element: <h1>404. Page Not Found</h1> },
    ],
  },
]);
