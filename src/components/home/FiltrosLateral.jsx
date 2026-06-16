import { Filter, ChevronDown, Check, Tag, Gamepad2, ArrowUpDown } from "lucide-react";

const opcoesOrdem = [
  { id: "recentes", n: "Mais Recentes" },
  { id: "menor_preco", n: "Menor Preço" },
  { id: "maior_preco", n: "Maior Preço" },
  { id: "az", n: "Ordem Alfabética (A-Z)" },
  { id: "za", n: "Ordem Alfabética (Z-A)" },
];

export function FiltrosLateral({
  listaGeneros,
  selectedGeneros,
  filtroPreco,
  ordenarPor,
  isOrdemOpen,
  isPrecoOpen,
  isGeneroOpen,
  qtdFiltrosAtivos,
  onToggleGenero,
  onTogglePreco,
  onSetOrdenarPor,
  onSetIsOrdemOpen,
  onSetIsPrecoOpen,
  onSetIsGeneroOpen,
  onLimparFiltros,
  opcoesPreco,
}) {
  return (
    <div className="w-72 shrink-0 hidden lg:block self-start sticky top-24">
      <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 shadow-xl max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 sticky top-0 bg-[#121212] z-10 pt-2">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#00ff9d]" /> Filtros
            {qtdFiltrosAtivos > 0 && (
              <span className="bg-[#00ff9d] text-black text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                {qtdFiltrosAtivos}
              </span>
            )}
          </h3>
          {(qtdFiltrosAtivos > 0 || ordenarPor !== "recentes") && (
            <button onClick={onLimparFiltros} className="text-xs font-bold text-[#00ff9d] hover:text-white transition-colors">
              Limpar
            </button>
          )}
        </div>

        <div className="space-y-6">

          <div>
            <button onClick={() => onSetIsOrdemOpen(!isOrdemOpen)} className="flex items-center justify-between w-full text-white font-bold text-sm group mb-4">
              <span className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-zinc-500 group-hover:text-[#00ff9d] transition-colors" /> Ordenar Por
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOrdemOpen ? "rotate-180" : ""}`} />
            </button>
            {isOrdemOpen && (
              <div className="flex flex-col gap-2">
                {opcoesOrdem.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => onSetOrdenarPor(o.id)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${ordenarPor === o.id ? "bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20" : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"}`}
                  >
                    {o.n}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-white/5 w-full" />

          <div>
            <button onClick={() => onSetIsPrecoOpen(!isPrecoOpen)} className="flex items-center justify-between w-full text-white font-bold text-sm group mb-4">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-zinc-500 group-hover:text-[#00ff9d] transition-colors" /> Preço
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isPrecoOpen ? "rotate-180" : ""}`} />
            </button>
            {isPrecoOpen && (
              <div className="space-y-1">
                {opcoesPreco.map((p) => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${filtroPreco.includes(p.id) ? "bg-[#00ff9d] border-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]" : "bg-zinc-900 border border-zinc-700 group-hover:border-zinc-500"}`}>
                      {filtroPreco.includes(p.id) && <Check className="w-3.5 h-3.5 text-black" strokeWidth={4} />}
                    </div>
                    <input type="checkbox" className="hidden" checked={filtroPreco.includes(p.id)} onChange={() => onTogglePreco(p.id)} />
                    <span className={`text-sm font-medium transition-colors ${filtroPreco.includes(p.id) ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-white/5 w-full" />

          <div>
            <button onClick={() => onSetIsGeneroOpen(!isGeneroOpen)} className="flex items-center justify-between w-full text-white font-bold text-sm group mb-4">
              <span className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-zinc-500 group-hover:text-[#00ff9d] transition-colors" /> Gêneros
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isGeneroOpen ? "rotate-180" : ""}`} />
            </button>
            {isGeneroOpen && (
              <div className="space-y-1">
                {listaGeneros.map((g) => (
                  <label key={g.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors">
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${selectedGeneros.includes(g.nome) ? "bg-[#00ff9d] border-[#00ff9d] shadow-[0_0_10px_rgba(0,255,157,0.3)]" : "bg-zinc-900 border border-zinc-700 group-hover:border-zinc-500"}`}>
                      {selectedGeneros.includes(g.nome) && <Check className="w-3.5 h-3.5 text-black" strokeWidth={4} />}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedGeneros.includes(g.nome)} onChange={() => onToggleGenero(g.nome)} />
                    <span className={`text-sm font-medium transition-colors ${selectedGeneros.includes(g.nome) ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"}`}>
                      {g.nome}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}