import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { router } from './utils/router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// const rootElement = document.getElementById('app')!;
// if (!rootElement.innerHTML) {
//   const root = ReactDOM.createRoot(rootElement);
//   root.render(
//     <StrictMode>
//         <App />
//     </StrictMode>
//   );
// }

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router;
  }
}
