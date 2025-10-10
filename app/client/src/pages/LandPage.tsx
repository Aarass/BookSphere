import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LandPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bgbooks after:bg-[#EEEEEE] dark:after:bg-[#111111]">
      <div className="flex items-end mb-6">
        <Globe size={150} />
        <h1 className="text-9xl font-bold">BookSphere</h1>
      </div>

      <h2 className="text-4xl indent-5 tracking-[0.45em] font-bold opacity-50">
        Dive into a world of books
      </h2>

      <Button className="mb-40 mt-10">Get Started</Button>
    </div>
  );
}
