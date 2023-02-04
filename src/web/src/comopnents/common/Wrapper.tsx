import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, splitLink, TRPCWebSocketClient, wsLink } from '@trpc/client';
import { ReactNode, useState } from 'react';
import superjson from 'superjson';
import { trpc } from '../../../utils/trpc';

let websocket: TRPCWebSocketClient;

function connectWebsocket(urlEnd: string) {
  if (!websocket) {
    websocket = createWSClient({ url: `wss://${urlEnd}` });
  }

  return { wsClient: websocket };
}

export function Wrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // const baseUrl = import.meta.env.VITE_API_HOST;
  // const apiPort = import.meta.env.VITE_API_PORT;
  const apiPrefix = import.meta.env.VITE_API_PREFIX;
  // const apiUrl = import.meta.env.VITE_API_URL + apiPrefix;
  const apiUrl = 'planning-poker-api-n0pe.onrender.com' + apiPrefix;

  // const socketUrl = `${baseUrl}${apiPrefix}`;
  // const socketUrl = `${baseUrl}:${apiPort}${apiPrefix}`;
  const { wsClient } = connectWebsocket(apiUrl);

  // const appPort = import.meta.env.VITE_APP_PORT;
  // const apiUrl = `https://${baseUrl}${apiPrefix}`; //:${appPort}${apiPrefix}`;
  // const apiUrl = `https://${baseUrl}:${appPort}${apiPrefix}`;

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },
          true: wsLink({ client: wsClient }),
          false: httpBatchLink({
            url: 'https://' + apiUrl,
            // optional
            // headers() {
            //   return {
            //     authorization: getAuthCookie(),
            //   };
            // },
          }),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
