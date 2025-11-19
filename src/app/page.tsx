import { Logo } from "@/components/logo";
import PhotoPoet from "@/components/photo-poet";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/90 px-4 backdrop-blur-sm md:px-6">
        <Logo />
      </header>
      <main className="flex-1">
        <PhotoPoet />
      </main>
    </div>
  );
}
