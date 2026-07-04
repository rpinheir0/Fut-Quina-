const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'className="w-full bg-[#e2e8f0] dark:bg-[#111111] border-t border-black/5 dark:border-white/5 pt-1 pb-3 sm:pb-4 px-2 sm:px-6 flex items-center justify-around"',
  'className="w-full bg-[#111111] border-t border-white/5 pt-1 pb-3 sm:pb-4 px-2 sm:px-6 flex items-center justify-around"'
);

const oldButtonClass = '"text-black/60 dark:text-white/50 hover:text-black/80 dark:text-white/80 hover:bg-black/5 dark:bg-white/5"';
const newButtonClass = '"text-white/50 hover:text-white/80 hover:bg-white/5"';

const oldActiveClass = '"text-brand-primary bg-black/5 dark:bg-white/5 shadow-inner"';
const newActiveClass = '"text-brand-primary bg-white/5 shadow-inner"';

// There should be 4 instances of the button classes.
content = content.replaceAll(oldButtonClass, newButtonClass);
content = content.replaceAll(oldActiveClass, newActiveClass);

fs.writeFileSync('src/App.tsx', content);
