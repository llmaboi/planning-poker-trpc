import { RouterProvider } from '@tanstack/react-router';
import './App.scss';
import { Wrapper } from './src/comopnents/common/Wrapper';
import { router } from './utils/router';

function App() {
  return (
    <section className="Wrapper">
      <Wrapper>
        <RouterProvider router={router} />
      </Wrapper>
    </section>
  );
}

export default App;
