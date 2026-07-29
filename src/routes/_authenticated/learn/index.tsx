import { createFileRoute } from "@tanstack/react-router";
import { LanguagePicker } from "@/components/nisqai/LanguagePicker";

export const Route = createFileRoute("/_authenticated/learn/")({
  head: () => ({
    meta: [
      { title: "Choose a language | NISQAI" },
      {
        name: "description",
        content: "Choose French, German, Spanish, Hindi or Japanese and start an AI lesson.",
      },
      { property: "og:title", content: "Choose a language | NISQAI" },
      {
        property: "og:description",
        content: "Choose French, German, Spanish, Hindi or Japanese and start an AI lesson.",
      },
    ],
  }),
  component: () => (
    <div>
      <h1 className="text-3xl">Choose a language</h1>
      <p className="mt-1 text-muted-foreground">Your lessons are generated fresh for each topic.</p>
      <div className="mt-5">
        <LanguagePicker />
      </div>
    </div>
  ),
});
