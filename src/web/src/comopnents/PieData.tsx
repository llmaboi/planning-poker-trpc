import { PieChart } from 'react-minimal-pie-chart';
import { useRoomDisplays } from '../providers/roomDisplays.provider';
import './PieData.css';

const cardColors = ['#8D5A97', '#907F9F', '#A4A5AE', '#B0C7BD', '#B8EBD0', '#14342B', '#60935D', '#BAB700', '#BBDFC5'];

function PieData() {
  const { roomDetails } = useRoomDisplays();
  const numberMap = new Map<number, number>();
  const displays = roomDetails.displays;

  /**
   * 1. Get all cards to populate pie chard
   *  -- 1. Associate cards with the user && value
   * 2. Get the card for this user (to update the card selection)
   */
  displays.forEach(({ cardValue }) => {
    if (typeof cardValue === 'number') {
      if (cardValue > 0) {
        const found = numberMap.get(cardValue);

        if (found) {
          const updatedValue = found + 1;
          numberMap.set(cardValue, updatedValue);
        } else {
          numberMap.set(cardValue, 1);
        }
      }
    }
  });

  const pieData = Array.from(numberMap.entries()).map(([key, val], index) => {
    return {
      title: key,
      label: () => key,
      value: val,
      // TODO: Fix colors...
      color: cardColors[index] || '',
    };
  });

  if (!pieData.length) {
    return null;
  }

  return (
    <section className="pie-wrapper">
      {pieData.length > 0 && (
        <PieChart
          data={pieData}
          label={({ dataEntry }) => `${dataEntry.title} | ${Math.round(dataEntry.percentage)}%`}
          labelStyle={(index) => ({
            fill: cardColors[index],
            fontSize: '5px',
            fontFamily: 'sans-serif',
          })}
          radius={35}
          labelPosition={115}
        />
      )}
    </section>
  );
}

export default PieData;
