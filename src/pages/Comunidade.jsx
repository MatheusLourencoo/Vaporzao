import { FeedAvaliacoes } from "../components/comunidade/FeedAvaliacoes.jsx";
import { DestaquesSidebar } from "../components/comunidade/DestaquesSideBar.jsx";

export function Comunidade() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-5xl mx-auto pt-10 px-6">
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Comunidade</h1>
          <p className="text-zinc-400 mt-2 text-lg">Descubra análises, debata lançamentos e veja o que está em alta.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <FeedAvaliacoes />
          </div>

          <aside className="lg:col-span-1 hidden lg:block sticky top-24">
            <DestaquesSidebar />
          </aside>
        </div>

      </div>
    </div>
  );
}