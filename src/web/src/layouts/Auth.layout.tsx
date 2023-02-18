// import Header from '../components/Header';
import { Outlet } from '@tanstack/react-router';
import Header from '../comopnents/Header';
import './Auth.layout.scss';

function AuthLayout() {
  return (
    <section className="AuthLayout">
      <Header />
      <Outlet />
    </section>
  );
}

export default AuthLayout;
