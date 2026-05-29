import { Eye, Plus, Star } from "lucide-react";

export function Banner({ jogoDestaque, onVerDetalhes }) {
  if (!jogoDestaque) return null;

  return (
    <section className="mb-12">
      <div className="relative rounded-xl overflow-hidden h-[500px]">
        <img
          src={jogoDestaque.capaUrl || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f"}
          alt={jogoDestaque.titulo}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f" }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex items-center">
          <div className="p-12 max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">{jogoDestaque.titulo}</h1>
            <p className="text-xl text-gray-300 mb-4">{jogoDestaque.descricao}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-primary text-primary" />
                <span className="text-2xl font-bold">{jogoDestaque.nota || 0}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">{jogoDestaque.avaliacoes || 0} avaliações</span>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={onVerDetalhes}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-md font-bold text-lg transition-all flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Ver Detalhes
              </button>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-bold text-lg transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Adicionar à Biblioteca
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-primary">
                R$ {Number(jogoDestaque.preco || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}