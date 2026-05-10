import { Input } from "@/components/ui/input";
import { UI_STRINGS } from "@/lib/constants";

export interface Filters {
  company: string;
  location: string;
  jobType: string;
}

export function FilterBar({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Input placeholder={UI_STRINGS.DISCOVER_FILTER_COMPANY} value={filters.company} onChange={(event) => onChange({ ...filters, company: event.target.value })} />
      <Input placeholder={UI_STRINGS.DISCOVER_FILTER_LOCATION} value={filters.location} onChange={(event) => onChange({ ...filters, location: event.target.value })} />
      <Input placeholder={UI_STRINGS.DISCOVER_FILTER_JOB_TYPE} value={filters.jobType} onChange={(event) => onChange({ ...filters, jobType: event.target.value })} />
    </div>
  );
}
