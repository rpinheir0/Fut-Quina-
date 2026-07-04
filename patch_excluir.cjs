const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-sm relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl" />
              <span className="text-red-500 relative z-10">
                <Trash2 size={24} />
              </span>
            </div>`;

const repl = `            <span className="text-red-500 shrink-0">
              <Trash2 size={32} />
            </span>`;

if (content.includes(target)) {
    content = content.replace(target, repl);
    console.log("Success");
} else {
    console.log("Not found");
}

fs.writeFileSync('src/App.tsx', content);
