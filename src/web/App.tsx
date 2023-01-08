import { ReactNode, useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './utils/trpc';
import { httpBatchLink, splitLink, wsLink, createWSClient } from '@trpc/client';
import superjson from 'superjson';
import { serverConfig } from './config';

let websocket: any;

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
          false: httpBatchLink({ url: `http://localhost:3000/trpc` }),
          // true: httpBatchLink({ url: `http://localhost:3000/trpc` }),
          // false: httpBatchLink({ url: `http://${urlEnd}` }),
        }),
        // httpBatchLink({
        //   url: 'http://localhost:3030/trpc',
        // optional
        // headers() {
        //   return {
        //     authorization: getAuthCookie(),
        //   };
        // },
        // }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

function AppTwo() {
  console.log('render');
  const mutate = trpc.sub.bump.useMutation();

  let randomNumberCount = 0;
  trpc.sub.randomNumber.useSubscription(undefined, {
    //
    onData(data) {
      console.log('>>> anon:sub:randomNumber:received:', data);
      randomNumberCount++;

      // if (randomNumberCount > 3) {
      //   sub.unsubscribe();
      // }
    },
    onError(error) {
      console.error('>>> anon:sub:randomNumber:error:', error);
    },

    // onComplete() {
    //   console.log('>>> anon:sub:randomNumber:', 'unsub() called');
    // },
  });

  // async function test() {

  const version = trpc.api.version.useQuery();
  console.log('>>> anon:version:', version.data);

  const hello = trpc.api.hello.useQuery();
  console.log('>>> anon:hello:', hello.data);

  const postList = trpc.rooms.list.useQuery();
  console.log('>>> anon:rooms:list:', postList.data);
  // }

  function handleClick() {
    mutate.mutate();
  }

  // useEffect(() => {
  //   void test();
  // }, []);
  return (
    <div>
      Helper <button onClick={handleClick}>btn</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='App'>
      {/* <Wrapper> */}
      <AppTwo />
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          <img src='/vite.svg' className='logo' alt='Vite logo' />
        </a>
        <a href='https://reactjs.org' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
      {/* </Wrapper> */}
    </div>
  );
}

export default App;
