import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes/router';
import { ThemeProvider } from '@theme/ThemeProvider';
import { QueryProvider } from '@providers/QueryProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
