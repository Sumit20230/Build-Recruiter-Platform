import { CheckCircle2, XCircle } from "lucide-react";
import { create } from "zustand";
import { cn } from "@/lib/utils";

type Toast = { id: string; title: string; description?: string; variant?: "success" | "error" };

const useToastStore = create<{
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
}>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }));
    window.setTimeout(() => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })), 4200);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
}));

export const toast = (toast: Omit<Toast, "id">) => useToastStore.getState().push(toast);

export function Toaster() {
  const { toasts, remove } = useToastStore();
  return (
    <div className="fixed right-4 top-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((item) => {
        const isError = item.variant === "error";
        const Icon = isError ? XCircle : CheckCircle2;
        return (
          <button
            key={item.id}
            onClick={() => remove(item.id)}
            className={cn("rounded-lg border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5", isError ? "border-red-200" : "border-teal-200")}
          >
            <div className="flex gap-3">
              <Icon className={cn("mt-0.5 h-5 w-5", isError ? "text-red-600" : "text-teal-600")} />
              <div>
                <p className="font-medium text-slate-900">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm text-slate-600">{item.description}</p> : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
