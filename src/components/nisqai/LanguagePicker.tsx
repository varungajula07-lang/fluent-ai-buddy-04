import { Link } from "@tanstack/react-router";
import { LANGUAGES } from "@/lib/nisqai";

export function LanguagePicker() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {LANGUAGES.map((lang) => (
        <Link
          key={lang.code}
          to="/learn/$code"
          params={{ code: lang.code }}
          className="card-soft flex items-center gap-4 p-4 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
        >
          <span className="text-3xl">{lang.flag}</span>
          <span>
            <span className="block font-display text-lg font-extrabold">{lang.name}</span>
            <span className="block text-sm text-muted-foreground">{lang.nativeName}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}