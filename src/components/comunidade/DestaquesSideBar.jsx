import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Library, Flame } from "lucide-react";
import { api } from "../../services/api";

const obterCapaAlternativa = (titulo = "") => {
  const capas = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop"
  ];
  return capas[titulo.length % capas.length];
};

const decodificarTexto = (textoBruto) => {
  if (!textoBruto) return "";
  let textoCorrigido = String(textoBruto);
  const mapaErros = {
    'Ã¡': 'á', 'Ã¢': 'â', 'Ã£': 'ã', 'Ã¤': 'ä',
    'Ã©': 'é', 'Ãª': 'ê', 'Ã«': 'ë',
    'Ã­': 'í', 'Ã®': 'î', 'Ã¯': 'ï',
    'Ã³': 'ó', 'Ã´': 'ô', 'Ãµ': 'õ', 'Ã¶': 'ö',
    'Ãº': 'ú', 'Ã»': 'û', 'Ã¼': 'ü',
    'Ã§': 'ç', 'Ã±': 'ñ',
    'Ã ': 'Á', 'Ã‚': 'Â', 'Ãƒ': 'Ã', 'Ã„': 'Ä',
    'Ã‰': 'É', 'ÃŠ': 'Ê', 'Ã‹': 'Ë',
    'Ã': 'Í', 'ÃŽ': 'Î', 'Ã': 'Ï',
    'Ã“': 'Ó', 'Ã”': 'Ô', 'Ã•': 'Õ', 'Ã–': 'Ö',
    'Ãš': 'Ú', 'Ã›': 'Û', 'Ãœ': 'Ü',
    'Ã‡': 'Ç', 'Ã‘': 'Ñ', '‰': 'É', '‡': 'Ç',
    'ã‡': 'ç'
  };

  for (const [erro, certo] of Object.entries(mapaErros)) {
    textoCorrigido = textoCorrigido.split(erro).join(certo);
  }

  try {
    textoCorrigido = decodeURIComponent(escape(textoCorrigido));
  } catch (e) {}

  return textoCorrigido.trim();
};

export function DestaquesSidebar() {
  const navigate = useNavigate();
  const [jogosAlta, setJogosAlta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jogos/destaques").then(res => {
      const top = res.data?.topAvaliados || res.data?.populares || res.data?.recentes || [];
      setJogosAlta(top.slice(0, 4)); 
    }).catch(() => {
      api.get("/jogos?limite=4").then(res => {
        setJogosAlta(res.data?.jogos || res.data?.data || res.data?.content || []);
      }).catch(() => {});
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="bg-[#121212] border border-white/5 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#00ff9d]/10 rounded-xl">
            <Library className="w-5 h-5 text-[#00ff9d]" />
          </div>
          <h3 className="text-lg font-black text-white">Sua Voz Importa</h3>
        </div>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          As melhores recomendações vêm de quem joga. Acesse sua biblioteca para avaliar os jogos que você já experimentou.
        </p>
        <button 
          onClick={() => navigate('/biblioteca')}
          className="w-full bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20 hover:bg-[#00ff9d] hover:text-black font-bold py-3 px-5 rounded-xl transition-all duration-300"
        >
          Ir para a Biblioteca
        </button>
      </div>

      <div className="bg-card border border-white/5 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="font-black text-lg text-white">Em Alta</h3>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-zinc-800/50 rounded-xl animate-pulse" />)}
          </div>
        ) : jogosAlta.length > 0 ? (
          <div className="space-y-4">
            {jogosAlta.map((jogo, index) => (
              <Link key={jogo.id || Math.random()} to={`/jogo/${jogo.id || jogo.jogoId}`} className="flex items-center gap-3 group">
                <span className="text-sm font-black text-zinc-600 w-4 group-hover:text-[#00ff9d] transition-colors">{index + 1}</span>
                <div className="relative w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-white/5 group-hover:border-[#00ff9d]/50 transition-colors">
                  <img 
                    src={jogo.capaUrl || obterCapaAlternativa(jogo.titulo)} 
                    alt={jogo.titulo} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = obterCapaAlternativa(jogo.titulo); }}
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-[#00ff9d] transition-colors">{decodificarTexto(jogo.titulo)}</h4>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{decodificarTexto(jogo.desenvolvedora || "Vaporzão Games")}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-6">Nenhum destaque no momento.</p>
        )}
      </div>
    </div>
  );
}