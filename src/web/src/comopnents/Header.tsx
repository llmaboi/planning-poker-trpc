import { useNavigate, useParams } from '@tanstack/react-router';
import { roomRoute } from '../../utils/router';
import { trpc } from '../../utils/trpc';
import { useRoomDisplays } from '../providers/roomDisplays.provider';
import { h, Fragment } from 'preact';
import './Header.scss';
import { useEffect, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';

function HostHeader({ roomId }: { roomId: string }) {
  const { roomDetails } = useRoomDisplays();
  const resetCardValuesMutation = trpc.rooms.reset.useMutation();
  const updateRoom = trpc.rooms.update.useMutation();
  const [label, setLabel] = useState('');
  const { label: providerLabel } = roomDetails;

  useEffect(() => {
    if (typeof providerLabel === 'string') {
      setLabel(providerLabel);
    }
  }, [providerLabel]);

  function resetCards() {
    resetCardValuesMutation.mutate({ id: roomId });
  }

  const handleLabelChange: JSXInternal.GenericEventHandler<HTMLInputElement> = (event) => {
    const newLabel = event.currentTarget.value;
    setLabel(newLabel);
  };

  function updateLabel() {
    if (!label || !label.length) {
      // TODO: make component with "reset"
      console.error('invalid label');
    } else {
      updateRoom.mutate({ ...roomDetails, id: roomId, label });
    }
  }

  function handleShowVotes() {
    updateRoom.mutate({ ...roomDetails, id: roomId, showVotes: !roomDetails.showVotes });
  }

  return (
    <>
      <label id="room-label">
        Room Label: <input disabled={updateRoom.isLoading} type="text" value={label} onChange={handleLabelChange} />
      </label>

      <button disabled={updateRoom.isLoading || label.length <= 0} onClick={updateLabel}>
        Update label
      </button>

      <button disabled={resetCardValuesMutation.isLoading} onClick={resetCards}>
        Reset cards
      </button>

      {roomDetails.showVotes ? (
        <button disabled={updateRoom.isLoading} onClick={handleShowVotes}>
          Hide Votes
        </button>
      ) : (
        <button disabled={updateRoom.isLoading} onClick={handleShowVotes}>
          Show Votes
        </button>
      )}
    </>
  );
}

function Header() {
  const navigate = useNavigate({});
  const { roomId, displayId } = useParams({ from: roomRoute.id });
  const { roomDetails } = useRoomDisplays();

  const currentDisplay = roomDetails.displays.find((display) => display.id === displayId);

  function changeRoom() {
    void navigate({ to: '/' });
  }

  return (
    <div className="HeaderWrapper">
      {currentDisplay?.isHost && <HostHeader roomId={roomId} />}
      {!currentDisplay?.isHost && (
        <>Room Label: {roomDetails && roomDetails.label ? roomDetails.label : 'No room label'}</>
      )}
      <button onClick={changeRoom}>Change Room</button>
    </div>
  );
}

export default Header;
