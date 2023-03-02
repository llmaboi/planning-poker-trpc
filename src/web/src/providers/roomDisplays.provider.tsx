// import { websocketRoomDisplays } from '../api/mysqlFastify';
import { useParams } from '@tanstack/react-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Display } from '../../../server/models/Display';
import { RoomMapItem } from '../../../server/router/context';
import { displayLoginRoute } from '../../utils/router';
import { trpc } from '../../utils/trpc';

type RoomDetails = Omit<RoomMapItem, 'id' | 'displays'> & {
  displays: Display[];
};

type RoomDisplayCtx = { roomDetails: RoomDetails };

const RoomDisplaysContext = createContext<RoomDisplayCtx | undefined>(undefined);

function RoomDisplaysProvider({ children }: { children: ReactNode }) {
  const { roomId } = useParams({ from: displayLoginRoute.id });
  const { data, isLoading } = trpc.rooms.byId.useQuery(
    { id: roomId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
    }
  );
  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [showVotes, setShowVotes] = useState(false);
  const [displays, setDisplays] = useState<Display[]>([]);
  const [ttl, setTtl] = useState(0);

  useEffect(() => {
    if (roomId && !isLoading) {
      // Set displays once per room id...
      if (data) {
        setLabel(data.label ?? '');
        setName(data.name);
        setShowVotes(data.showVotes);
        setTtl(data.ttl);
        data && setDisplays(Array.from(data.displays.values()));
      }
    }
  }, [roomId, isLoading, data]);

  trpc.displays.socket.useSubscription(
    { roomId },
    {
      onData: (roomMapItem) => {
        const displays = Array.from(roomMapItem.displays.values());
        setLabel(roomMapItem.label ?? '');
        setName(roomMapItem.name);
        setShowVotes(roomMapItem.showVotes);
        setTtl(roomMapItem.ttl);

        setDisplays(displays);
      },
      onError: console.error,
    }
  );

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value: RoomDisplayCtx = {
    roomDetails: {
      displays,
      label,
      name,
      showVotes,
      ttl,
    },
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
