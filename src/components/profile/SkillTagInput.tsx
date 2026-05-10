import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UI_STRINGS } from "@/lib/constants";

export function SkillTagInput({ value, onChange }: { value: string[]; onChange: (skills: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function addSkill(raw: string) {
    const skill = raw.trim();
    if (!skill) return;
    if (value.some((item) => item.toLowerCase() === skill.toLowerCase())) return;
    onChange([...value, skill]);
  }

  function commitDraft() {
    addSkill(draft);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
    }
    if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
        {value.map((skill) => (
          <Badge key={skill} className="gap-1 bg-slate-100 text-slate-700">
            {skill}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 rounded-sm p-0 hover:bg-slate-200"
              onClick={() => onChange(value.filter((item) => item !== skill))}
              aria-label={`Remove ${skill}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          value={draft}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (nextValue.includes(",")) {
              nextValue.split(",").forEach(addSkill);
              setDraft("");
            } else {
              setDraft(nextValue);
            }
          }}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={value.length ? UI_STRINGS.SKILL_TAG_ADD_ANOTHER : UI_STRINGS.SKILL_TAG_PLACEHOLDER}
          className="h-7 min-w-40 flex-1 border-0 px-0 py-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <p className="text-xs text-slate-500">{UI_STRINGS.SKILL_TAG_HINT}</p>
    </div>
  );
}
