import { Outlet, ReactRouter, RootRoute, Route } from '@tanstack/react-router';
import DisplayLogin from '../src/comopnents/DisplayLogin';
import NoDisplay from '../src/comopnents/NoDisplay';
import NoPathFound from '../src/comopnents/NoPathFound';
import Room from '../src/comopnents/Room';
import RoomLogin from '../src/comopnents/RoomLogin';
import AuthLayout from '../src/layouts/Auth.layout';

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

const noDisplayRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RoomLogin,
});

const verifiedLayoutRoute = new Route({
  id: 'RoomLayout',
  component: AuthLayout,
  getParentRoute: () => rootRoute,
});

export const displayLoginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'room/$roomId',
  parseParams: (params) => {
    return { roomId: parseInt(params.roomId) };
  },
  stringifyParams: ({ roomId }) => {
    return { roomId: roomId.toString() };
  },
  component: DisplayLogin,
});

export const roomRoute = new Route({
  getParentRoute: () => verifiedLayoutRoute,
  path: 'room/$roomId/$displayId',
  component: () => <Room />,
  parseParams: (params) => {
    return {
      roomId: parseInt(params.roomId),
      displayId: parseInt(params.displayId),
    };
  },
  stringifyParams: ({ roomId, displayId }) => {
    return {
      roomId: roomId.toString(),
      displayId: displayId.toString(),
    };
  },
});

verifiedLayoutRoute.addChildren([roomRoute]);

const invalidDisplay = new Route({
  getParentRoute: () => rootRoute,
  path: 'noDisplay',
  component: NoDisplay,
});

const catchAll = new Route({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NoPathFound,
});

const routeConfig = rootRoute.addChildren([
  noDisplayRoute,
  displayLoginRoute,
  verifiedLayoutRoute,
  invalidDisplay,
  catchAll,
]);

console.log('routeConfig: ', routeConfig);

export const router = new ReactRouter({
  routeTree: routeConfig,
});

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router;
  }
}
