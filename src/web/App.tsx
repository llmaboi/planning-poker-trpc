import { RouterProvider } from '@tanstack/react-router';
import './App.css';
import { Wrapper } from './src/comopnents/common/Wrapper';
import { router } from './utils/router';

function App() {
  return (
    <Wrapper>
      <RouterProvider router={router} />
    </Wrapper>
  );
}

export default App;
