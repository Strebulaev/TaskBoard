import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@hooks/useUser';

function App() {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
}

export default App;
