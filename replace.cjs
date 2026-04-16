const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add removeItem to safeLocalStorage
content = content.replace(
  /clear: \(\) => \{\n    try \{\n      localStorage\.clear\(\);\n    \} catch \(e\) \{\}\n  \}/,
  `removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {}
  }`
);

// Rename App to GroupApp
content = content.replace(
  'export default function App() {',
  'function GroupApp({ groupId, onBackToHome }: { groupId: string, onBackToHome: () => void }) {'
);

// Replace keys
const keys = [
  'futquina_finance_players',
  'futquina_monthly_fee',
  'futquina_selected_year',
  'futquina_available_years',
  'futquina_players',
  'futquina_session_player_ids',
  'futquina_payments',
  'futquina_teams',
  'futquina_match',
  'futquina_match_history',
  'futquina_has_randomized',
  'futquina_last_result'
];

keys.forEach(key => {
  const regex = new RegExp(`'${key}'`, 'g');
  content = content.replace(regex, `\`${key}_\${groupId}\``);
});

// Replace safeLocalStorage.clear() with removing specific keys
content = content.replace(
  /safeLocalStorage\.clear\(\);\n\s*window\.location\.reload\(\);/,
  `[
    \`futquina_finance_players_\${groupId}\`,
    \`futquina_monthly_fee_\${groupId}\`,
    \`futquina_selected_year_\${groupId}\`,
    \`futquina_available_years_\${groupId}\`,
    \`futquina_players_\${groupId}\`,
    \`futquina_session_player_ids_\${groupId}\`,
    \`futquina_payments_\${groupId}\`,
    \`futquina_teams_\${groupId}\`,
    \`futquina_match_\${groupId}\`,
    \`futquina_match_history_\${groupId}\`,
    \`futquina_has_randomized_\${groupId}\`,
    \`futquina_last_result_\${groupId}\`
  ].forEach(k => safeLocalStorage.removeItem(k));
  window.location.reload();`
);

// Add the new App component at the end
content += `

// --- Main App Component ---
export default function App() {
  const [groups, setGroups] = useState<{ id: string, name: string, createdAt: number }[]>(() => {
    const saved = safeLocalStorage.getItem('futquina_groups');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = safeLocalStorage.getItem('futquina_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    safeLocalStorage.setItem('futquina_theme', theme);
  }, [theme]);

  useEffect(() => {
    safeLocalStorage.setItem('futquina_groups', JSON.stringify(groups));
  }, [groups]);

  if (currentGroupId) {
    return <GroupApp groupId={currentGroupId} onBackToHome={() => setCurrentGroupId(null)} />;
  }

  return (
    <div className={\`min-h-screen font-sans transition-colors duration-300 \${theme === 'light' ? 'bg-zinc-100 text-zinc-900' : 'bg-[#0a0a0a] text-white'}\`}>
      <div className="max-w-md mx-auto p-6 space-y-8 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Trophy size={20} className="text-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Futquina</h1>
          </div>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text-secondary">Suas Partidas</h2>
          
          {groups.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-brand-border bg-brand-glass">
              <p className="text-sm text-brand-text-secondary mb-4">Você ainda não tem nenhuma partida configurada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map(group => (
                <div key={group.id} className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentGroupId(group.id)}
                    className="flex-1 p-4 rounded-xl border border-brand-border bg-brand-glass hover:border-brand-primary/50 transition-all flex items-center justify-between group"
                  >
                    <span className="font-bold">{group.name}</span>
                    <ChevronRight size={20} className="text-brand-text-secondary group-hover:text-brand-primary transition-colors" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta partida? Todos os dados serão perdidos.')) {
                        setGroups(prev => prev.filter(g => g.id !== group.id));
                        [
                          \`futquina_finance_players_\${group.id}\`,
                          \`futquina_monthly_fee_\${group.id}\`,
                          \`futquina_selected_year_\${group.id}\`,
                          \`futquina_available_years_\${group.id}\`,
                          \`futquina_players_\${group.id}\`,
                          \`futquina_session_player_ids_\${group.id}\`,
                          \`futquina_payments_\${group.id}\`,
                          \`futquina_teams_\${group.id}\`,
                          \`futquina_match_\${group.id}\`,
                          \`futquina_match_history_\${group.id}\`,
                          \`futquina_has_randomized_\${group.id}\`,
                          \`futquina_last_result_\${group.id}\`
                        ].forEach(k => safeLocalStorage.removeItem(k));
                      }
                    }}
                    className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowNewGroupModal(true)}
            className="w-full p-4 rounded-xl bg-brand-gradient text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-brand-primary/20"
          >
            <Plus size={16} />
            Nova Partida
          </button>
        </div>
      </div>

      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={\`w-full max-w-sm p-6 rounded-2xl shadow-2xl \${theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a] border border-white/10'}\`}>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Nome da Partida</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Ex: Futebol de Quinta"
              className={\`w-full p-4 rounded-xl mb-6 outline-none font-bold \${theme === 'light' ? 'bg-zinc-100' : 'bg-black/50 border border-white/5'}\`}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewGroupModal(false);
                  setNewGroupName('');
                }}
                className="flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (newGroupName.trim()) {
                    const newGroup = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: newGroupName.trim(),
                      createdAt: Date.now()
                    };
                    setGroups(prev => [...prev, newGroup]);
                    setShowNewGroupModal(false);
                    setNewGroupName('');
                    setCurrentGroupId(newGroup.id);
                  }
                }}
                disabled={!newGroupName.trim()}
                className="flex-1 py-3 rounded-xl font-black uppercase tracking-widest text-xs bg-brand-gradient text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', content);
