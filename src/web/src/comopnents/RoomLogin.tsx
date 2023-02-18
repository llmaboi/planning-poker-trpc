import { useNavigate } from '@tanstack/react-router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { displayLoginRoute } from '../../utils/router';
import { trpc } from '../../utils/trpc';
import './RoomLogin.scss';

function RoomList({ onSelectRoom, roomSearch }: { onSelectRoom: (roomId: string) => void; roomSearch: string }) {
  const { data: rooms, isLoading, isError } = trpc.rooms.list.useQuery();

  if (isLoading) {
    return <p>Loading rooms...</p>;
  } else if (isError || (!isLoading && !rooms)) {
    return <p>Something went wrong getting the rooms...</p>;
  }

  function handleClick(roomId: string) {
    onSelectRoom(roomId);
  }

  const filteredRooms = [...rooms].filter((room) => {
    return room.name.toLowerCase().includes(roomSearch.toLowerCase());
  });

  return (
    <ul className="RoomList">
      {filteredRooms.map((room) => {
        return (
          <li key={room.id}>
            <button onClick={() => handleClick(room.id)}>{room.name}</button>
          </li>
        );
      })}
    </ul>
  );
}

function RoomLogin() {
  const [roomName, setRoomName] = useState('');
  const [roomNameError, setRoomNameError] = useState(false);
  const { mutate } = trpc.rooms.create.useMutation();
  const navigate = useNavigate({ from: '/' });

  const roomNameExists = roomName.length > 0;

  function handleRoomNameChange(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (event && event.target.value) {
      setRoomName(event.target.value);
    } else {
      setRoomName('');
    }
  }

  function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!roomNameExists) {
      setRoomNameError(true);
      return;
    }
    setRoomNameError(false);
    mutate(
      { name: roomName, label: '', showVotes: true },
      {
        onSuccess: ({ id }) => {
          void navigate({
            to: displayLoginRoute.fullPath,
            params: { roomId: id },
          });
        },
      }
    );
  }

  function handleRoomSelection(roomId: string) {
    void navigate({
      to: displayLoginRoute.fullPath,
      params: { roomId },
    });
  }

  // TODO: Fix a bug on "start" where you must "click" to trigger a refetch
  //  or something displaying a blank screen.
  return (
    <section className="RoomLogin">
      <h1 className="Heading">Search for or select your room</h1>
      <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column' }}>
        <label className="RoomInput">
          Create New Room: <input required type="text" value={roomName} onChange={handleRoomNameChange} />
        </label>
        {roomNameError && <span style={{ color: 'red' }}>Room Name is required</span>}
        <button className="RoomCreate" disabled={!roomNameExists} type="submit">
          Create room
        </button>
      </form>

      <RoomList onSelectRoom={handleRoomSelection} roomSearch={roomName} />
    </section>
  );
}

export default RoomLogin;
