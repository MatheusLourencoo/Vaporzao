import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export function ToastNotification({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.9 }} 
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl border shadow-2xl ${
            toast.tipo === "sucesso" ? "bg-card border-green-500 text-green-500" : 
            toast.tipo === "erro" ? "bg-card border-red-500 text-red-500" : 
            "bg-card border-yellow-500 text-yellow-500"
          }`}
        >
          {toast.tipo === "sucesso" && <CheckCircle className="w-5 h-5" />}
          {toast.tipo === "erro" && <AlertCircle className="w-5 h-5" />}
          {toast.tipo === "aviso" && <Info className="w-5 h-5" />}
          <span className="font-bold">{toast.mensagem}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}