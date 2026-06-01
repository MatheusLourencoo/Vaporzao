import { useState } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (mensagem, tipo = "sucesso") => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, showToast };
}