import { useParams } from '@tanstack/react-router';
import { roomRoute } from '../../utils/router';
import { trpc } from '../../utils/trpc';
import { useRoomDisplays } from '../providers/roomDisplays.provider';
import Card from './Card';
import NameVoted from './NameVoted';
import PieData from './PieData';
import './Room.scss';

const cards = [1, 2, 3, 5, 8, 13, 21, 34, 55];

interface Card {
  number: number;
}

export default function Room() {
  const { displayId } = useParams({ from: roomRoute.id });
  const { roomDetails } = useRoomDisplays();
  const displayMutation = trpc.displays.update.useMutation();

  const display = roomDetails.displays.find((displayItem) => displayItem.id === displayId);

  function updateDisplayCardValue(number: number) {
    if (display)
      displayMutation.mutate({
        ...display,
        cardValue: number,
      });
  }

  function resetSelection() {
    if (display)
      displayMutation.mutate({
        ...display,
        cardValue: 0,
      });
  }

  const selectedNumber = display?.cardValue;

  return (
    <>
      <div className="RoomCards">
        {cards.map((number) => {
          return (
            <Card
              key={number}
              buttonDisabled={typeof selectedNumber === 'number' && selectedNumber > 0}
              number={number}
              onCardClick={updateDisplayCardValue}
              selectedNumber={selectedNumber}
            />
          );
        })}
      </div>

      <div className="ResetSelection">
        <button onClick={resetSelection}>Reset Selection</button>
      </div>

      {/* TODO: Show voted... */}
      {roomDetails.showVotes && roomDetails && <NameVoted />}
      {roomDetails.showVotes && roomDetails && <PieData />}
    </>
  );
}
