// import { websocketRoomDisplays } from '../api/mysqlFastify';
import { useParams } from '@tanstack/react-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Display } from '../../../server/models/Display';
import { trpc } from '../../utils/trpc';

interface RoomDisplays {
  // label: string | null;
  displays: Display[];
}

const RoomDisplaysContext = createContext<{ roomDisplays: RoomDisplays } | undefined>(undefined);

function RoomDisplaysProvider({ children }: { children: ReactNode }) {
  const { roomId } = useParams({ from: '/$roomId' });
  const { data, isLoading } = trpc.displays.listByRoom.useQuery(
    {
      id: roomId.toString(),
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
    }
  );
  const [displays, setDisplays] = useState<Display[]>([]);

  useEffect(() => {
    if (roomId && !isLoading) {
      // Set displays once per room id...
      if (data) {
        data && setDisplays(data);
      }
    }
  }, [roomId, isLoading, data]);

  trpc.displays.socket.useSubscription(
    { roomId },
    {
      onData: (display) => {
        setDisplays((stateDisplays) => {
          const updatedDisplays = [...stateDisplays];
          const displayIndex = updatedDisplays.findIndex((originalDisplay) => originalDisplay.id === display.id);

          if (displayIndex === -1) {
            // Add it to the array.
            updatedDisplays.push(display);
          } else {
            updatedDisplays.splice(displayIndex, 1, display);
          }

          return updatedDisplays;
        });
      },
    }
  );

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value: { roomDisplays: RoomDisplays } = {
    roomDisplays: { displays: displays },
  };

  return <RoomDisplaysContext.Provider value={value}>{children}</RoomDisplaysContext.Provider>;
}

function useRoomDisplays() {
  const context = useContext(RoomDisplaysContext);
  if (context === undefined) {
    throw new Error('useRoomDisplays must be used within a RoomDisplaysProvider');
  }
  return context;
}

export { useRoomDisplays, RoomDisplaysProvider };
