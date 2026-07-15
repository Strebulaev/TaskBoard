import { useState } from 'react';
import Button from '@mui/material/Button';

export default function Landing() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Home</h1>
      <a>Count: {count}</a>
      <Button onClick={() => setCount(count + 1)}>click</Button>
    </div>
  );
}
