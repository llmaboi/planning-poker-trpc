import { useNavigate, useParams } from '@tanstack/react-router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { displayLoginRoute, roomRoute } from '../../utils/router';
import { trpc } from '../../utils/trpc';
import { useRoomDisplays } from '../providers/roomDisplays.provider';

function DisplayList({ roomId }: { roomId: string }) {
  const {
    data: displays,
    isLoading,
    isError,
  } = trpc.displays.listByRoom.useQuery({
    roomId: roomId,
  });

  if (isLoading) {
    return <p>Loading rooms...</p>;
  } else if (isError || (!isLoading && !displays)) {
    return <p>Something went wrong getting the rooms...</p>;
  }

  return (
    <>
      <ul>
        {displays.map((display) => {
          return <li key={display.id}>{display.name}</li>;
        })}
      </ul>
    </>
  );
}

function DisplayLogin() {
  const [displayName, setDisplayName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [displayNameError, setDisplayNameError] = useState(false);
  const { roomId } = useParams({ from: displayLoginRoute.fullPath });
  const createOrUpdateDisplayMutation = trpc.displays.createOrUpdate.useMutation();
  const { data: room, isLoading, isError } = trpc.rooms.byId.useQuery({ id: roomId });
  const navigate = useNavigate({ from: displayLoginRoute.id });
  // Start listening to the socket early so we can react to it.
  useRoomDisplays();

  const displayNameExists = displayName && displayName.length > 0;

  function handleDisplayChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event && event.target.value) {
      setDisplayName(event.target.value);
    }
  }

  function handleHost() {
    setIsHost(!isHost);
  }

  function handleFindOrCreateDisplay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!displayNameExists) {
      setDisplayNameError(true);
      return;
    }

    createOrUpdateDisplayMutation.mutate(
      { roomId, cardValue: 0, isHost, name: displayName },
      {
        onSuccess: (data) => {
          void navigate({
            to: roomRoute.fullPath,
            params: {
              roomId,
              displayId: data.id,
            },
          });
        },
      }
    );
  }

  return (
    <>
      <form onSubmit={handleFindOrCreateDisplay} style={{ display: 'flex', flexDirection: 'column' }}>
        <label>
          Display Name:
          <input required type="text" value={displayName} onChange={handleDisplayChange} />
        </label>
        {displayNameError && <span style={{ color: 'red' }}>Display Name is required</span>}
        <label>
          Room Host:
          <input type="checkbox" checked={isHost} onChange={handleHost} />
        </label>
        <button disabled={!displayNameExists} type="submit">
          Join room
        </button>

        {/* TODO: make into separate component? */}
        {isLoading || isError || (!isLoading && !room) ? (
          <p>Loading room displays</p>
        ) : (
          <>
            <h4>Current Display Names in {room.name}:</h4>
            <DisplayList roomId={roomId} />
          </>
        )}
      </form>
    </>
  );
}

export default DisplayLogin;
