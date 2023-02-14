// import Header from '../components/Header';
import { Outlet } from '@tanstack/react-router';
import Header from '../comopnents/Header';
import './Auth.layout.css';

function AuthLayout() {
  return (
    <>
      <Header />
      <section className="auth-body">
        <Outlet />
      </section>
    </>
  );
}

export default AuthLayout;
