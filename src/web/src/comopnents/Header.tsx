import { useRoomDisplays } from '../providers/roomDisplays.provider';
import { ChangeEvent, useEffect, useState } from 'react';
import './Header.css';
import { trpc } from '../../utils/trpc';
import { Room } from '../../../server/models/Room';
import { useNavigate, useParams } from '@tanstack/react-router';

function HostHeader({ room }: { room: Room }) {
  const resetCardValuesMutation = trpc.rooms.reset.useMutation();
  const updateRoom = trpc.rooms.update.useMutation();
  const [label, setLabel] = useState(room.label || '');

  function resetCardData() {
    // TODO: write simpler FN to reset room cards...
    resetCardValuesMutation.mutate({ id: room.id });
  }

  function handleLabelChange(event: ChangeEvent<HTMLInputElement>) {
    const newLabel = event.target.value;
    setLabel(newLabel);
  }

  function updateLabel() {
    if (!label || !label.length) {
      // TODO: make component with "reset"
      console.error('invalid label');
      return <p>An invalid label was provided</p>;
    }

    updateRoom.mutate({ ...room, label });
  }

  function handleShowVotes() {
    // TODO: Add a value to show / hide votes if user is not "host"
    updateRoom.mutate({ ...room, showVotes: !room.showVotes });
  }

  return (
    <>
      <label id='room-label'>
        Room Label:{' '}
        <input
          disabled={updateRoom.isLoading}
          type='text'
          value={label}
          onChange={handleLabelChange}
        />
      </label>

      <button disabled={updateRoom.isLoading} onClick={updateLabel}>
        Update label
      </button>

      <button
        disabled={resetCardValuesMutation.isLoading}
        onClick={resetCardData}
      >
        Reset card data
      </button>
      {room.showVotes ? (
        <button disabled={updateRoom.isLoading} onClick={handleShowVotes}>
          Hide Votes from users.
        </button>
      ) : (
        <button disabled={updateRoom.isLoading} onClick={handleShowVotes}>
          Show Votes to users.
        </button>
      )}
    </>
  );
}

function Header() {
  const navigate = useNavigate({});
  const { roomId } = useParams({ from: '/room/$roomId' });
  const {
    data: room,
    isLoading,
    isError,
  } = trpc.rooms.byId.useQuery({ id: roomId });
  const { roomDisplays } = useRoomDisplays();
  // const { state } = useLocation();
  const [isHost, setIsHost] = useState(false);
  const displaysData = roomDisplays.displays;

  // useEffect(() => {
  //   if (displaysData) {
  //     const found = displaysData.find(
  //       (display) => display.name === state.displayName
  //     );

  //     if (found) {
  //       if (found.isHost) {
  //         setIsHost(found.isHost);
  //       }
  //     }
  //   }
  // }, [displaysData, state.displayName]);

  // if (!parsedRoomId || !state || (state && !state.displayName)) {
  //   navigate('/noAuth');
  //   // TODO: Correct this...
  //   return <div>Routing to No Auth...</div>;
  // }

  // TODO: Move this to a common header...
  function signOut() {
    // TODO: Does state need to be reset?
    navigate({ to: '/noDisplay' });
    // TODO: Correct this...
    return <div>Routing to No Auth...</div>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    // TODO: add button to try again?
    return <p>Something went wrong...</p>;
  }

  return (
    <div id='header-wrapper'>
      {isHost && <HostHeader room={room} />}
      {!isHost && (
        <>Room Label: {room && room.label ? room.label : 'No room label'}</>
      )}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default Header;
