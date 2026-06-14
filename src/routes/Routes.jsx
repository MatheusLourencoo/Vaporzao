import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home";
import Biblioteca from "../pages/Biblioteca";
import { Wishlist } from "../pages/Wishlist";
import { GameDetails } from "../pages/GameDetails";
import PublicarJogo from '../pages/PublicarJogo';
import { Comunidade } from "../pages/Comunidade"; 
import { Perfil } from "../pages/Perfil";

export function AppRoutes({
  searchQuery,
  biblioteca,
  wishlist,
  adicionarNaBiblioteca,
  removerDaBiblioteca,
  adicionarNaWishlist,
  removerDaWishlist,
  isLoggedIn,
  setShowLogin,
  showToast
}) {
  return (
    <Routes>
      <Route path="/" element={
        <Home 
          searchQuery={searchQuery} 
          adicionarNaBiblioteca={adicionarNaBiblioteca} 
          adicionarNaWishlist={adicionarNaWishlist}
        />
      } />
      
      <Route path="/comunidade" element={<Comunidade />} /> 

      <Route path="/perfil/:matricula" element={<Perfil />} />
   
      <Route path="/biblioteca" element={
        <Biblioteca biblioteca={biblioteca} removerDaBiblioteca={removerDaBiblioteca} />
      } />

      <Route path="/wishlist" element={
        <Wishlist wishlist={wishlist} removerDaWishlist={removerDaWishlist} />
      } />

      <Route path="/publicar" element={
        <PublicarJogo isLoggedIn={isLoggedIn} onRequestLogin={() => setShowLogin(true)} showToast={showToast} />
      } />

      <Route path="/jogo/:id" element={
        <GameDetails 
          biblioteca={biblioteca}
          wishlist={wishlist}
          adicionarNaBiblioteca={adicionarNaBiblioteca} 
          adicionarNaWishlist={adicionarNaWishlist} 
          showToast={showToast} 
        />
      } />
      
    </Routes>
  );
}