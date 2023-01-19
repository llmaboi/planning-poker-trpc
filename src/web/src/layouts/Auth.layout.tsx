// import Header from '../components/Header';
import { Outlet } from '@tanstack/react-router';
import Header from '../comopnents/Header';
import { RoomDisplaysProvider } from '../providers/roomDisplays.provider';
import './Auth.layout.css';

function AuthLayout() {
  return (
    <RoomDisplaysProvider>
      <Header />
      <section className="auth-body">
        <Outlet />
      </section>
    </RoomDisplaysProvider>
  );
}

export default AuthLayout;
