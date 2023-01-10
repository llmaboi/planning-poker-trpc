import { useState, FormEvent, ChangeEvent } from 'react';
import './RoomLogin.css';
import { useNavigate } from '@tanstack/react-router';
import { trpc } from '../../utils/trpc';

function RoomList({
  onSelectRoom,
  roomSearch,
}: {
  onSelectRoom: (roomId: number) => void;
  roomSearch: string;
}) {
  const { data: rooms, isLoading, isError } = trpc.rooms.list.useQuery();

  if (isLoading) {
    return <p>Loading rooms...</p>;
  } else if (isError || (!isLoading && !rooms)) {
    return <p>Something went wrong getting the rooms...</p>;
  }

  function handleClick(roomId: number) {
    onSelectRoom(roomId);
  }

  const filteredRooms = [...rooms].filter((room) => {
    return room.name.toLowerCase().includes(roomSearch.toLowerCase());
  });

  return (
    <>
      <ul>
        {filteredRooms.map((room) => {
          return (
            <li key={room.id}>
              <button onClick={() => handleClick(room.id)}>{room.name}</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function RoomLogin() {
  const [roomName, setRoomName] = useState('');
  const [roomNameError, setRoomNameError] = useState(false);
  const { mutate } = trpc.rooms.create.useMutation();
  const navigate = useNavigate({ from: '/' });

  const roomNameExists = roomName && roomName.length > 0;

  function handleRoomNameChange(
    event: ChangeEvent<HTMLInputElement> | undefined
  ) {
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
          navigate({
            to: '/$roomId',
            params: { roomId: id },
            //             state: {
            //               displayName,
            //             },
            //           });
          });
        },
      }
    );
  }

  function handleRoomSelection(roomId: number) {
    navigate({
      to: '/$roomId',
      params: { roomId },
      //  {
      //             state: {
      //               displayName,
      //             },
      //           });
    });
  }

  return (
    <>
      <h2>Search for or select your room</h2>
      <form
        onSubmit={handleCreateRoom}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <label>
          Create New Room:{' '}
          <input
            required
            type='text'
            value={roomName}
            onChange={handleRoomNameChange}
          />
        </label>
        {roomNameError && (
          <span style={{ color: 'red' }}>Room Name is required</span>
        )}
        <button disabled={!roomNameExists} type='submit'>
          Create room
        </button>
      </form>
      <RoomList onSelectRoom={handleRoomSelection} roomSearch={roomName} />
    </>
  );
}

export default RoomLogin;
