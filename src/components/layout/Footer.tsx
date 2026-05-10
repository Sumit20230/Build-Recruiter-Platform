import { UI_STRINGS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>{UI_STRINGS.FOOTER_TAGLINE}</p>
        <p>{UI_STRINGS.FOOTER_BUILT_WITH}</p>
      </div>
    </footer>
  );
}
