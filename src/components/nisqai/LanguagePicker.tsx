import { Link } from "@tanstack/react-router";
import { LANGUAGES } from "@/lib/nisqai";

export function LanguagePicker() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {LANGUAGES.map((lang) => (
        <Link
          key={lang.code}
          to="/learn/$code"
          params={{ code: lang.code }}
          className="card-soft flex items-start gap-4 p-4 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
        >
          <span className="text-3xl">{lang.flag}</span>
          <span className="min-w-0">
            <span className="block font-display text-lg font-extrabold">{lang.name}</span>
            <span className="block text-sm text-muted-foreground">{lang.nativeName}</span>
            <span className="mt-2 block text-sm text-muted-foreground">{lang.description}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
