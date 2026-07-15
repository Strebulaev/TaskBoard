import { useState } from 'react';
import Button from '@mui/material/Button';
import styles from './App.module.scss';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className={styles.container}>
      <h1>TaskBoard</h1>
      <a>Count: {count}</a>
      <Button onClick={() => setCount(count+1)}>click</Button>
    </div>
  );
}
export default App;