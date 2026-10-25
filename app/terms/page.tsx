import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms on which you may use the Lumanworth website.",
};

export default function Terms() {
  return (
    <main id="main" className="prose">
      <h1>Terms of use</h1>
      <p className="date">Last updated 25 October 2026</p>
      <p>These terms cover your use of lumanworth.com. They do not cover work we do for clients, which is governed by the written agreement for that work. By using this site you accept these terms.</p>

      <h2>What this site is for</h2>
      <p>The site describes what Lumanworth does and gives you a way to contact us. The information on it is general. It is not advice for your situation, and nothing on it is an offer or a quote. Prices, dates and scope are agreed only in writing for each job.</p>

      <h2>Using the site</h2>
      <p>You may read the site, link to it and share its pages. You may not copy its text, images or design for your own commercial use, present them as your own, or use the site or the contact form in a way that is unlawful, misleading, or interferes with its operation or with other people.</p>

      <h2>Ownership</h2>
      <p>The text, design, logo and code of this site belong to Lumanworth unless marked otherwise. The name Lumanworth and the three bar symbol are ours and may not be used without our written permission.</p>

      <h2>Contact form and email</h2>
      <p>What you send us through the form or by email is handled as set out in our <a href="/privacy">privacy policy</a>. Sending an enquiry does not create an engagement, and we are not obliged to take on any work. Please do not send confidential or sensitive material before we have agreed to work together.</p>

      <h2>Links to other sites</h2>
      <p>Where the site links to another website, we do not control that site and are not responsible for what is on it.</p>

      <h2>Accuracy and availability</h2>
      <p>We try to keep the site accurate and available, but we do not promise that it will be either at any given moment. We may change or remove any part of it without notice.</p>

      <h2>Liability</h2>
      <p>To the extent the law allows, Lumanworth is not liable for any loss arising from your use of this site or reliance on anything on it. Nothing in these terms limits rights you have under the Australian Consumer Law that cannot be excluded.</p>

      <h2>Law</h2>
      <p>These terms are governed by the law of Western Australia, and the courts of Western Australia have jurisdiction over any dispute about them.</p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date at the top shows the current version.</p>

      <h2>Contact</h2>
      <p>Questions about these terms go to <a href="mailto:support@lumanworth.com">support@lumanworth.com</a>.</p>
    </main>
  );
}
