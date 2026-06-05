import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Play, Square, Clock } from "lucide-react";

export function CardBiblioteca({ jogo, showToast, onAtualizar }) {
  const [jogando, setJogando] = useState(false);
  const [segundosSessao, setSegundosSessao] = useState(0);
  const [salvando, setSalvando] = useState(false);

  const [horasLocais, setHorasLocais] = useState(
    parseInt(jogo.horasJogadas) || parseInt(jogo["horas Jogadas"]) || 0
  );

  useEffect(() => {
    setHorasLocais(parseInt(jogo.horasJogadas) || parseInt(jogo["horas Jogadas"]) || 0);
  }, [jogo]);

  useEffect(() => {
    let intervalo;
    if (jogando) {
      intervalo = setInterval(() => setSegundosSessao((prev) => prev + 1), 1000);
    }
    return () => clearInterval(intervalo);
  }, [jogando]);

  const formatarTempo = (totalSegundos) => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
  };

  const textoHoras = () => {
    if (horasLocais === 0) return "Nenhum tempo de jogo";
    if (horasLocais === 1) return "1 hora de jogo";
    return `${horasLocais},0 horas de jogo`;
  };

  const iniciarSessao = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSegundosSessao(0);
    setJogando(true);
  };

  const encerrarSessao = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setJogando(false);
    setSalvando(true);
    
    const token = localStorage.getItem("vaporzao_token");
    let horasGanhas = Math.round(segundosSessao / 3600);

    if (segundosSessao > 0 && horasGanhas === 0) {
      horasGanhas = 1;
    }

    const totalHorasInteiras = horasLocais + horasGanhas; 
    const jogoId = jogo.id || jogo.jogoId;

    setHorasLocais(totalHorasInteiras);

    try {
      await api.patch(`/biblioteca/${jogoId}`, {
        horasJogadas: totalHorasInteiras
      }, { 
        headers: { 'token': token } 
      });
      
      if (showToast) showToast("Progresso salvo!", "sucesso");
      if (onAtualizar) onAtualizar();
    } catch (error) {
      setHorasLocais(horasLocais);
      if (showToast) showToast("Erro ao salvar progresso na nuvem.", "erro");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 group cursor-default">
      <div className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 ${jogando ? "ring-2 ring-[#00ff9d] shadow-[0_0_20px_rgba(0,255,157,0.2)] -translate-y-1" : "bg-[#151515]"}`}>
        <img 
          src={jogo.capaUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400"} 
          alt={jogo.titulo}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400"; }}
          className={`w-full h-full object-cover transition-transform duration-500 ${jogando ? "scale-110 blur-[2px] brightness-75" : "group-hover:scale-105"}`}
        />

        {!jogando && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <button onClick={iniciarSessao} className="w-14 h-14 rounded-full bg-[#00ff9d] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,255,157,0.5)]">
              <Play className="w-7 h-7 ml-1" fill="currentColor" />
            </button>
          </div>
        )}

        {jogando && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
            <span className="text-[#00ff9d] text-xs font-bold uppercase tracking-widest mb-1 animate-pulse">
              Em Jogo
            </span>
            <div className="text-3xl font-black text-white tabular-nums drop-shadow-md mb-6 tracking-wider">
              {formatarTempo(segundosSessao)}
            </div>
            <button onClick={encerrarSessao} className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <Square className="w-5 h-5" fill="currentColor" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col px-1">
        <h3 className="text-zinc-100 font-bold truncate text-base leading-tight" title={jogo.titulo}>
          {jogo.titulo}
        </h3>
        <div className="flex items-center gap-1.5 text-zinc-400 text-sm mt-1.5">
          {salvando ? (
            <span className="animate-pulse text-[#00ff9d] text-xs font-semibold">Sincronizando...</span>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5" />
              <span className="truncate">
                {textoHoras()}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}