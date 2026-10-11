"use client";

import { CalendarDays } from "lucide-react";
import { useId, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-2xl border border-line bg-white px-4 text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-pebble hover:border-line-strong focus:border-ink focus:ring-4 focus:ring-sky/60 aria-[invalid=true]:border-dusk-ink";

export function Field({ label, name, error, hint, optional, className, ...props }: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {optional && <span className="font-normal text-stone">(optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={cn(control, "h-12")}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-dusk-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({ label, name, error, optional, className, ...props }: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {optional && <span className="font-normal text-stone">(optional)</span>}
      </label>
      <textarea id={id} name={name} rows={4} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cn(control, "resize-y py-3")} {...props} />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-dusk-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export type Option = { value: string; label: string };

/** shadcn/ui (Radix) select styled as an Arise form field. Submits through a hidden native select. */
export function SelectField({ label, name, error, className, options, placeholder, defaultValue, onValueChange }: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  options: Option[];
  placeholder?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <Select name={name} defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger id={id} data-field={name} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-dusk-ink">
          {error}
        </p>
      )}
    </div>
  );
}

const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * Today is read here, inside the popover, so it only runs in the browser once the calendar is
 * open: the pages are prerendered, and reading the clock during prerender is not allowed.
 */
function FutureCalendar({ selected, onSelect }: { selected?: Date; onSelect: (d?: Date) => void }) {
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={onSelect}
      disabled={{ before: new Date() }}
      weekStartsOn={1}
      autoFocus
      className="[--cell-size:--spacing(10)]"
    />
  );
}

/** Date picker: a calendar in a popover, submitting yyyy-mm-dd through a hidden input. */
export function DateField({ label, name, error, className, placeholder = "Choose a day", onValueChange }: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
}) {
  const id = useId();
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input type="hidden" name={name} value={date ? toIso(date) : ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            data-field={name}
            data-invalid={!!error || undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            className={cn(
              control,
              "data-[invalid]:border-dusk-ink",
              "group/trigger flex h-12 cursor-pointer items-center justify-between gap-2 text-left data-[state=open]:border-ink",
              !date && "text-stone",
            )}
          >
            {date ? date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : placeholder}
            <CalendarDays className="size-4 shrink-0 text-stone" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2">
          <FutureCalendar
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
              onValueChange?.(d ? toIso(d) : "");
            }}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-dusk-ink">
          {error}
        </p>
      )}
    </div>
  );
}
