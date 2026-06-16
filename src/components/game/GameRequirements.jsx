export function GameRequirements() {
  const requisitosMinimos = [
    { label: "SO", valor: "Windows 10 (64-bit)" },
    { label: "Processador", valor: "Intel i3-8100 / Ryzen 3 2200G" },
    { label: "Memória", valor: "8 GB RAM" },
    { label: "Placa de vídeo", valor: "GTX 1050 / RX 560" },
  ];

  const requisitosRecomendados = [
    { label: "SO", valor: "Windows 11 (64-bit)" },
    { label: "Processador", valor: "Intel i5-12400 / Ryzen 5 5600X" },
    { label: "Memória", valor: "16 GB RAM" },
    { label: "Placa de vídeo", valor: "RTX 3060 / RX 6600 XT" },
  ];

  return (
    <section className="bg-card p-8 rounded-2xl border border-white/5">
      <h2 className="text-2xl font-bold mb-8">Requisitos de sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div>
          <h3 className="text-lg font-bold text-muted-foreground mb-4">Mínimo</h3>
          <div className="space-y-4">
            {requisitosMinimos.map((req, index) => (
              <div key={`min-${index}`}>
                <p className="text-xs text-muted-foreground uppercase">{req.label}</p>
                <p className="text-sm">{req.valor}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-muted-foreground mb-4">Recomendado</h3>
          <div className="space-y-4">
            {requisitosRecomendados.map((req, index) => (
              <div key={`rec-${index}`}>
                <p className="text-xs text-muted-foreground uppercase">{req.label}</p>
                <p className="text-sm">{req.valor}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}