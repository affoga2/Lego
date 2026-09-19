export default function PuzzleComplete({ onReveal }: { onReveal: () => void }) {
  return (
    <div className="puzzle-complete">
      <div className="floating-hearts" aria-hidden="true">
        <span>♡</span>
        <span>♥</span>
        <span>♡</span>
      </div>
      <h2>Puzzle Completed! ♡</h2>
  
      <button className="primary" onClick={onReveal}>
        Reveal the Message <span>♡</span>
      </button>
    </div>
  );
}
