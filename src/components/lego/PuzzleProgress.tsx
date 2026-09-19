export default function PuzzleProgress({
  count,
  total,
}: {
  count: number;
  total: number;
}) {
  return (
    <div className="puzzle-progress">
      <div>
        <span aria-live="polite">
          {count} / {total}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Puzzle progress"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <i style={{ width: `${(count / total) * 100}%` }} />
      </div>
    </div>
  );
}
