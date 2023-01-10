import { useNavigate } from '@tanstack/react-router';

function NoPathFound() {
  const navigate = useNavigate({ from: '/*' });

  function returnHome() {
    navigate({ to: '/' });
  }

  return (
    <div>
      No path found... <button onClick={returnHome}>To Login</button>
    </div>
  );
}

export default NoPathFound;
