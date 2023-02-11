import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, splitLink, TRPCWebSocketClient, wsLink } from '@trpc/client';
import { ReactNode, useState } from 'react';
import superjson from 'superjson';
import { trpc } from '../../../utils/trpc';

let websocket: TRPCWebSocketClient;

function connectWebsocket(urlBase: string) {
  const combinedUrl = import.meta.env.DEV ? `ws://localhost:3030/trpc` : `wss://${urlBase}`;
  if (!websocket) {
    websocket = createWSClient({ url: combinedUrl });
  }

  return { wsClient: websocket };
}

export function Wrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const apiPrefix = import.meta.env.VITE_API_PREFIX;

  // If Dev use VITE Url & port...
  let apiUrl = import.meta.env.VITE_API_URL + apiPrefix;
  if (import.meta.env.DEV) {
    apiUrl = 'localhost:5173/trpc';
  }

  const { wsClient } = connectWebsocket(apiUrl);
  const combinedUrl = import.meta.env.DEV ? `http://${apiUrl}` : `https://${apiUrl}`;

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
            url: combinedUrl,
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
