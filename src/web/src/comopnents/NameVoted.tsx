import { useEffect, useState } from 'react';
import { useRoomDisplays } from '../providers/roomDisplays.provider';
import './NameVoted.css';

function NameVoted() {
  const { roomDisplays } = useRoomDisplays();
  const [displayNameAndVoted, setDisplayNameAndVoted] = useState<
    { name: string; voted: number }[]
  >([]);
  const displays = roomDisplays.displays;

  useEffect(() => {
    const displayNameVoted: { name: string; voted: number }[] = [];
    if (displays) {
      displays.forEach(({ name, cardValue }) => {
        displayNameVoted.push({
          name,
          voted: cardValue,
        });
      });
    }
  });

  const nameVoted = displayNameAndVoted.filter(({ voted }) => voted);

  return (
    <section className='name-voted-wrapper'>
      <h3>Room voting results:</h3>
      <h5>
        {nameVoted.length} of {displayNameAndVoted.length} voted
      </h5>
      <div className='voted-wrapper'>
        {displayNameAndVoted.length === 0 && <div>No data to display</div>}
        {displayNameAndVoted.length > 0 &&
          displayNameAndVoted.map(({ name, voted }, index) => {
            return (
              <p key={index}>
                {name}: {voted}
              </p>
            );
          })}
      </div>
    </section>
  );
}

export default NameVoted;
