import { BookX } from "lucide-react";

export function FakeSmallBookDisplay() {
  return (
    <div className="w-[inherit] h-[inherit] aspect-(--cover) rounded-md bg-secondary flex items-center justify-center">
      <BookX className="opacity-50" />
    </div>
  );
}
