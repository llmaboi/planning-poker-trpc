// import { websocketRoomDisplays } from '../api/mysqlFastify';
import { useParams } from '@tanstack/react-router';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Display } from '../../../server/models/Display';
import { trpc } from '../../utils/trpc';

interface RoomDisplays {
  // label: string | null;
  displays: Display[];
}

const RoomDisplaysContext = createContext<
  { roomDisplays: RoomDisplays } | undefined
>(undefined);

function RoomDisplaysProvider({ children }: { children: ReactNode }) {
  const { roomId } = useParams({ from: '/$roomId' });
  const { data } = trpc.displays.listByRoom.useQuery({
    id: roomId.toString(),
  });
  const [displays, setDisplays] = useState<Display[]>([]);

  // const [roomLabel, setRoomLabel] = useState<string | null>(null);

  let unSubDisplays: WebSocket | undefined;

  // TODO: how to do this close session properly?
  // useEffect(() => {
  //   return () => {
  //     unSubDisplays && unSubDisplays.close();
  //   };
  // }, [unSubDisplays]);

  useEffect(() => {
    if (roomId) {
      // Set displays once per room id...
      data && setDisplays(data);
      // const { websocket } = websocketRoomDisplays(roomId, setDisplays);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // unSubDisplays = websocket;
    }
  }, [data, roomId]);

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value: { roomDisplays: RoomDisplays } = {
    roomDisplays: { displays: displays },
  };

  return (
    <RoomDisplaysContext.Provider value={value}>
      {children}
    </RoomDisplaysContext.Provider>
  );
}

function useRoomDisplays() {
  const context = useContext(RoomDisplaysContext);
  if (context === undefined) {
    throw new Error(
      'useRoomDisplays must be used within a RoomDisplaysProvider'
    );
  }
  return context;
}

export { useRoomDisplays, RoomDisplaysProvider };
