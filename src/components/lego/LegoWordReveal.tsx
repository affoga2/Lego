"use client";

import { useEffect, useState } from "react";
import LegoBrick from "./LegoBrick";
import { letterPatterns } from "@/data/legoPuzzle";

const finalLetter = `Before anything else, I just want to apologize for being ME. I know I can be too much to handle sometimes, but despite everything, I will always be grateful that you chose to stay and remained patient with me.

I’m apologize for all the times I made you feel unappreciated, degraded, or compared. Though we both hurt each other and there were moments when we said things out of anger, crossed the line, and called each other names. I know we can’t take those moments back, but I’m sorry for the pain I caused you.

Tangi, even if I don't say it enough, I am genuinely proud of your progress, your growth, and the person you are becoming. I know how difficult your deployment will be, but wherever life takes you, you will always be in my prayers. I hope you continue becoming the person you aspire to be and achieve everything you've worked so hard for.

Tangi, me will always here lang supporting you kahit malayo and with or without me know that I will always wish you the best for your happiness, success, and wellbeing. May God bless you sa journey mo there and take care ikaw always.

Also, I will always be grateful for everything we shared, the good memories, the difficult ones, and all the lessons that came with them. I don't know what the future holds for the both of us, but I hope wherever life takes us, we can look back at what we had and remember that, at some point in our lives, we genuinely loved and cared for each other.

Once again, Happy Monthsary to us and early Happy Anniversary. Know that me will always love you! I will always be rooting for you from wherever I am. Be safe always, My Tangi!! <33

Sincerely,
Your little monster`;

export function BrickLetter({ letter }: { letter: string }) {
  const rows = letterPatterns[letter];
  return (
    <span className="brick-letter" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) => (
          <span key={`${y}-${x}`}>
            {cell === "1" && <LegoBrick width={1} height={1} color="white" />}
          </span>
        )),
      )}
    </span>
  );
}

export default function LegoWordReveal() {
  const [typedLetter, setTypedLetter] = useState("");
  const isDone = typedLetter.length >= finalLetter.length;

  useEffect(() => {
    let index = 0;
    const write = window.setInterval(() => {
      index += 1;
      setTypedLetter(finalLetter.slice(0, index));
      if (index >= finalLetter.length) window.clearInterval(write);
    }, 22);

    return () => window.clearInterval(write);
  }, []);

  return (
    <section className="word-reveal letter-reveal fade-in">
      <div className="letter-scene">
        <div className="vintage-envelope" aria-hidden="true">
          <span className="envelope-flap" />
          <span className="envelope-seal">♡</span>
        </div>
        <article className="old-letter" aria-live="polite">
          <span className="letter-date">For my Tangi,</span>
          <p>
            {typedLetter}
            {!isDone && <span className="type-caret" aria-hidden="true" />}
          </p>
        </article>
      </div>
      {isDone && (
        <a className="primary letter-return" href="/">
          Back to the Beginning
        </a>
      )}
    </section>
  );
}
