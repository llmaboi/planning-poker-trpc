import { useNavigate } from '@tanstack/react-router';
import { h } from 'preact';

function NoPathFound() {
  const navigate = useNavigate({ from: '/*' });

  function returnHome() {
    void navigate({ to: '/' });
  }

  return (
    <div>
      No path found... <button onClick={returnHome}>To Login</button>
    </div>
  );
}

export default NoPathFound;
