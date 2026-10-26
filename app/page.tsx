import Hero from "@/components/Hero";
import Kinds from "@/components/Kinds";
import Steps from "@/components/Steps";
import Yours from "@/components/Yours";
import Questions from "@/components/Questions";
import ContactForm from "@/components/ContactForm";

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
