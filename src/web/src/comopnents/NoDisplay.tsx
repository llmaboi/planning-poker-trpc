import { useNavigate } from '@tanstack/react-router';

function NoDisplay() {
  const navigate = useNavigate({ from: '/noDisplay' });

  function returnHome() {
    void navigate({ to: '/' });
  }

  return (
    <div>
      You are not authorized <button onClick={returnHome}>To Login</button>
    </div>
  );
}

export default NoDisplay;
