"use client";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { memories } from "@/data/memories";
import LegoBrick from "@/components/lego/LegoBrick";
const questions = [
  "When was our first kiss?",
  "What was the first movie or cine we watched together?",
  "What flowers you mentioned to me during our first make out?",
];
function correct(index: number, value: string) {
  const v = value.trim().toLowerCase().replace(/\s+/g, " ");
  return index === 0
    ? /^(aug(?:ust)? 28,? 2024|0?8\/28\/2024|2024-08-28)$/.test(v)
    : v === (index === 1 ? "haikyu" : "tulips");
}
function Tulip({ pink = false }: { pink?: boolean }) {
  return (
    <span className={`tulip ${pink ? "pink-tulip" : ""}`} aria-hidden="true">
      <i className="stem" />
      <i className="leaf leaf-left" />
      <i className="leaf leaf-right" />
      <i className="petal petal-left" />
      <i className="petal petal-right" />
      <i className="petal petal-center" />
    </span>
  );
}

function ToyHeart() {
  const rows = ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"];
  return <span className="toy-heart" aria-hidden="true">{rows.flatMap((row,y) =>
    [...row].map((cell,x) => <span key={y+"-"+x}>{cell==="1" && <LegoBrick width={1} height={1} color={y===0?"pink":"red"}/>}</span>)
  )}</span>;
}
function ToyTulip({pink=false}:{pink?:boolean}) {
  const rows=["10101","11111","11111","01110","00100","00100","10101","01110","00100","00100"];
  return <span className="toy-tulip" aria-hidden="true">{rows.flatMap((row,y) =>
    [...row].map((cell,x)=><span key={y+"-"+x}>{cell==="1"&&<LegoBrick width={1} height={1} color={pink?"pink":"red"} className={y>3?"plant-brick":""}/>}</span>)
  )}</span>;
}
function ToyFlowers() {
  return <div className="toy-flowers" aria-hidden="true"><ToyTulip pink/><ToyTulip/><ToyTulip pink/><div className="toy-planter"><LegoBrick width={8} height={1} color="white"/></div></div>;
}
function ToyQuestionIcon({question}:{question:number}) {
  if(question===2) return <ToyFlowers/>;
  return question===0
    ? <div className="toy-calendar"><LegoBrick width={4} height={4} color="white"/><div className="calendar-top"><LegoBrick width={4} height={1}/></div><ToyHeart/></div>
    : <div className="toy-cinema"><LegoBrick width={4} height={3} className="charcoal-brick"/><div className="clapper"/><ToyHeart/></div>;
}
function ButtonStuds() {
  return <span className="button-studs" aria-hidden="true">{Array.from({length:6},(_,i)=><i key={i}/>)}</span>;
}
function ToyCouple() {
  return <div className="welcome-couple" role="img" aria-label="A small toy-brick couple sitting together, seen from behind"><div className="couple">{["boy","girl"].map(person=><div className={"person "+person} key={person}><i className="hair"/><i className="head"/><i className="body"/><i className="legs"/></div>)}</div><div className="couple-seat"><LegoBrick width={8} height={1} color="white"/></div></div>;
}

