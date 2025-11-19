import { Aperture } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-xl font-bold tracking-tight">
      <Aperture className="h-6 w-6 text-primary" />
      <span>PhotoPoet</span>
    </div>
  );
}
