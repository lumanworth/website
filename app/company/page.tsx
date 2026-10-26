import type { Metadata } from "next";
import "./company.css";
import Scope from "@/components/Scope";

export const metadata: Metadata = {
  title: "Company",
  description: "A small software company in Perth. Two jobs at a time, a senior engineer on each, and what we take on and turn down.",
  alternates: { canonical: "/company" },
  openGraph: {
    title: "Company, Lumanworth",
    description: "A small software company in Perth. We build business systems, apps and websites, and hand every one of them over.",
    url: "/company",
  },
};

/* Company, from mock v10 r2 (accepted 26 Oct 2026). Roles only, no names. Three sections and the footer: tb, ta, tb, so the footer (ta) closes the alternation.
   The ABN reads On registration until the company is registered. */
export default function Company() {
  return (
    <main id="main" className="cp">
      <section className="phead tb" aria-labelledby="h1">
        <div className="wrap">
          <div>
            <h1 className="t1" id="h1" data-r>Company</h1>
            <p data-r>A small software company in Perth. We build business systems, apps and websites, and hand every one of them over.</p>
          </div>
          <dl className="facts" data-r>
            <div><dt>Company</dt><dd>Lumanworth Pty Ltd</dd></div>
            <div><dt>ABN</dt><dd>On registration</dd></div>
            <div><dt>Based in</dt><dd>Perth, Western Australia</dd></div>
            <div><dt>Email</dt><dd><a href="mailto:support@lumanworth.com">support@lumanworth.com</a></dd></div>
          </dl>
        </div>
      </section>

      <section className="small band ta" aria-labelledby="s-h">
        <div className="wrap">
          <h2 className="s" id="s-h" data-r>Two jobs at a time.</h2>
          <div data-r>
            <p>A senior engineer runs each job from the first meeting to handover. The person you meet is the person who builds yours, and the one who answers when you ask.</p>
            <p>AI is a tool here, used the way a good engineer uses any tool. It drafts and checks under direction. Nothing merges or goes live without a person reading it and approving it.</p>
          </div>
        </div>
      </section>

      <Scope />
    </main>
  );
}
