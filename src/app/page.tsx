import { Cities } from "@/components/home/cities";
import { Featured } from "@/components/home/featured";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { Levels } from "@/components/home/levels";
import { OwnersBand } from "@/components/home/owners-band";
import { Steps } from "@/components/home/steps";
import { Testimonials } from "@/components/home/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Featured />
      <Steps />
      <Levels />
      <Cities />
      <Testimonials />
      <OwnersBand />
    </>
  );
}
