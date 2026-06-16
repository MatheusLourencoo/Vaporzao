export const isVideo = (item) => {
  if (!item) return false;
  return (
    item.legenda === "Trailer" ||
    item.url?.includes("youtube.com") ||
    item.url?.includes("youtu.be") ||
    item.url?.endsWith(".mp4") ||
    item.url?.endsWith(".webm")
  );
};

export const converterUrlYoutube = (url = "") => {
  try {
    let id = "";
    if (url.includes("youtu.be/")) {
      id = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      id = new URL(url).searchParams.get("v");
    } else if (url.includes("youtube.com/embed/")) {
      id = url.split("embed/")[1].split("?")[0];
    }
    
    if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  } catch {}
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