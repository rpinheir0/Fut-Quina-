const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The Saldo card
const saldoTarget = `                              {/* Saldo Líquido Card */}
                              <div
                                className={\`p-4 transition-all col-span-2 lg:col-span-1 order-1 lg:order-none \${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none"
                                    : "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl shadow-sm"
                                }\`}
                              >`;

const saldoReplacement = `                              {/* Saldo Líquido Card */}
                              <div
                                className={\`p-4 transition-all col-span-2 lg:col-span-1 order-1 lg:order-none overflow-hidden relative \${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none"
                                    : "bg-[#e2e8f0] dark:bg-[#111625]/90 border border-black/10 dark:border-white/10 rounded-2xl shadow-md backdrop-blur-xl"
                                }\`}
                              >
                                {!isPrintMode && (
                                  <>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#dce3ee] dark:bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />
                                  </>
                                )}`;

if (content.includes(saldoTarget)) {
    content = content.replace(saldoTarget, saldoReplacement);
    console.log("Saldo updated.");
} else {
    console.log("Saldo target not found.");
}


const arrecadacaoTarget = `                              {/* Arrecadação Card */}
                              <div
                                onClick={() => {
                                  if (!isPrintMode && !isEditingTotal) {
                                    if (players.length === 0) {
                                      setToast({
                                        message: "Adicione jogadores para ajustar arrecadação",
                                        type: "info",
                                      });
                                      setTimeout(() => setToast(null), 3000);
                                      return;
                                    }
                                    setTotalInput(manualAdjustment.toString());
                                    setIsEditingTotal(true);
                                  }
                                }}
                                className={\`p-4 transition-all order-2 lg:order-none \${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none text-black"
                                    : "bg-[#34d399]/5 border border-[#34d399]/20 rounded-2xl cursor-pointer hover:bg-[#34d399]/10 overflow-hidden relative shadow-sm"
                                }\`}
                              >
                                {!isPrintMode && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#34d399]/5 to-transparent pointer-events-none" />
                                )}`;

const arrecadacaoReplacement = `                              {/* Arrecadação Card */}
                              <div
                                onClick={() => {
                                  if (!isPrintMode && !isEditingTotal) {
                                    if (players.length === 0) {
                                      setToast({
                                        message: "Adicione jogadores para ajustar arrecadação",
                                        type: "info",
                                      });
                                      setTimeout(() => setToast(null), 3000);
                                      return;
                                    }
                                    setTotalInput(manualAdjustment.toString());
                                    setIsEditingTotal(true);
                                  }
                                }}
                                className={\`p-4 transition-all order-2 lg:order-none overflow-hidden relative \${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none text-black"
                                    : "bg-[#e2e8f0] dark:bg-[#111625]/90 border border-[#34d399]/20 rounded-2xl cursor-pointer hover:bg-[#34d399]/5 shadow-md backdrop-blur-xl"
                                }\`}
                              >
                                {!isPrintMode && (
                                  <>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#dce3ee] dark:bg-[#34d399]/10 rounded-full blur-[40px] pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#34d399]/5 rounded-full blur-[40px] pointer-events-none" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#34d399]/5 to-transparent pointer-events-none" />
                                  </>
                                )}`;

if (content.includes(arrecadacaoTarget)) {
    content = content.replace(arrecadacaoTarget, arrecadacaoReplacement);
    console.log("Arrecadação updated.");
} else {
    console.log("Arrecadação target not found.");
}


const despesasTarget = `                              {/* Despesas Card */}
                              <div
                                onClick={() => {
                                  if (players.length === 0) {
                                    setToast({
                                      message: "Adicione jogadores para detalhar despesas",
                                      type: "info"
                                    });
                                    setTimeout(() => setToast(null), 3000);
                                    return;
                                  }
                                  !isPrintMode && setShowExpenseModal(true);
                                }}
                                className={\`p-4 transition-all order-3 lg:order-none \${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none"
                                    : "bg-red-500/5 border border-red-500/20 rounded-2xl cursor-pointer hover:bg-red-500/10 shadow-sm relative overflow-hidden"
                                }\`}
                              >`;

const despesasReplacement = `                              {/* Despesas Card */}
                              <div
                                onClick={() => {
                                  if (players.length === 0) {
                                    setToast({
                                      message: "Adicione jogadores para detalhar despesas",
                                      type: "info"
                                    });
                                    setTimeout(() => setToast(null), 3000);
                                    return;
                                  }
                                  !isPrintMode && setShowExpenseModal(true);
                                }}
                                className={\`p-4 transition-all order-3 lg:order-none overflow-hidden relative \${
                                  isPrintMode
                                    ? "bg-white border-zinc-300 border rounded-none"
                                    : "bg-[#e2e8f0] dark:bg-[#111625]/90 border border-red-500/20 rounded-2xl cursor-pointer hover:bg-red-500/5 shadow-md backdrop-blur-xl"
                                }\`}
                              >
                                {!isPrintMode && (
                                  <>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#dce3ee] dark:bg-red-500/10 rounded-full blur-[40px] pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] pointer-events-none" />
                                  </>
                                )}`;

if (content.includes(despesasTarget)) {
    content = content.replace(despesasTarget, despesasReplacement);
    console.log("Despesas updated.");
} else {
    console.log("Despesas target not found.");
}

fs.writeFileSync('src/App.tsx', content);
