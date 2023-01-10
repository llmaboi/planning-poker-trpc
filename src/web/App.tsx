import { RouterProvider } from '@tanstack/react-router';
import './App.css';
import reactLogo from './assets/react.svg';
import { Wrapper } from './src/comopnents/common/Wrapper';
import { router } from './utils/router';
import { trpc } from './utils/trpc';

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
  return (
    <Wrapper>
      <RouterProvider router={router} />
    </Wrapper>
  );
}

export default App;
