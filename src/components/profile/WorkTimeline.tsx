import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateRange, initials } from "@/lib/utils";
import { UI_STRINGS } from "@/lib/constants";
import type { WorkExperience } from "@/types";

export function WorkTimeline({ items }: { items: WorkExperience[] }) {
  if (!items.length) {
    return <EmptyState icon={Building2} title={UI_STRINGS.EMPTY_WORK_TITLE} description={UI_STRINGS.EMPTY_WORK_DESC} />;
  }

  return (
    <div className="relative grid gap-5 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-slate-200">
      {items.map((item) => (
        <article key={item.id} className="relative flex gap-4">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            {item.company ? initials(item.company) : <Building2 className="h-4 w-4" />}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-slate-950">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.company} · {formatDateRange(item.start_date, item.end_date)}</p>
            {item.description ? <p className="mt-3 text-sm leading-6 text-slate-700">{item.description}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
