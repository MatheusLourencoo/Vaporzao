import { useState } from "react";
import { X, Star, Plus, Heart } from "lucide-react";
import { MOCK_ACHIEVEMENTS, MOCK_REVIEWS } from "../../data/mockData";

export function GameDetailsModal({ game, onClose }) {
  const [selectedTab, setSelectedTab] = useState("conquistas");
  const [reviewNota, setReviewNota] = useState(8);
  const [reviewTexto, setReviewTexto] = useState("");
  const [recomenda, setRecomenda] = useState(true);

  if (!game) return null;

  // Substitua por dados vindos da API quando integrar
  const conquistas = MOCK_ACHIEVEMENTS;
  const avaliacoes = MOCK_REVIEWS;

  // Exemplo de envio de review via API:
  // async function handleSubmitReview() {
  //   await postReview(game.id, { nota: reviewNota, texto: reviewTexto, recomenda });
  // }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto bg-background rounded-lg overflow-hidden">
          <div className="relative">
            <img src={game.capaUrl} alt={game.titulo} className="w-full h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl font-bold mb-2">{game.titulo}</h1>
              <p className="text-muted-foreground mb-4">{game.desenvolvedora}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="text-xl font-semibold">{game.nota}</span>
                </div>
                <span className="text-muted-foreground">({game.avaliacoes} avaliações)</span>
              </div>

              <div className="flex gap-3">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 transition-all">
                  <Plus className="w-5 h-5" />
                  Adicionar à Biblioteca
                </button>
                <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 transition-all">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <div className="flex items-center gap-2 bg-card border border-border px-6 rounded-md">
                  <span className="text-2xl font-bold text-primary">R$ {game.preco.toFixed(2)}</span>
                  {game.precoOriginal && (
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {game.precoOriginal.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Sobre o Jogo</h2>
              <p className="text-muted-foreground leading-relaxed">{game.descricao}</p>
              <div className="flex gap-2 mt-4">
                {game.generos.map((genero) => (
                  <span key={genero} className="bg-muted text-foreground px-3 py-1 rounded-md">
                    {genero}
                  </span>
                ))}
              </div>
            </div>

            {game.screenshots && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Galeria</h2>
                <div className="grid grid-cols-3 gap-4">
                  {game.screenshots.map((screenshot, idx) => (
                    <img
                      key={idx}
                      src={screenshot}
                      alt={`Screenshot ${idx + 1}`}
                      className="w-full aspect-video object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex gap-4 border-b border-border mb-6">
                {["conquistas", "avaliacoes"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`pb-3 px-2 font-semibold transition-colors relative capitalize ${
                      selectedTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "conquistas" ? "Conquistas" : "Avaliações"}
                    {selectedTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              {selectedTab === "conquistas" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {conquistas.map((conquista, idx) => (
                    <div key={idx} className="bg-card border border-border p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold">{conquista.titulo}</h3>
                        <span className="text-primary font-bold">{conquista.pontos} pts</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{conquista.descricao}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === "avaliacoes" && (
                <div>
                  <div className="bg-card border border-border p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-bold mb-4">Escrever Avaliação</h3>

                    <div className="mb-4">
                      <label className="block mb-2">Nota (1-10)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={reviewNota}
                          onChange={(e) => setReviewNota(parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-2xl font-bold text-primary w-12 text-center">{reviewNota}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2">Seu comentário</label>
                      <textarea
                        value={reviewTexto}
                        onChange={(e) => setReviewTexto(e.target.value)}
                        placeholder="Conte sua experiência com o jogo..."
                        className="w-full bg-input border border-border rounded-md p-3 min-h-24 text-foreground"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={recomenda}
                          onChange={(e) => setRecomenda(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span>Eu recomendo este jogo</span>
                      </label>
                    </div>

                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md font-bold transition-all">
                      Publicar Avaliação
                    </button>
                  </div>

                  <div className="space-y-4">
                    {avaliacoes.map((avaliacao, idx) => (
                      <div key={idx} className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold">{avaliacao.usuario}</span>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-semibold">{avaliacao.nota}/10</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-2">{avaliacao.texto}</p>
                        {avaliacao.recomenda && (
                          <span className="text-sm text-primary">✓ Recomendado</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}