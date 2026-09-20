import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="shell rule flex flex-wrap items-baseline justify-between gap-y-4 py-10">
      <span className="label text-ink-30">
        © {new Date().getFullYear()} {site.name}
      </span>
      <a href={`mailto:${site.email}`} className="label text-ink-55">
        {site.email}
      </a>
    </footer>
  );
}
