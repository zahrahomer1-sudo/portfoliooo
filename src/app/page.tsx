import CinematicBackdrop from "@/components/CinematicBackdrop";
import Preloader from "@/components/Preloader";
import FloatingNav from "@/components/FloatingNav";
import Cursor from "@/components/Cursor";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Album from "@/components/Album";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Studio from "@/components/Studio";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { album, hero, projects, site } from "@/content/site";
import { mediaExists } from "@/lib/media";

const navItems = [
  { name: "Album", link: "#album" },
  { name: "Work", link: "#work" },
  { name: "Services", link: "#services" },
  { name: "Studio", link: "#studio" },
];

export default function Home() {
  const available: Record<string, boolean> = {};
  for (const project of projects) {
    if (project.image) available[project.image] = mediaExists(project.image);
    if (project.preview) available[project.preview] = mediaExists(project.preview);
  }

  return (
    <>
      <Preloader />
      <FloatingNav items={navItems} />
      <Cursor />

      <main id="main">
        <CinematicBackdrop
          hasWebm={mediaExists(hero.video)}
          hasMp4={mediaExists(hero.videoMp4)}
          hasPoster={mediaExists(hero.poster)}
        >
          <Hero />
          <About />
        </CinematicBackdrop>

        <Album />
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
            knowsAbout: [
              "Photography",
              "Videography",
              "Brand and graphic design",
              "Web design and development",
              "Creative direction",
            ],
            mainEntityOfPage: { "@type": "WebPage", name: album.title },
          }),
        }}
      />
    </>
  );
}
