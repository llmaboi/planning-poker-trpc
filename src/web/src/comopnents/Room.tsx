import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Display } from '../../../server/models/Display';
import { trpc } from '../../utils/trpc';
import { useRoomDisplays } from '../providers/roomDisplays.provider';
import Card from './Card';
import NameVoted from './NameVoted';
import PieData from './PieData';
import './Room.css';

const cards = [1, 2, 3, 5, 8, 13, 21, 34, 55];

interface Card {
  number: number;
}

function NoRoomOrDisplay() {
  const navigate = useNavigate({ from: '/room/$roomId' });

  function findRoom() {
    navigate({ to: '/' });
  }

  return (
    <div>
      You must be logged in or authorized.{' '}
      <button onClick={findRoom}>Find Room</button>
    </div>
  );
}

function HasRoomAndDisplay({
  roomId,
  displayName,
}: {
  roomId: number;
  displayName: string;
}) {
  const { roomDisplays } = useRoomDisplays();
  const [currentDisplay, setCurrentDisplay] = useState<Display>();
  const displayMutation = trpc.displays.update.useMutation();
  const displays = roomDisplays.displays;

  useEffect(() => {
    if (roomDisplays.displays) {
      const found = displays.find((display) => {
        return display.name === displayName;
      });
      if (found) {
        setCurrentDisplay(found);
      } else {
        currentDisplay &&
          setCurrentDisplay({ ...currentDisplay, cardValue: 0 });
      }
    }
  }, [roomDisplays, displayName]);

  function updateDisplayCardValue(number: number) {
    if (currentDisplay) {
      displayMutation.mutate({
        ...currentDisplay,
        cardValue: number,
      });
    }
  }

  function resetSelection() {
    if (currentDisplay) {
      displayMutation.mutate({
        ...currentDisplay,
        cardValue: 0,
      });
    }
  }

  const selectedNumber = currentDisplay?.cardValue;

  return (
    <>
      <div className='cards-wrapper'>
        {cards.map((number) => {
          return (
            <Card
              key={number}
              buttonDisabled={
                typeof selectedNumber === 'number' && selectedNumber > 0
              }
              number={number}
              onCardClick={updateDisplayCardValue}
              selectedNumber={selectedNumber}
            />
          );
        })}
      </div>

      {displays && <NameVoted />}

      {displays && <PieData />}

      <div className='reset-selection'>
        <button onClick={resetSelection}>Reset Selection</button>
      </div>
    </>
  );
}

export default function Room() {
  const { roomId } = useParams({ from: '/room/$roomId' });
  // const { state } = useLocation();

  if (
    !roomId
    //  || !state ||
    //   (state && !state.displayName)
  ) {
    return <NoRoomOrDisplay />;
  }

  return (
    <HasRoomAndDisplay
      roomId={roomId}
      displayName={
        ''
        // state.displayName
      }
    />
  );
}
