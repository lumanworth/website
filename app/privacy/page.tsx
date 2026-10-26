import type { Metadata } from "next";
import { OG_BASE } from "@/lib/meta";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Lumanworth handles the information people send us and what this website collects.",
  alternates: { canonical: "/privacy" },
  openGraph: { ...OG_BASE, title: "Privacy, Lumanworth", description: "How Lumanworth handles the information people send us and what this website collects.", url: "/privacy" },
};

export default function Privacy() {
  return (
    <main id="main" className="prose">
      <h1>Privacy</h1>
      <p className="date">Last updated 25 October 2026</p>
      <p>Lumanworth is a software company in Perth, Western Australia. This page says what we collect, why, and what you can ask of us. We handle personal information in line with the Australian Privacy Principles.</p>

      <h2>What this website collects</h2>
      <p>Nothing on its own. This site sets no cookies and runs no analytics or tracking. The fonts are served from our own site, not from a third party. One service sees your visit: the site is served by Vercel, which receives your IP address and browser details to deliver the page and keeps standard server logs for a short time for security. We do not use those logs to identify you.</p>
      <p>The light and dark setting is kept in your own browser only, so the page remembers your choice. It is not sent to us.</p>

      <h2>What you send us</h2>
      <p>When you use the form or email us, we keep your name, your email address, your company if you gave it, and what you wrote. The form is delivered to our mailbox through an email delivery service, which handles the message only to deliver it. The hosting and the email delivery service both run outside Australia, so what you send through this site may be handled overseas by those two services, and only for those purposes. If you name the person who sent you, we use that only to thank them.</p>
      <p>If we go on to work together, we keep what the work needs: your contact details, the documents you share, and the records of the engagement.</p>

      <h2>How we use it</h2>
      <p>To reply, to do the work, and to keep the records a business must keep. We do not sell information and we do not use it for advertising. We share it only with the services we run the business on, such as email hosting and accounting, and when the law requires it.</p>

      <h2>How long we keep it</h2>
      <p>Enquiries that go nowhere are deleted within a year. Records of work we have done are kept for as long as Australian tax and company law requires, then deleted.</p>

      <h2>The products we build</h2>
      <p>Each app and system we build for a client belongs to that client and has its own privacy policy, published by them. This page covers lumanworth.com and what you send us, nothing more.</p>

      <h2>Your rights</h2>
      <p>You can ask what we hold about you, ask us to correct it, or ask us to delete it. Write to <a href="mailto:support@lumanworth.com">support@lumanworth.com</a> and we will answer. If you are not satisfied with our answer you can complain to the Office of the Australian Information Commissioner at oaic.gov.au.</p>
    </main>
  );
}
