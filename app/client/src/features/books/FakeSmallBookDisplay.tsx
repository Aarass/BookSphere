import { BookX } from "lucide-react";

export function FakeSmallBookDisplay() {
  return (
    <div className="w-[inherit] h-[inherit] aspect-(--cover) rounded-md bg-secondary flex items-center justify-center opacity-10">
      <BookX color="var(--accent-foreground)" />
    </div>
  );
}
