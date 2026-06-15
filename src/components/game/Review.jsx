import { useState } from "react";
import { Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatarPrimeiroEUltimoNome,
  calcularTempoDecorrido,
} from "../../utils/formatacao"

export function Review({
  reviews,
  onPublicar,
  processando,
}) {
  const [nota, setNota] = useState(5);
  const [texto, setTexto] = useState("");

  const handleEnviar = () => {
    onPublicar(nota, texto, () => {
      setTexto("");
      setNota(5);
    });
  };

  return (
    <section className="border-t border-white/10 pt-8">
      <h2 className="text-2xl font-bold mb-6">
        Avaliações
      </h2>

      <div className="bg-card border border-border p-6 rounded-xl mb-8">
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <Star
              key={estrela}
              className={`w-8 h-8 cursor-pointer transition-colors ${
                estrela <= nota
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
              onClick={() => setNota(estrela)}
            />
          ))}

          <span className="ml-3 font-bold text-lg">
            {nota} / 5
          </span>
        </div>

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Conte para a comunidade o que você achou do jogo..."
          className="w-full p-4 mb-4 bg-input rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y"
        />

        <button
          onClick={handleEnviar}
          disabled={processando}
          className="bg-[#00ff9d] text-black font-black px-8 py-3 rounded-lg hover:bg-[#00e08a] transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          {processando
            ? "Publicando..."
            : "Publicar Avaliação"}
        </button>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((r, i) => {
            const notaNormalizada =
              r.nota > 5
                ? Math.round(r.nota / 2)
                : r.nota;

            const nomeExibicao =
              formatarPrimeiroEUltimoNome(
                r.usuario ||
                  r.nomeUsuario ||
                  r.autor,
                "Membro da Vaporzão"
              );

            const inicial =
              nomeExibicao.charAt(0).toUpperCase();

            const dataPostagem =
              r.createdAt ||
              r.dataCriacao ||
              r.data;

            const tempoFormatado =
              calcularTempoDecorrido(dataPostagem);

            const matricula =
              r.matricula ||
              r.usuario?.matricula ||
              r.idUsuario ||
              r.autor?.matricula ||
              r.nomeUsuario;

            return (
              <div
                key={i}
                className="bg-[#1a1a1a] border border-white/5 p-6 rounded-xl flex gap-4 transition-colors hover:bg-zinc-900"
              >
                {matricula ? (
                  <Link
                    to={`/perfil/${matricula}`}
                    className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10 text-xl font-black text-zinc-500 shadow-inner hover:border-[#00ff9d] hover:text-[#00ff9d] transition-all"
                  >
                    {inicial}
                  </Link>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10 text-xl font-black text-zinc-500 shadow-inner">
                    {inicial}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      {matricula ? (
                        <Link
                          to={`/perfil/${matricula}`}
                          className="font-bold text-zinc-100 hover:text-[#00ff9d] hover:underline transition-colors"
                        >
                          {nomeExibicao}
                        </Link>
                      ) : (
                        <h4 className="font-bold text-zinc-100">
                          {nomeExibicao}
                        </h4>
                      )}

                      <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{tempoFormatado}</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(
                        (estrela) => (
                          <Star
                            key={estrela}
                            className={`w-4 h-4 ${
                              estrela <=
                              notaNormalizada
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-zinc-700"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <p className="text-zinc-400 leading-relaxed mt-2">
                    {r.texto}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-muted-foreground text-center py-10 bg-[#1a1a1a] rounded-xl border border-white/5">
            Nenhuma avaliação ainda. Seja o primeiro a dar sua opinião!
          </div>
        )}
      </div>
    </section>
  );
}