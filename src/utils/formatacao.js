export const decodificarTexto = (textoBruto) => {
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
    'Ã‡': 'Ç', 'Ã‘': 'Ñ',
    '‰': 'É',
    '‡': 'Ç'
  };

  for (const [erro, certo] of Object.entries(mapaErros)) {
    textoCorrigido = textoCorrigido.split(erro).join(certo);
  }

  try {
    textoCorrigido = decodeURIComponent(escape(textoCorrigido));
  } catch (e) {}

  return textoCorrigido.trim();
};

export const extrairValorApi = (campo) => {
  if (!campo) return null;
  if (typeof campo === "string") return campo;
  if (typeof campo === "object") {
    return campo.nome || campo.nomeUsuario || campo.titulo || null;
  }
  return String(campo);
};

export const formatarNomeCompleto = (campo, padrao) => {
  const valor = extrairValorApi(campo);

  if (!valor) return padrao;

  return decodificarTexto(valor);
};

export const formatarPrimeiroEUltimoNome = (campo, padrao) => {
  const valor = extrairValorApi(campo);

  if (!valor) return padrao;

  const textoLimpo = decodificarTexto(valor).toLowerCase();

  const partes = textoLimpo.split(/\s+/);

  const capitalizar = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  if (partes.length <= 1) return capitalizar(partes[0]);

  return `${capitalizar(partes[0])} ${capitalizar(
    partes[partes.length - 1]
  )}`;
};

export const formatarDataLancamento = (gameData) => {
  const data =
    gameData.dataLancamento ||
    gameData.createdAt ||
    gameData.dataCriacao;

  if (!data) return "Já disponível";

  try {
    return new Date(data).toLocaleDateString("pt-BR");
  } catch {
    return "Já disponível";
  }
};

export const calcularTempoDecorrido = (dataString) => {
  if (!dataString) return "Recentemente";

  const dataPostagem = new Date(dataString);
  const agora = new Date();

  const diferencaMs = agora - dataPostagem;

  const minutos = Math.floor(diferencaMs / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(dias / 30);
  const anos = Math.floor(dias / 365);

  if (minutos < 1) return "Agora mesmo";
  if (minutos < 60)
    return `há ${minutos} minuto${minutos > 1 ? "s" : ""}`;

  if (horas < 24)
    return `há ${horas} hora${horas > 1 ? "s" : ""}`;

  if (dias < 7)
    return `há ${dias} dia${dias > 1 ? "s" : ""}`;

  if (semanas < 4)
    return `há ${semanas} semana${semanas > 1 ? "s" : ""}`;

  if (meses < 12)
    return `há ${meses} mês${meses > 1 ? "es" : ""}`;

  return `há ${anos} ano${anos > 1 ? "s" : ""}`;
};