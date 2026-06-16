export const isVideo = (item) => {
  if (!item) return false;
  return (
    item.legenda === "Trailer" ||
    item.url?.includes("youtube.com") ||
    item.url?.includes("youtu.be") ||
    item.url?.includes("shorts") ||
    item.url?.endsWith(".mp4") ||
    item.url?.endsWith(".webm")
  );
};

export const converterUrlYoutube = (url = "") => {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  if (url.includes("/shorts/")) {
    const id = url.split("/shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1`;
  }
  
  console.warn("Formato de URL do YouTube não reconhecido:", url);
  return url;
};

export const capasPadrao = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop"
];

export const obterCapaAlternativa = (titulo = "") => {
  if (!titulo) return capasPadrao[0];
  return capasPadrao[titulo.length % capasPadrao.length];
};