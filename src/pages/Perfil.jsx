import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserCircle, Gamepad2 } from "lucide-react";

import { useUserProfile } from "../hooks/useUserProfile";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileGameGrid } from "../components/profile/ProfileGameGrid";
import { ProfileReviews } from "../components/profile/ProfileReviews";

export function Perfil() {
  const { matricula } = useParams();
  const navigate = useNavigate();

  const { 
    loading, erro, perfilValido, nomeExibicao, inicial, 
    jogosCriados, reviews 
  } = useUserProfile(matricula);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 px-6 flex justify-center">
        <div className="w-full max-w-6xl space-y-8 animate-pulse">
          <div className="h-40 bg-[#121212] rounded-2xl border border-white/5"></div>
          <div className="h-64 bg-[#121212] rounded-2xl border border-white/5"></div>
        </div>
      </div>
    );
  }

  if (erro || !perfilValido) {
    return (
      <div className="min-h-screen bg-background pt-32 flex flex-col items-center">
        <UserCircle className="w-24 h-24 text-zinc-800 mb-6" />
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Perfil Indisponível</h2>
        <p className="text-zinc-500 mb-8">O usuário solicitado não foi encontrado no banco de dados.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-zinc-200 transition-colors">
          Retornar à Loja
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      
      <ProfileHeader 
        nomeExibicao={nomeExibicao} 
        inicial={inicial} 
        stats={{ 
          jogosCriados: jogosCriados.length, 
          reviews: reviews.length 
        }} 
      />

      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-20">
        
        <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="space-y-16">
          {jogosCriados.length > 0 && (
            <ProfileGameGrid 
              titulo="Jogos Publicados" 
              icone={Gamepad2} 
              jogos={jogosCriados} 
              mensagemVazia="Nenhum jogo publicado." 
            />
          )}
        </div>

        <ProfileReviews reviews={reviews} />

      </div>
    </div>
  );
}