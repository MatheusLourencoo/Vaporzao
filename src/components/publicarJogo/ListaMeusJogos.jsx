import { Settings, Trash2, FolderOpen, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ListaMeusJogos({ meusJogos, carregandoMeusJogos, onEditar, onDeletar }) {
  const navigate = useNavigate();

  const getGeneroPrincipal = (generos) => {
    if (!generos || generos.length === 0) return null;
    const gen = generos[0];
    return typeof gen === 'object' ? gen.nome : gen;
  };

  const formatData = (dataString) => {
    if (!dataString) return null;
    const date = new Date(dataString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  if (carregandoMeusJogos) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-zinc-400 gap-6">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-[#00ff9d] rounded-full animate-spin"></div>
        <p className="font-bold text-lg tracking-wide">Sincronizando catálogo...</p>
      </div>
    );
  }

  if (meusJogos.length === 0) {
    return (
      <div className="py-24 bg-[#18181c] rounded-3xl border border-white/5 flex flex-col items-center gap-6 shadow-inner">
        <div className="w-24 h-24 bg-[#202020] rounded-full flex items-center justify-center shadow-lg">
          <FolderOpen className="w-10 h-10 text-zinc-500" />
        </div>
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-black text-white mb-3">Workspace Vazio</h3>
          <p className="text-zinc-400 leading-relaxed">Você ainda não gerenciou nenhum título. Use a aba "Hospedar Novo Jogo" para iniciar seu primeiro projeto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[11px] font-black text-zinc-500 uppercase tracking-widest">
        <div className="col-span-6">Projeto</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-2 text-center">Preço (R$)</div>
        <div className="col-span-2 text-right">Ações</div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {meusJogos.map(jogo => {
          const genero = getGeneroPrincipal(jogo.generos);
          const dataLancamento = formatData(jogo.lancamento);

          return (
            <div 
              key={jogo.id || jogo.jogoId} 
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#18181c] border border-white/5 hover:border-[#00ff9d]/30 rounded-xl p-3 transition-all duration-300 hover:bg-[#1a1a20] hover:shadow-lg hover:shadow-[#00ff9d]/5"
            >
              
              <div className="col-span-1 md:col-span-6 flex items-center gap-5">
                <div 
                  className="w-36 h-[72px] bg-zinc-900 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-white/10 relative"
                  onClick={() => navigate(`/jogo/${jogo.id || jogo.jogoId}`)}
                >
                  <img 
                    src={jogo.capaUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop"} 
                    alt="Capa" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="min-w-0 flex flex-col justify-center py-1">
                  <h3 
                    className="text-white font-bold text-lg truncate cursor-pointer hover:text-[#00ff9d] transition-colors"
                    onClick={() => navigate(`/jogo/${jogo.id || jogo.jogoId}`)}
                  >
                    {jogo.titulo}
                  </h3>
                  
                  {genero && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#2a2a2a] border border-white/5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {genero}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff9d]"></span>
                  </span>
                  <span className="text-[11px] font-bold text-[#00ff9d] uppercase tracking-wider">Publicado</span>
                </div>
                
                {dataLancamento && (
                  <span className="text-xs text-zinc-500 mt-1 font-medium">
                    {dataLancamento}
                  </span>
                )}
              </div>

              <div className="col-span-1 md:col-span-2 flex md:justify-center items-center">
                <span className="px-4 py-1.5 bg-[#121212] rounded-lg text-sm font-bold font-mono text-white border border-white/10 shadow-inner">
                  {jogo.preco > 0 ? `R$ ${jogo.preco.toFixed(2)}` : "GRÁTIS"}
                </span>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-start md:justify-end items-center gap-2 mt-2 md:mt-0 px-2">
                
                <button 
                  onClick={() => navigate(`/jogo/${jogo.id || jogo.jogoId}`)}
                  className="p-2.5 text-zinc-400 hover:text-[#00ff9d] bg-[#202020] hover:bg-[#00ff9d]/10 rounded-lg transition-all"
                  title="Visualizar na Loja"
                >
                  <ExternalLink className="w-[18px] h-[18px]" />
                </button>

                <button 
                  onClick={() => onEditar(jogo)}
                  className="p-2.5 text-zinc-400 hover:text-white bg-[#202020] hover:bg-[#2a2a2a] rounded-lg transition-all"
                  title="Editar Projeto"
                >
                  <Settings className="w-[18px] h-[18px]" />
                </button>

                <button 
                  onClick={() => onDeletar(jogo)}
                  className="p-2.5 text-zinc-400 hover:text-red-400 bg-[#202020] hover:bg-red-500/10 hover:border-red-500/20 rounded-lg transition-all"
                  title="Remover Projeto"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}