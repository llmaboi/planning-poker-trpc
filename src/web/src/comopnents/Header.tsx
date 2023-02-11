import { useNavigate, useParams } from '@tanstack/react-router';
import { ChangeEvent, useState } from 'react';
import { Room } from '../../../server/models/Room';
import { roomRoute } from '../../utils/router';
import { trpc } from '../../utils/trpc';
import { useRoomDisplays } from '../providers/roomDisplays.provider';
import './Header.css';

function HostHeader({ room }: { room: Room }) {
  const resetCardValuesMutation = trpc.rooms.reset.useMutation();
  const updateRoom = trpc.rooms.update.useMutation();
  const [label, setLabel] = useState(room.label || '');

  function resetCardData() {
    // TODO: write simpler FN to reset room cards...
    resetCardValuesMutation.mutate({ roomId: room.id });
  }

  function handleLabelChange(event: ChangeEvent<HTMLInputElement>) {
    const newLabel = event.target.value;
    setLabel(newLabel);
  }

  function updateLabel() {
    if (!label || !label.length) {
      // TODO: make component with "reset"
      console.error('invalid label');
    } else {
      updateRoom.mutate({ ...room, label });
    }
  }

  function handleShowVotes() {
    // TODO: Add a value to show / hide votes if user is not "host"
    updateRoom.mutate({ ...room, showVotes: !room.showVotes });
  }

  return (
    <>
      <label id="room-label">
        Room Label: <input disabled={updateRoom.isLoading} type="text" value={label} onChange={handleLabelChange} />
      </label>

      <button disabled={updateRoom.isLoading} onClick={updateLabel}>
        Update label
      </button>

      <button disabled={resetCardValuesMutation.isLoading} onClick={resetCardData}>
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
  const { roomId, displayId } = useParams({ from: roomRoute.fullPath });
  const { data: room, isLoading, isError } = trpc.rooms.byId.useQuery({ id: roomId });
  const { roomDisplays } = useRoomDisplays();

  const currentDisplay = roomDisplays.displays.find((display) => display.id === displayId);

  // TODO: Move this to a common header...
  function signOut() {
    // TODO: Does state need to be reset?
    void navigate({ to: '/noDisplay' });
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
    <div id="header-wrapper">
      {currentDisplay?.isHost && <HostHeader room={room} />}
      {!currentDisplay?.isHost && <>Room Label: {room && room.label ? room.label : 'No room label'}</>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default Header;
