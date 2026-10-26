import type { Metadata } from "next";
import Arrow from "@/components/Arrow";
import Ask from "@/components/Ask";
import Mapped from "@/components/Mapped";
import Record from "@/components/Record";
import Signal from "@/components/Signal";

export const metadata: Metadata = {
  title: "What we do",
  description: "Business systems, workflow and consulting, AI in the workflow, websites and apps. Built, checked and handed over.",
  alternates: { canonical: "/what" },
  openGraph: {
    title: "What we do, Lumanworth",
    description: "Four kinds of work. Most jobs touch more than one.",
    url: "/what",
  },
};

const More = () => <a className="more" href="/#contact" data-r>Talk to us about this<Arrow /></a>;

/* What we do, from mock v10 r3 (accepted 26 Oct 2026). Head and four kinds of work, each with one small working example.
   Tones tb, ta, tb, ta, tb, so the footer (ta) closes the alternation. Sample names only. */
export default function What() {
  return (
    <main id="main" className="wd">
      <section className="phead tb" aria-labelledby="h1">
        <div className="wrap">
          <div>
            <h1 className="t1" id="h1" data-r>What we do</h1>
            <p className="lede" data-r>Four kinds of work. Most jobs touch more than one.</p>
          </div>
          <ul className="idx" data-r>
            <li><a href="#sys">Business systems</a></li>
            <li><a href="#flow">Workflow and consulting</a></li>
            <li><a href="#ai">AI in the workflow</a></li>
            <li><a href="#web">Websites and apps</a></li>
          </ul>
        </div>
      </section>

      <section className="kind band ta" id="sys" aria-labelledby="sys-h">
        <div className="wrap split">
          <div>
            <h2 className="s" id="sys-h" data-r>Business systems.</h2>
            <p className="lede" data-r>The software the whole company runs on.</p>
            <p className="p" data-r>Offline first. Every change is written on the device, queued, and synced when signal returns, with conflicts settled by rule rather than by whoever saved last.</p>
            <p className="p" data-r>Access by role, down to the record. An audit log that only ever grows, so every record shows who did what, and when.</p>
            <More />
          </div>
          <Record />
        </div>
      </section>

      <section className="kind band tb" id="flow" aria-labelledby="flow-h">
        <div className="wrap">
          <div className="wtop">
            <div>
              <h2 className="s" id="flow-h" data-r>Workflow and consulting.</h2>
              <p className="lede" data-r>How work moves, and what wastes it.</p>
            </div>
            <div>
              <p className="p" data-r>Every build starts here. We map the process as it actually runs, time each step, and take steps out before we write any code. Often the best change is a deletion.</p>
              <More />
            </div>
          </div>
          <Mapped />
        </div>
      </section>

      <section className="kind band ta" id="ai" aria-labelledby="ai-h">
        <div className="wrap split flip">
          <Ask />
          <div>
            <h2 className="s" id="ai-h" data-r>AI in the workflow.</h2>
            <p className="lede" data-r>Answers from your own records, with the source.</p>
            <p className="p" data-r>Retrieval over your own manuals and job history, with a citation on every answer and a check that refuses to answer without one. A person still makes the call.</p>
            <p className="p" data-r>If your team already uses AI, we come in, tune how it is used, measure it against your own work, and teach your people to get more from it.</p>
            <More />
          </div>
        </div>
      </section>

      <section className="kind wsite band tb" id="web" aria-labelledby="web-h">
        <div className="wrap">
          <div className="top">
            <h2 className="s" id="web-h" data-r>Websites and apps.</h2>
            <p className="lede" data-r>The front door, and the tools behind it.</p>
            <p className="p" data-r>Company sites, customer portals and phone apps. Rendered on the server and built to WCAG 2.2 AA. The words arrive first, so the page reads on one bar of signal before the pictures land.</p>
          </div>
          <Signal />
          <div className="close" data-r>
            <p>Not sure which kind? <span>Most jobs start with one meeting about your work.</span></p>
            <a className="btn" href="/#contact">Start a project<Arrow /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
