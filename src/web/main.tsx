import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('root')!;

if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
