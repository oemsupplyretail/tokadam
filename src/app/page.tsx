import { Benefits } from "@/components/Benefits";
import { Credentials } from "@/components/Credentials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Ingredients } from "@/components/Ingredients";
import { Intro } from "@/components/Intro";
import { Packages } from "@/components/Packages";
import { Problems } from "@/components/Problems";
import { RotatingIcon } from "@/components/RotatingIcon";
import { Testimonials } from "@/components/Testimonials";
import { Tutorial } from "@/components/Tutorial";
import { site } from "@/config/site";
import { theme, themeVariables } from "@/config/theme";
import { homeContent } from "@/content/home";
import { benefits } from "@/data/benefits";
import { faqs } from "@/data/faq";
import { ingredients } from "@/data/ingredients";
import { packages } from "@/data/packages";
import { problems, worries } from "@/data/problems";
import { testimonials } from "@/data/testimonials";

export default function Home() {
  return <main style={themeVariables}>
    <Hero content={homeContent.hero} logo={theme.logo} cta={homeContent.cta} />
    <Intro content={homeContent.intro} />
    <Problems content={homeContent.problems} items={problems} worriesContent={homeContent.worries} worries={worries} cta={homeContent.cta} />
    <Ingredients content={homeContent.product} items={ingredients} cta={homeContent.cta} />
    <Benefits content={homeContent.benefits} items={benefits} />
    <Tutorial content={homeContent.tutorial} videoUrl={site.links.tutorialVideo} cta={homeContent.cta} />
    <Credentials content={homeContent.credentials} />
    <Testimonials content={homeContent.testimonials} items={testimonials} rating={homeContent.testimonials.rating} />
    <Packages content={homeContent.packages} items={packages} />
    <FAQ content={homeContent.faq} items={faqs} />
    <Footer content={homeContent.footer} whatsapp={site.whatsapp} />
    <RotatingIcon content={homeContent.rotatingIcon} />
  </main>;
}
