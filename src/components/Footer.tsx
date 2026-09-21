import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="shell rule flex flex-wrap items-baseline justify-between gap-y-4 py-10">
      <span className="label text-paper-25">
        © {new Date().getFullYear()} {site.name}
      </span>
      <a href={`mailto:${site.email}`} className="label text-paper-45">
        {site.email}
      </a>
    </footer>
  );
}
