import { cn } from "@/lib/utils";

export function PageHeader({ title, intro, className, children }: { title: string; intro?: React.ReactNode; className?: string; children?: React.ReactNode }) {
  return (
    <header className={cn("bg-gradient-to-b from-sky-soft to-white pt-36 pb-14 sm:pt-44 sm:pb-20", className)}>
      <div className="container-x">
        <h1 className="display max-w-3xl text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[0.98]">{title}</h1>
        {intro && <p className="mt-5 max-w-xl text-lg text-stone">{intro}</p>}
        {children}
      </div>
    </header>
  );
}
