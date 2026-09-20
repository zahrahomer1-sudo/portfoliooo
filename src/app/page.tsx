import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Studio from "@/components/Studio";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { hero, projects, site } from "@/content/site";
import { mediaExists } from "@/lib/media";

export default function Home() {
  const available: Record<string, boolean> = {};
  for (const project of projects) {
    if (project.image) available[project.image] = mediaExists(project.image);
    if (project.preview) available[project.preview] = mediaExists(project.preview);
  }

  return (
    <>
      <Preloader />
      <Nav />
      <main id="main">
        <Hero hasVideo={mediaExists(hero.video)} hasPoster={mediaExists(hero.poster)} />
        <About />
        <Work available={available} />
        <Services />
        <Studio />
        <Process />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: site.name,
            jobTitle: site.role,
            url: site.url,
            email: site.email,
          }),
        }}
      />
    </>
  );
}
