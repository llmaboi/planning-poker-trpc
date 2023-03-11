import './Card.scss';
import { h } from 'preact';

export default function Card({
  number,
  selectedNumber,
  buttonDisabled,
  onCardClick,
}: {
  number: number;
  selectedNumber: number | undefined;
  buttonDisabled: boolean;
  onCardClick: (number: number) => void;
}) {
  let className = 'Card';

  if (buttonDisabled) {
    className += ' disabled';
  }

  if (selectedNumber && selectedNumber === number) {
    className = 'Card selected';
  }

  function handleCardClick() {
    onCardClick(number);
  }

  return (
    <button className={className} onClick={handleCardClick} disabled={buttonDisabled}>
      {number}
    </button>
  );
}
