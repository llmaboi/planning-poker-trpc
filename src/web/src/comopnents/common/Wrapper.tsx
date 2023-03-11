import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, httpBatchLink, splitLink, TRPCWebSocketClient, wsLink } from '@trpc/client';
import { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import superjson from 'superjson';
import { trpc } from '../../../utils/trpc';
import { h } from 'preact';

let websocket: TRPCWebSocketClient;

function connectWebsocket(urlBase: string) {
  const combinedUrl = import.meta.env.DEV ? `ws://127.0.0.1:3030/trpc` : `wss://${urlBase}`;
  console.log(`Connecting to ${combinedUrl}`);
  if (!websocket) {
    websocket = createWSClient({ url: combinedUrl });
  }

  return { wsClient: websocket };
}

export function Wrapper({ children }: { children: ComponentChildren }) {
  const [queryClient] = useState(() => new QueryClient());

  const apiPrefix = import.meta.env.VITE_API_PREFIX;

  // If Dev use VITE Url & port...
  let apiUrl = import.meta.env.VITE_API_URL + apiPrefix;
  if (import.meta.env.DEV) {
    apiUrl = 'localhost:5173/trpc';
  }

  const { wsClient } = connectWebsocket(import.meta.env.VITE_API_URL + apiPrefix);

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
