import styles from './styles.module.scss';

type TruckMapProps = {
  eixos: number;
  positions: string[];
  onSelect: (position: string) => void;
};

const CENTER = 160;
const FRONT_AXLE_Y = 55;
const FIRST_REAR_AXLE_Y = 250;
const REAR_AXLE_GAP = 88;
const WHEEL_WIDTH = 20;
const WHEEL_HEIGHT = 70;

const Wheel = ({ x, y }: { x: number; y: number }) => {
  const top = y - WHEEL_HEIGHT / 2;
  const treads = Array.from({ length: 8 }).map((_, i) => top + 10 + i * 7);

  return (
    <g className={styles.wheel}>
      <rect x={x} y={top} width={WHEEL_WIDTH} height={WHEEL_HEIGHT} rx={8} />
      {treads.map((ty) => (
        <line key={ty} x1={x + 4} x2={x + WHEEL_WIDTH - 4} y1={ty} y2={ty} />
      ))}
    </g>
  );
};

const TruckMap = ({ eixos, positions, onSelect }: TruckMapProps) => {
  const axles = Array.from({ length: eixos }).map((_, idx) => {
    const number = idx + 1;
    const isFront = number === 1;
    const y = isFront ? FRONT_AXLE_Y : FIRST_REAR_AXLE_Y + (number - 2) * REAR_AXLE_GAP;
    return { number, isFront, y };
  });

  const lastAxleY = axles[axles.length - 1].y;
  const bodyBottom = Math.max(lastAxleY + 55, FIRST_REAR_AXLE_Y);
  const height = bodyBottom + 10;

  const renderSide = (side: 'L' | 'R', number: number, isFront: boolean, y: number) => {
    const position = `${side}${number}`;
    const enabled = positions.includes(position);
    const isLeft = side === 'L';

    const wheelsX = isFront
      ? [isLeft ? 93 : 207]
      : isLeft
        ? [72, 94]
        : [206, 228];

    const handleSelect = () => {
      if (enabled) onSelect(position);
    };

    return (
      <g
        key={position}
        className={`${styles.position} ${!enabled ? styles.disabled : ''}`}
        role="button"
        tabIndex={enabled ? 0 : -1}
        aria-label={`Pneu ${position}`}
        onClick={handleSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleSelect();
        }}
      >
        <rect
          className={styles.hitArea}
          x={isLeft ? 0 : 200}
          y={y - WHEEL_HEIGHT / 2 - 4}
          width={120}
          height={WHEEL_HEIGHT + 8}
        />
        {wheelsX.map((wx) => (
          <Wheel key={wx} x={wx} y={y} />
        ))}
        <text x={isLeft ? 32 : 288} y={y + 7} textAnchor="middle" className={styles.label}>
          {position}
        </text>
      </g>
    );
  };

  return (
    <svg
      className={styles.truckMap}
      viewBox={`0 0 320 ${height}`}
      role="img"
      aria-label={`Caminhão com ${eixos} eixos`}
    >
      <rect className={styles.body} x={115} y={10} width={90} height={110} rx={18} />
      <rect className={styles.body} x={128} y={120} width={64} height={30} />
      <rect className={styles.body} x={112} y={150} width={96} height={bodyBottom - 150} />

      <line className={styles.shaft} x1={CENTER} x2={CENTER} y1={FRONT_AXLE_Y} y2={lastAxleY} />

      {axles.map(({ number, isFront, y }) => (
        <g key={`eixo-${number}`}>
          <line
            className={isFront ? styles.axleFront : styles.axleRear}
            x1={isFront ? 113 : 114}
            x2={isFront ? 207 : 206}
            y1={y}
            y2={y}
          />
          {isFront ? (
            <rect className={styles.hub} x={CENTER - 5} y={y - 5} width={10} height={10} />
          ) : (
            <circle className={styles.hubRear} cx={CENTER} cy={y} r={13} />
          )}
          {renderSide('L', number, isFront, y)}
          {renderSide('R', number, isFront, y)}
        </g>
      ))}
    </svg>
  );
};

export default TruckMap;
