import {
  createReactRouter,
  createRouteConfig,
  Outlet,
} from '@tanstack/react-router';
import DisplayLogin from '../src/comopnents/DisplayLogin';
import NoDisplay from '../src/comopnents/NoDisplay';
import NoPathFound from '../src/comopnents/NoPathFound';
import Room from '../src/comopnents/Room';
import RoomLogin from '../src/comopnents/RoomLogin';
import AuthLayout from '../src/layouts/Auth.layout';
import { trpc } from './trpc';

// TODO: Actual main file, remove above later.
const rootRoute = createRouteConfig({
  // component: () => (
  //   <>
  //     <div>Welcome PLEASE STYLE / REMOVE</div>
  //     <hr />
  //     <Outlet />
  //   </>
  // ),
});

const displayConnectRoute = rootRoute.createRoute({
  path: '/$roomId',
  component: DisplayLogin,
  parseParams: (params) => {
    return { roomId: parseInt(params.roomId) };
  },
  stringifyParams: ({ roomId }) => {
    return { roomId: roomId.toString() };
  },
});

const noDisplayRoute = rootRoute.createRoute({
  path: '/',
  // component: Index,
  component: RoomLogin,
});
// .addChildren([displayConnectRoute]);

const roomRoute = rootRoute.createRoute({
  path: '/room/$roomId/$displayId',
  component: Room,
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

// TODO: I'm not sure how to use a "wrapper" for all the
//   `/room/` routes.
const authRoute = rootRoute
  .createRoute({
    id: 'RoomLayout',
    component: AuthLayout,
  })
  .addChildren([roomRoute]);

const invalidDisplay = rootRoute.createRoute({
  path: '/noDisplay',
  component: NoDisplay,
});

const catchAll = rootRoute.createRoute({
  path: '*',
  component: NoPathFound,
});

const routeConfig = rootRoute.addChildren([
  authRoute,
  noDisplayRoute,
  displayConnectRoute,
  invalidDisplay,
  catchAll,
]);

export const router = createReactRouter({ routeConfig });
