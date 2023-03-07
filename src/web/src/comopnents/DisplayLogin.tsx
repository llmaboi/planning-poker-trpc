import { useNavigate, useParams } from '@tanstack/react-router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { displayLoginRoute } from '../../utils/router';
import { trpc } from '../../utils/trpc';
import './DisplayLogin.scss';

function DisplayList({ roomId }: { roomId: string }) {
  const {
    data: displays,
    isLoading,
    isError,
  } = trpc.displays.listByRoom.useQuery({
    roomId: roomId,
  });

  if (isLoading) {
    return <p>Loading in use display names...</p>;
  } else if (isError || (!isLoading && !displays)) {
    return <p>Something went wrong getting the in use display names...</p>;
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
  const { roomId } = useParams({ from: displayLoginRoute.id });
  const createOrUpdateDisplayMutation = trpc.displays.createOrUpdate.useMutation();
  const { data: room, isLoading, isError } = trpc.rooms.byId.useQuery({ id: roomId });
  const navigate = useNavigate({ from: displayLoginRoute.id });
  const utils = trpc.useContext();

  const displayNameExists = displayName && displayName.length > 0;

  function handleDisplayChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event) setDisplayName(event.target.value);
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
          utils.displays.listByRoom.setData({ roomId }, (oldData) => {
            if (oldData === undefined) return;
            const newDisplays = [...oldData];

            // Add new data only if the id doesn't exist.
            if (newDisplays.find((display) => display.id === data.id) === undefined) {
              newDisplays.push(data);
            }

            return newDisplays;
          });

          utils.rooms.byId.setData({ id: roomId }, (oldData) => {
            if (oldData === undefined) return;
            const newRoom = { ...oldData };
            const newRoomDisplays = newRoom.displays;

            // Add new data only if the id doesn't exist.
            if (newRoomDisplays.has(data.id) === false) {
              newRoomDisplays.set(data.id, data);
            }

            newRoom.displays = newRoomDisplays;

            return newRoom;
          });

          void navigate({
            to: '/room/$roomId/$displayId',
            search: {},
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
    <form
      className="DisplayLogin"
      onSubmit={handleFindOrCreateDisplay}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <section className="DisplayLoginInputs">
        <label>
          Display Name:
          <input required type="text" value={displayName} onChange={handleDisplayChange} />
        </label>
        {displayNameError && <span style={{ color: 'red' }}>Display Name is required</span>}
        <label className="Checkbox">
          <input type="checkbox" checked={isHost} onChange={handleHost} />
          Room Host
        </label>
      </section>

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
  );
}

export default DisplayLogin;
