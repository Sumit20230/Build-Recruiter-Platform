import { BriefcaseBusiness, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import { UI_STRINGS } from "@/lib/constants";

export function RoleSelector({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  const options: { role: Role; title: string; body: string; icon: typeof BriefcaseBusiness }[] = [
    { role: "recruiter", title: UI_STRINGS.ROLE_RECRUITER, body: UI_STRINGS.ROLE_RECRUITER_DESC, icon: BriefcaseBusiness },
    { role: "jobseeker", title: UI_STRINGS.ROLE_JOBSEEKER, body: UI_STRINGS.ROLE_JOBSEEKER_DESC, icon: Search },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.role === value;
        return (
          <button
            type="button"
            key={option.role}
            onClick={() => onChange(option.role)}
            className={cn("rounded-lg border p-4 text-left transition", active ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300")}
          >
            <Icon className={cn("mb-3 h-5 w-5", active ? "text-teal-700" : "text-slate-500")} />
            <p className="font-medium text-slate-950">{option.title}</p>
            <p className="mt-1 text-sm text-slate-600">{option.body}</p>
          </button>
        );
      })}
    </div>
  );
}
