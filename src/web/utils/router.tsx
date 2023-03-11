import { Outlet, ReactRouter, RootRoute, Route } from '@tanstack/react-router';
import DisplayLogin from '../src/comopnents/DisplayLogin';
import NoDisplay from '../src/comopnents/NoDisplay';
import NoPathFound from '../src/comopnents/NoPathFound';
import Room from '../src/comopnents/Room';
import RoomLogin from '../src/comopnents/RoomLogin';
import AuthLayout from '../src/layouts/Auth.layout';
import { RoomDisplaysProvider } from '../src/providers/roomDisplays.provider';
import { h } from 'preact';

const rootRoute = new RootRoute({
  component: Outlet,
});

const noDisplayRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RoomLogin,
});

const roomSubRoute = new Route({
  id: 'RoomSubscription',
  component: () => (
    <RoomDisplaysProvider>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Outlet />
    </RoomDisplaysProvider>
  ),
  getParentRoute: () => rootRoute,
});

const verifiedLayoutRoute = new Route({
  id: 'RoomLayout',
  // TODO: I'm not sure why I need to repeat this provider...
  component: () => (
    <RoomDisplaysProvider>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <AuthLayout />
    </RoomDisplaysProvider>
  ),
  getParentRoute: () => roomSubRoute,
});

export const displayLoginRoute = new Route({
  getParentRoute: () => roomSubRoute,
  path: 'room/$roomId',
  // parseParams: (params) => {
  //   return { roomId: params.roomId };
  // },
  // stringifyParams: ({ roomId }) => {
  //   return { roomId: roomId };
  // },
  component: DisplayLogin,
});

export const roomRoute = new Route({
  getParentRoute: () => verifiedLayoutRoute,
  path: 'room/$roomId/$displayId',
  component: Room,
  // parseParams: (params) => {
  //   return {
  //     roomId: params.roomId,
  //     displayId: params.displayId,
  //   };
  // },
  // stringifyParams: ({ roomId, displayId }) => {
  //   return {
  //     roomId: roomId,
  //     displayId: displayId,
  //   };
  // },
});

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
  // displayLoginRoute,
  roomSubRoute.addChildren([displayLoginRoute, verifiedLayoutRoute.addChildren([roomRoute])]),
  // verifiedLayoutRoute,
  invalidDisplay,
  catchAll,
]);

export const router = new ReactRouter({
  routeTree: routeConfig,
});

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
