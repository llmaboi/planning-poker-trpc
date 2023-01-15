import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createWSClient,
  httpBatchLink,
  splitLink,
  TRPCWebSocketClient,
  wsLink,
} from '@trpc/client';
import { ReactNode, useState } from 'react';
import superjson from 'superjson';
import { serverConfig } from '../../../config';
import { trpc } from '../../../utils/trpc';

let websocket: TRPCWebSocketClient;

function connectWebsocket(urlEnd: string) {
  if (!websocket) {
    websocket = createWSClient({ url: `ws://${urlEnd}` });
  }

  return { wsClient: websocket };
}

export function Wrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const { port, prefix } = serverConfig;
  const urlEnd = `localhost:${port}${prefix}`;
  console.log('urlEnd: ', urlEnd);
  console.log(`http://${urlEnd}`);

  const { wsClient } = connectWebsocket(urlEnd);

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
            url: `http://localhost:3000/trpc`,
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