function Modal({
  children,
  onClose,
  label,
}: {
  children: React.ReactNode;
  onClose: () => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="memory-modal fade-in"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Tab") {
            const nodes = ref.current?.querySelectorAll<HTMLElement>(
              'button,a,input,[tabindex="0"]',
            );
            if (!nodes?.length) return;
            const first = nodes[0],
              last = nodes[nodes.length - 1];
            if (
              e.shiftKey &&
              (document.activeElement === first ||
                document.activeElement === ref.current)
            ) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <button
          className="close-modal"
          aria-label="Close popup"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
export default function MemorySite() {
  const [stage, setStage] = useState<"welcome" | "questions" | "memories">(
    "welcome",
  );
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [opened, setOpened] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [popup, setPopup] = useState<"complete" | "qr" | null>(null);
  const [showWelcomeNote, setShowWelcomeNote] = useState(false);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  function openMemory(i: number) {
    setSelected(i);
    setOpened((old) => (old.includes(i) ? old : [...old, i]));
  }
  function closeMemory() {
    setSelected(null);
    if (opened.length === memories.length) setPopup("complete");
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!correct(question, answer)) {
      setError(true);
      return;
    }
    setError(false);
    if (question === 2) setAccepted(true);
    else {
      setQuestion(question + 1);
      setAnswer("");
    }
  }
  return (
    <main className={`memory-page toy-memory-page stage-${stage}`}>
      <div className="loose-bricks loose-left" aria-hidden="true"><LegoBrick/><LegoBrick width={3} height={1} color="white"/></div>
      <div className="loose-bricks loose-right" aria-hidden="true"><LegoBrick color="pink"/><LegoBrick width={2} height={1}/></div>
      <div className="brand-mark">
        a little collection of us <span>♡</span>
      </div>
      {stage === "welcome" && (
        <section className="welcome fade-in">
          <div className="toy-hero-scene" aria-hidden="true"><ToyFlowers/><ToyHeart/></div>
          <span className="eyebrow">Happy Monthsary to us, and an early Happy Anniversary</span>
          <h1 className="brick-title" aria-label="Our Little Memories">
            {["Our Little","Memories"].map((word)=><span className="title-word" aria-hidden="true" key={word}>{[...word].map((letter,i)=><span className="title-tile" key={i}>{letter}{letter!==" "&&i%2===0&&<i/>}</span>)}</span>)}
          </h1>
          <button className="primary toy-button" onClick={() => setShowWelcomeNote(true)}>
            <ButtonStuds/>
            Let's Start <span>♡</span>
          </button>
          <ToyCouple/>
        </section>
      )}
      {showWelcomeNote && (
        <Modal
          label="Before you start"
          onClose={() => setShowWelcomeNote(false)}
        >
          <div className="welcome-note-popup">
            <div className="completion-heart">♡</div>
            <h2>Before you open this</h2>
            <p>
              I just want to say something.
              If you're wondering why I chose LEGO, it's because I remember we
              once talked about building one together, but we never got the
              chance to. So here it is my own little way of finally making that LEGO memory
              with you. I hope you like it. ♡
            </p>

            <button
              className="primary toy-button"
              onClick={() => {
                setShowWelcomeNote(false);
                setStage("questions");
              }}
            >
              <ButtonStuds/>
              Start <span>♡</span>
            </button>
          </div>
        </Modal>
      )}
      {stage === "questions" && (
        <section className="questions fade-in" key={question}>
          <div
            className="question-steps"
            aria-label={`Question ${question + 1} of 3`}
          >
            {[0, 1, 2].map((i) => (
              <span className={i <= question ? "active" : ""} key={i}>
                {i < question ? "✓" : i + 1}
              </span>
            ))}
          </div>
          <span className="eyebrow">A LITTLE WALK DOWN MEMORY LANE</span>
          <div className="question-icon" aria-hidden="true"><ToyQuestionIcon question={question}/></div>
          <h1>{questions[question]}</h1>
          {accepted ? (
            <div className="fade-in">
              <p className="success">Tulips. Just like these. ♡</p>
              <button className="primary toy-button" onClick={() => setStage("memories")}><ButtonStuds/>
                Start Our Memories ♡
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label className="sr-only" htmlFor="answer">
                Your answer
              </label>
              <input
                autoFocus
                id="answer"
                autoComplete="off"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError(false);
                }}
                placeholder={
                  question === 0 ? "Month, day, year" : "A little memory…"
                }
                aria-invalid={error}
                aria-describedby={error ? "answer-error" : undefined}
              />
              {error && (
                <p id="answer-error" role="alert" className="error">
                  Try one more time, Tangi. ♡    
                </p>
              )}
              <button className="primary toy-button" type="submit"><ButtonStuds/>
                {question === 2 ? "Check My Answer ♡" : "Next →"}
              </button>
            </form>
          )}
        </section>
      )}
      {stage === "memories" && (
        <section className="memories fade-in">
          <h1>
            Our Little Memories <em>♡</em>
          </h1>
          <p>Pick a tulip, open a memory.</p>
          <div className="memory-count" aria-live="polite">
            <strong>
              {opened.length} / {memories.length}
            </strong>
            <span>memories opened</span>
          </div>
          <div className="bouquet">
            {memories.map((m, i) => (
              <button
                key={m.title}
                className={`tulip-button tulip-${i} ${opened.includes(i) ? "opened" : ""}`}
                aria-label={`Open memory ${i + 1}: ${m.title}`}
                onClick={() => openMemory(i)}
              >
                <Tulip pink={i % 2 === 0} />
                <span className="tulip-number">
                  {opened.includes(i) ? "♡" : i + 1}
                </span>
              </button>
            ))}
            <div className="vase">
          
              <b>♡</b>
            </div>
          </div>
          <p className="little-note">
            A bouquet of moments I never want to forget.
          </p>
          {opened.length === memories.length && (
            <button
              className="text-button"
              onClick={() => setPopup("complete")}
            >
              You found them all — see your surprise ♡
            </button>
          )}
        </section>
      )}
      {selected !== null && (
        <Modal label="Our memory" onClose={closeMemory}>
          <div className="polaroid">
            <img
              src={memories[selected].photo}
              alt={`Placeholder for ${memories[selected].title}`}
            />
            <span>a little moment of us ♡</span>
          </div>
          <h2>{memories[selected].title}</h2>
          <p>{memories[selected].caption}</p>
          <div className="memory-controls">
            <button
              aria-label="Previous memory"
              onClick={() => openMemory((selected + 6) % 7)}
            >
              ←
            </button>
            <span>
              {selected + 1} / {memories.length}
            </span>
            <button
              aria-label="Next memory"
              onClick={() => openMemory((selected + 1) % 7)}
            >
              →
            </button>
          </div>
        </Modal>
      )}
      {popup === "complete" && (
        <Modal label="You Found Them All!" onClose={() => setPopup(null)}>
          <div className="completion-heart">♡</div>
          <h2>Thank you for going through all our little memories!</h2>
          {/* <p>Thank you for going through all our little memories.</p> */}
          <button className="primary" onClick={() => setPopup("qr")}>
            Reveal My Last Surprise ♡
          </button>
        </Modal>
      )}
      {popup === "qr" && (
        <Modal label="One Last Clue" onClose={() => setPopup(null)}>
          <p>Scan this with your phone.</p>
          <div className="qr-code">
            {origin && (
              <QRCodeSVG
                value={origin + "/lego"}
                size={208}
                level="M"
                marginSize={4}
                title="Open the LEGO Love Puzzle"
              />
            )}
          </div>
          <p className="qr-note">I made it simple lang, I hope you like it!</p>
          <a className="text-button" href="/lego">
            Open Puzzle Here <span>↗</span>
          </a>
        </Modal>
      )}
    </main>
  );
}
