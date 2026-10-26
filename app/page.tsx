import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Kinds from "@/components/Kinds";
import Steps from "@/components/Steps";
import Yours from "@/components/Yours";
import Questions from "@/components/Questions";
import ContactForm from "@/components/ContactForm";
import { OG_BASE, TAGLINE } from "@/lib/meta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...OG_BASE, title: "Lumanworth", description: TAGLINE, url: "/" },
};

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Kinds />
      <Steps />
      <Yours />
      <Questions />
      <ContactForm />
    </main>
  );
}
