"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { contactSteps, site, type ContactStep } from "@/content/site";

type Answers = Record<string, string>;
type Status = "idle" | "sending" | "sent" | "unconfigured" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Conversational enquiry: one question at a time, keyboard first.
 *
 * Enter advances a single-line answer, Cmd/Ctrl+Enter advances a long one, and
 * number keys pick a choice. Nothing submits until the final review, so a
 * half-finished thought never lands in an inbox.
 */
export default function Contact() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [reviewing, setReviewing] = useState(false);
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const startedAt = useRef<number>(0);
  const engaged = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const step = contactSteps[index];
  const value = answers[step.id] ?? "";
  const total = contactSteps.length;

  useEffect(() => {
    // Records when the form was first rendered, for the bot timing check.
    if (startedAt.current === 0) startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    // Never on first paint: focusing a field mid-page scrolls the visitor
    // straight past the work to the form. Only follow the conversation once
    // they have actually started it, and never yank the viewport.
    if (!engaged.current) return;
    if (!reviewing) fieldRef.current?.focus({ preventScroll: true });
  }, [index, reviewing]);

  function validate(current: ContactStep, v: string): string | null {
    const trimmed = v.trim();
    if (!trimmed && current.optional) return null;
    if (!trimmed) return current.required_message ?? "This one is needed.";
    if (current.type === "email" && !EMAIL.test(trimmed))
      return current.required_message ?? "That address does not look right.";
    return null;
  }

  function advance() {
    engaged.current = true;
    const problem = validate(step, value);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    if (index + 1 < total) setIndex(index + 1);
    else setReviewing(true);
  }

  function back() {
    setError(null);
    if (reviewing) setReviewing(false);
    else if (index > 0) setIndex(index - 1);
  }

  function set(v: string) {
    engaged.current = true;
    setAnswers((a) => ({ ...a, [step.id]: v }));
    if (error) setError(null);
  }

  async function submit() {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          // Bots fill hidden fields and submit faster than people read.
          trap: honeypot.current?.value ?? "",
          elapsed: startedAt.current ? Date.now() - startedAt.current : 0,
        }),
      });
      if (res.ok) setStatus("sent");
      else if (res.status === 501) setStatus("unconfigured");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Project enquiry: ${answers.name ?? ""}`,
  )}&body=${encodeURIComponent(
    contactSteps
      .map((s) => `${s.question}\n${answers[s.id] || "Not given"}`)
      .join("\n\n"),
  )}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="shell rule py-24 sm:py-36"
    >
      <h2
        id="contact-heading"
        className="display text-[clamp(2.5rem,7vw,5.5rem)]"
      >
        Start something
      </h2>

      <div className="mt-14 grid grid-cols-12 gap-x-6">
        <div className="glass col-span-12 p-6 sm:p-10 lg:col-span-9">
          {status === "sent" ? (
            <Resolved
              title="That is with me."
              body={`I read everything myself and reply within a couple of days. If it is urgent, ${site.email} reaches me faster.`}
            />
          ) : status === "unconfigured" ? (
            <Resolved
              title="Nearly. Delivery is not wired up yet."
              body="This site has no mail service connected, so nothing was sent. Your answers are ready in an email instead."
              action={{ href: mailto, label: "Open the prefilled email" }}
            />
          ) : (
            <>
              <div className="mb-8 flex items-center gap-4">
                <span className="label-caps text-paper-25" aria-hidden="true">
                  {String(Math.min(index + 1, total)).padStart(2, "0")} / {total}
                </span>
                <div
                  className="h-px flex-1 bg-paper-12"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={total}
                  aria-valuenow={index + 1}
                  aria-label="Question progress"
                >
                  <motion.div
                    className="h-px bg-cherry"
                    initial={false}
                    animate={{
                      width: `${((reviewing ? total : index + 1) / total) * 100}%`,
                    }}
                    transition={{
                      duration: reduced ? 0 : 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={reviewing ? "review" : step.id}
                  initial={reduced ? undefined : { opacity: 0, y: 14 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {reviewing ? (
                    <Review
                      answers={answers}
                      onEdit={(i) => {
                        setReviewing(false);
                        setIndex(i);
                      }}
                    />
                  ) : (
                    <Question
                      step={step}
                      value={value}
                      error={error}
                      fieldRef={fieldRef}
                      onChange={set}
                      onAdvance={advance}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div aria-live="polite" className="sr-only">
                {reviewing
                  ? "Review your answers"
                  : `Question ${index + 1} of ${total}. ${step.question}`}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                {index > 0 || reviewing ? (
                  <button type="button" onClick={back} className="label-caps cursor-pointer border-0 bg-transparent p-0 text-paper-45 underline underline-offset-4">
                    Back
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={reviewing ? submit : advance}
                  disabled={status === "sending"}
                  className="cta cursor-pointer border-0 bg-cherry px-8 py-4 text-white transition-colors duration-300 hover:bg-wine disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="label-caps">
                    {reviewing
                      ? status === "sending"
                        ? "Sending"
                        : "Send it"
                      : index + 1 === total
                        ? "Review"
                        : "Next"}
                  </span>
                </button>

                {!reviewing && step.optional ? (
                  <button type="button" onClick={advance} className="label-caps cursor-pointer border-0 bg-transparent p-0 text-paper-25 underline underline-offset-4">
                    Skip
                  </button>
                ) : null}

                {status === "error" ? (
                  <p role="alert" className="basis-full text-[0.9375rem] text-cherry-soft">
                    That did not send. Try again, or email{" "}
                    <a href={mailto}>{site.email}</a> directly.
                  </p>
                ) : null}
              </div>

              {/* Honeypot. Hidden from people and from screen readers alike. */}
              <input
                ref={honeypot}
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-px w-px opacity-0"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Question({
  step,
  value,
  error,
  fieldRef,
  onChange,
  onAdvance,
}: {
  step: ContactStep;
  value: string;
  error: string | null;
  fieldRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onChange: (v: string) => void;
  onAdvance: () => void;
}) {
  const errorId = error ? `${step.id}-error` : undefined;
  const hintId = step.hint ? `${step.id}-hint` : undefined;
  const described = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label
        htmlFor={step.id}
        className="display block text-[clamp(1.75rem,4.5vw,3.25rem)]"
      >
        {step.question}
      </label>

      {step.hint ? (
        <p id={hintId} className="mt-3 text-[0.9375rem] text-paper-25">
          {step.hint}
        </p>
      ) : null}

      <div className="mt-8">
        {step.type === "choice" ? (
          <div
            id={step.id}
            role="group"
            aria-describedby={described}
            className="flex flex-wrap gap-3"
          >
            {step.options?.map((option, i) => {
              const selected = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange(option)}
                  onDoubleClick={onAdvance}
                  className={`cta cursor-pointer border px-5 py-3 text-[0.9375rem] transition-colors duration-200 ${
                    selected
                      ? "border-paper bg-paper text-ink"
                      : "border-paper-12 bg-transparent text-paper-70 hover:border-paper-45"
                  }`}
                >
                  <span className="mr-2 text-paper-25">{i + 1}</span>
                  {option}
                </button>
              );
            })}
          </div>
        ) : step.type === "longtext" ? (
          <textarea
            id={step.id}
            ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            rows={4}
            aria-describedby={described}
            aria-invalid={Boolean(error)}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onAdvance();
            }}
            className="w-full resize-none border-0 border-b border-paper-12 bg-transparent pb-3 text-[1.25rem] leading-relaxed outline-none transition-colors focus:border-cherry"
            placeholder="Type here"
          />
        ) : (
          <input
            id={step.id}
            ref={fieldRef as React.RefObject<HTMLInputElement>}
            type={step.type === "email" ? "email" : "text"}
            inputMode={step.type === "email" ? "email" : "text"}
            autoComplete={step.type === "email" ? "email" : "name"}
            value={value}
            aria-describedby={described}
            aria-invalid={Boolean(error)}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAdvance();
              }
            }}
            className="w-full border-0 border-b border-paper-12 bg-transparent pb-3 text-[clamp(1.25rem,3vw,1.75rem)] outline-none transition-colors focus:border-cherry"
            placeholder="Type here"
          />
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-4 text-[0.9375rem] text-cherry-soft">
          {error}
        </p>
      ) : null}

      <p className="mt-6 text-[0.8125rem] text-paper-25">
        {step.type === "longtext"
          ? "⌘ + Enter to continue"
          : step.type === "choice"
            ? "Pick one, then Next"
            : "Enter to continue"}
      </p>
    </div>
  );
}

function Review({
  answers,
  onEdit,
}: {
  answers: Answers;
  onEdit: (index: number) => void;
}) {
  return (
    <div>
      <h3 className="display text-[clamp(1.75rem,4.5vw,3.25rem)]">
        Look right?
      </h3>
      <dl className="mt-8 m-0">
        {contactSteps.map((s, i) => (
          <div key={s.id} className="border-t border-paper-12 py-4">
            <dt className="label-caps text-paper-25">{s.question}</dt>
            <dd className="m-0 mt-2 flex items-baseline justify-between gap-6">
              <span className="text-[1rem] leading-relaxed text-paper-70">
                {answers[s.id]?.trim() || "Not given"}
              </span>
              <button
                type="button"
                onClick={() => onEdit(i)}
                className="label-caps shrink-0 cursor-pointer border-0 bg-transparent p-0 text-paper-45 underline underline-offset-4"
              >
                Edit
              </button>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Resolved({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div>
      <p className="display text-[clamp(1.75rem,4.5vw,3.25rem)]">{title}</p>
      <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-paper-45">
        {body}
      </p>
      {action ? (
        <a
          href={action.href}
          className="cta mt-8 inline-block bg-cherry px-8 py-4 text-white no-underline transition-colors duration-300 hover:bg-wine"
        >
          <span className="label-caps">{action.label}</span>
        </a>
      ) : null}
    </div>
  );
}
