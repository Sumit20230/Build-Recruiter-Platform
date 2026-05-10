import { FormEvent, useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAboutRecruiter } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { AI_STARTERS, UI_STRINGS } from "@/lib/constants";
import type { JobPosting, Profile, WorkExperience } from "@/types";

type Message = { role: "user" | "model"; parts: string };

export function AiChatPanel({ profile, work, jobs }: { profile: Profile; work: WorkExperience[]; jobs: JobPosting[] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);

  const context = useMemo(() => {
    const workText = work.map((item) => `${item.title} at ${item.company}: ${item.description || "No description"}`).join("\n");
    const jobText = jobs.map((job) => `${job.title} (${job.job_type || "type unknown"}, ${job.location || "location unknown"}): Skills ${(job.skills ?? []).join(", ")}. ${job.description || ""}`).join("\n");
    return `Name: ${profile.full_name}
Headline: ${profile.headline}
Company: ${profile.company}
Location: ${profile.location}
Bio: ${profile.bio}
Work experience:
${workText || "No work experience listed."}
Active job postings:
${jobText || "No active jobs listed."}`;
  }, [jobs, profile, work]);

  async function send(message: string) {
    if (!message.trim()) return;
    const next = [...messages, { role: "user" as const, parts: message }];
    setMessages(next);
    setBusy(true);
    try {
      const answer = await askAboutRecruiter(context, messages.slice(-10), message);
      setMessages([...next, { role: "model", parts: answer }]);
    } catch (error) {
      setMessages([...next, { role: "model", parts: error instanceof Error ? error.message : "I could not answer right now." }]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = new FormData(form).get("message");
    form.reset();
    void send(String(input || ""));
  }

  return (
    <>
      <Button className="fixed bottom-5 right-5 z-50 shadow-soft" variant="accent" onClick={() => setOpen(true)}>
        <MessageCircle className="h-4 w-4" />
        Ask AI about {profile.full_name?.split(" ")[0] || "this recruiter"}
      </Button>
      <aside className={cn("fixed bottom-5 right-5 z-[60] flex h-[min(620px,calc(100vh-2rem))] w-[calc(100%-2rem)] max-w-md flex-col rounded-lg border border-slate-200 bg-white shadow-soft transition", open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0")}>
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-teal-700" />
            <div>
              <h2 className="font-semibold text-slate-950">{UI_STRINGS.AI_CHAT_TITLE}</h2>
              <p className="text-xs text-slate-500">{UI_STRINGS.AI_CHAT_SUBTITLE}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label={UI_STRINGS.ARIA_CLOSE}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {!messages.length ? (
            <div className="grid gap-2">
              {AI_STARTERS.map((starter) => (
                <button key={starter} onClick={() => send(starter)} className="rounded-md border border-slate-200 p-3 text-left text-sm transition hover:border-teal-300 hover:bg-teal-50">
                  {starter}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={cn("max-w-[85%] rounded-lg p-3 text-sm leading-6", message.role === "user" ? "ml-auto bg-primary text-white" : "bg-slate-100 text-slate-800")}>
                  {message.parts}
                </div>
              ))}
              {busy ? <div className="w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">{UI_STRINGS.THINKING}</div> : null}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-4">
          <Input name="message" placeholder={UI_STRINGS.CHAT_PLACEHOLDER} disabled={busy} />
          <Button size="icon" variant="accent" disabled={busy} aria-label={UI_STRINGS.ARIA_SEND}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </aside>
    </>
  );
}
