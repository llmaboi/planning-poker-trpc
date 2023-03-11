import { PieChart } from 'react-minimal-pie-chart';
import { useRoomDisplays } from '../providers/roomDisplays.provider';
import './PieData.scss';
import { h } from 'preact';

const cardColors = ['#BC8843', '#00C9AF', '#996925', '#5FD8A4', '#92E59B', '#C2F195', '#65B8FF', '#FFF3A8', '#AB8B67'];

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
      color: cardColors[index] || '',
    };
  });

  if (!pieData.length) {
    return null;
  }

  return (
    <section className="PieData">
      {pieData.length > 0 && (
        <div className="PieChartWrapper">
          <PieChart
            data={pieData}
            label={({ dataEntry }) => `${dataEntry.title} | ${Math.round(dataEntry.percentage)}%`}
            labelStyle={(index: number) => ({
              fill: cardColors[index],
              fontSize: '0.5rem',
            })}
            radius={35}
            labelPosition={115}
            style={{ overflow: 'visible' }}
          />
        </div>
      )}
    </section>
  );
}

export default PieData;
