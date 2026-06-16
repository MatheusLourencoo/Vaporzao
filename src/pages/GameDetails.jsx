import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGameDetails } from "../hooks/useGameDetails";
import { GameDetailsLoading } from "../components/game/GameDetailsLoading";
import { GameGallery } from "../components/game/GameGallery";
import { GameSidebar } from "../components/game/GameSidebar";
import { GameRequirements } from "../components/game/GameRequirements";
import { Review } from "../components/game/Review";

export function GameDetails({
	biblioteca = [],
	wishlist = [],
	adicionarNaBiblioteca,
	adicionarNaWishlist,
	showToast,
}) {
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		game,
		galeria,
		reviews,
		isLoading,
		localInLib,
		localInWish,
		processandoObter,
		processandoWishlist,
		processandoReview,
		handleObter,
		handleWishlist,
		handlePublicarAvaliacao,
	} = useGameDetails({
		id,
		biblioteca,
		wishlist,
		adicionarNaBiblioteca,
		adicionarNaWishlist,
		showToast,
	});

	if (isLoading || !game) {
		return <GameDetailsLoading />;
	}

	return (
		<div className="min-h-screen bg-background text-foreground pb-20">
			<div className="max-w-5xl mx-auto pt-8 px-6">
				<button
					onClick={() => navigate(-1)}
					className="text-sm text-muted-foreground hover:text-white mb-6 flex items-center gap-1 transition-colors"
				>
					<ArrowLeft className="w-4 h-4" /> Voltar
				</button>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
					<div className="lg:col-span-2 space-y-8">
						<h1 className="text-5xl font-extrabold tracking-tight">
							{game.titulo}
						</h1>

						<GameGallery game={game} galeria={galeria} />

						<section>
							<h2 className="text-2xl font-bold mb-4">Sobre o jogo</h2>
							<p className="text-lg text-muted-foreground leading-relaxed mb-6 whitespace-pre-wrap">
								{game.descricao}
							</p>

							<h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
								Gêneros
							</h3>
							<div className="flex flex-wrap gap-2">
								{game.generos?.map((genero, index) => (
									<span
										key={index}
										className="px-4 py-1.5 bg-[#2a2a2a] text-white text-sm font-medium rounded-md cursor-default"
									>
										{typeof genero === "string" ? genero : genero.nome}
									</span>
								))}
							</div>
						</section>

						<GameRequirements />

						<Review
							reviews={reviews}
							onPublicar={handlePublicarAvaliacao}
							processando={processandoReview}
						/>
					</div>

					<div className="lg:col-span-1">
						<GameSidebar
							game={game}
							localInLib={localInLib}
							localInWish={localInWish}
							processandoObter={processandoObter}
							processandoWishlist={processandoWishlist}
							handleObter={handleObter}
							handleWishlist={handleWishlist}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
