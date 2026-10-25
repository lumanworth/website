"use client";

import { useState } from "react";
import { WHEN } from "@/lib/contact";
import { NEXT } from "@/lib/words";
import Arrow from "./Arrow";

type State = "idle" | "sending" | "sent" | "unavailable" | "failed";

const messages: Record<State, string> = {
  idle: "",
  sending: "Sending.",
  sent: "Thank you. We will reply within one business day.",
  unavailable: "The form is not connected yet. Please email support@lumanworth.com.",
  failed: "That did not send. Please email support@lumanworth.com.",
};

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setState("sending");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (r.ok) {
        setState("sent");
        form.reset();
      } else if (r.status === 503) setState("unavailable");
      else setState("failed");
    } catch {
      setState("failed");
    }
  };

  return (
    <section className="ct band tb" id="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <div>
          <h2 className="s" id="contact-h" data-r>Start a project</h2>
          <p className="lede" data-r>Tell us what you need. We aim to reply within one business day.</p>
          <p className="nexth" id="next-h" data-r>What happens next</p>
          <ol className="next" aria-labelledby="next-h" data-r>
            {NEXT.map((n, i) => <li key={n}><span className="mono" aria-hidden="true">{i + 1}</span>{n}</li>)}
          </ol>
        </div>
        <div data-r>
          <form className="form" onSubmit={onSubmit} noValidate>
            <label>Name<input className="field" name="name" autoComplete="name" required maxLength={120} /></label>
            <label>Company<input className="field" name="org" autoComplete="organization" maxLength={200} /></label>
            <label className="full">Email<input className="field" name="email" type="email" autoComplete="email" required maxLength={200} /></label>
            <label className="full">What do you need<textarea className="field" name="what" required maxLength={4000} /></label>
            <label>When do you need it
              <select className="field" name="when" defaultValue={WHEN[0]}>
                {WHEN.map((w) => <option key={w}>{w}</option>)}
              </select>
            </label>
            <label><span>Who sent you <span className="opt">(optional)</span></span><input className="field" name="ref" maxLength={200} /></label>
            <div className="hp" aria-hidden="true">
              <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <div className="formfoot">
              <button className="btn" type="submit" disabled={state === "sending"}>Send<Arrow /></button>
              <small aria-live="polite">
                {state === "idle" ? (
                  <>Your details are used only to reply to you. <a href="/privacy">Privacy policy</a>.</>
                ) : (
                  messages[state]
                )}
              </small>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
