import LegoBoard from "./LegoBoard";
export default function LegoIntro({ onStart }: { onStart: () => void }) {
  return (
    <section className="lego-intro fade-in">
      <span className="eyebrow">THE LAST LITTLE SURPRISE</span>
      <div className="mini-heart" aria-hidden="true">
        <LegoBoard placed={[]} preview />
      </div>
      <h1>
        LEGO Love Puzzle <em>♡</em>
      </h1>
      <p>Drag the pieces to complete the heart.</p>
      <div className="preview-board">
        <LegoBoard placed={[]} preview />
      </div>
      <button className="primary" onClick={onStart}>
        Start Puzzle ♡
      </button>
    </section>
  );
}
