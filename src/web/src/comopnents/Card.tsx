import './Card.css';

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
  let className = 'card-component';

  if (buttonDisabled) {
    className += ' disabled';
  }

  if (selectedNumber && selectedNumber === number) {
    className = 'card-component selected';
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
