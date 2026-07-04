const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
const target = content.match(/<div className="w-14 h-14 rounded-full bg-black\/5 dark:bg-white\/5 border border-black\/10 dark:border-white\/10 shadow-lg text-\[#34d399\] flex items-center justify-center mx-auto mb-2 relative z-10">[\s\S]*?<GiSoccerBall size={24} \/>[\s\S]*?<\/div>/);
if (target) {
  content = content.replace(target[0], '');
  content = content.replace(/border-dashed border-black\/20/, 'border-solid border-black/20');
  content = content.replace(/placeholder:text-white\/30 focus:border-\[#34d399\] focus:bg-black\/10 dark:bg-white\/10 transition-all text-center text-xs/, 'placeholder:text-zinc-500 focus:border-[#34d399] focus:bg-black/10 dark:bg-white/10 transition-all text-center text-xs');
  fs.writeFileSync('src/App.tsx', content);
  console.log("Success");
} else {
  console.log("Not found");
}
