import LegoBoard from "./LegoBoard";
import { BrickLetter } from "./LegoWordReveal";
export default function FinalLoveScene() {
  return (
    <section className="final-scene fade-in">
      <span className="eyebrow">MY FAVORITE PERSON. ALWAYS.</span>
      <div className="final-heart">
        <LegoBoard placed={[]} preview />
        <div className="final-words" role="img" aria-label="I LOVE YOU">
          {["I", "LOVE", "YOU"].map((word, i) => (
            <span className="block-word" key={i}>
              {[...word].map((l, j) => (
                <BrickLetter letter={l} key={j} />
              ))}
            </span>
          ))}
        </div>
      </div>
      <h1 className="sr-only">I LOVE YOU</h1>
      <p className="forever">And I always will. ♡</p>
      <div
        className="couple"
        aria-label="A couple sitting together, seen from behind"
      >
        <div className="person boy">
          <i className="hair" />
          <i className="head" />
          <i className="body" />
          <i className="legs" />
        </div>
        <div className="person girl">
          <i className="hair" />
          <i className="head" />
          <i className="body" />
          <i className="legs" />
        </div>
      </div>
      <div className="quiet-hearts" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={i}
            style={{ left: `${10 + i * 13}%`, animationDelay: `${i * 0.8}s` }}
          >
            ♡
          </span>
        ))}
      </div>
      <a className="back-memories" href="/">
        Back to our memories ♡
      </a>
    </section>
  );
}
