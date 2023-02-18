import { useEffect, useState } from 'react';
import { useRoomDisplays } from '../providers/roomDisplays.provider';
import './NameVoted.scss';

type DisplayNameVote = {
  name: string;
  voted: number;
};

function VoteItem({ vote }: { vote: DisplayNameVote }) {
  return (
    <p>
      {vote.name}: {vote.voted}
    </p>
  );
}

function NameVoted() {
  const { roomDetails } = useRoomDisplays();
  const [displayNameAndVoted, setDisplayNameAndVoted] = useState<DisplayNameVote[]>([]);
  const displays = roomDetails.displays;

  useEffect(() => {
    const displayNameVoted: { name: string; voted: number }[] = [];
    if (displays) {
      displays.forEach(({ name, cardValue }) => {
        displayNameVoted.push({
          name,
          voted: cardValue,
        });
      });
      setDisplayNameAndVoted(displayNameVoted);
    }
  }, [displays]);

  const nameVoted = displayNameAndVoted.filter(({ voted }) => voted);

  const voted = displayNameAndVoted.filter((x) => x.voted > 0);
  const notVoted = displayNameAndVoted.filter((x) => x.voted <= 0);

  return (
    <section className="NameVoted">
      <h3>Room voting results:</h3>
      <span className="OfVoted">
        {nameVoted.length} of {displayNameAndVoted.length} voted
      </span>
      <div className="VotedWrapper">
        <section className="Voted">
          <span className="VotedLabel">Voted</span>
          <div className="Votes">
            {voted.map((x) => (
              <VoteItem vote={x} key={x.name} />
            ))}
          </div>
        </section>
        <section className="NotVoted">
          <span className="NotVotedLabel">Not Voted</span>
          <div className="Votes">
            {notVoted.map((x) => (
              <VoteItem vote={x} key={x.name} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default NameVoted;
