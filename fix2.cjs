const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `              <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-lg text-[#34d399] flex items-center justify-center mx-auto mb-2 relative z-10">
                <GiSoccerBall size={24} />
              </div>`;

if (content.includes(t1)) {
  content = content.replace(t1, "");
  console.log("Replaced t1");
}

const t2 = `className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 border border-dashed border-black/20 dark:border-white/20 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#34d399]/60 transition-all shadow-sm group relative"`;
const r2 = `className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 border border-solid border-black/20 dark:border-white/20 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#34d399]/60 transition-all shadow-sm group relative"`;

if (content.includes(t2)) {
  content = content.replace(t2, r2);
  console.log("Replaced t2");
}

const t3 = `placeholder:text-white/30 focus:border-[#34d399]`;
const r3 = `placeholder:text-zinc-500 focus:border-[#34d399]`;

if (content.includes(t3)) {
  content = content.replace(t3, r3);
  console.log("Replaced t3");
}

fs.writeFileSync('src/App.tsx', content);
