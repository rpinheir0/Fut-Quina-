const fs = require('fs');
const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const validSuffixes = new Set([
  ")",
  ")()}",
  "))",
  ")),",
  "));",
  "),",
  ")}",
  ";",
  "`}",
  "`}>",
  ") || []",
  ", 3000);",
  ").map((_, i) => (",
  ").reverse()}"
]);

let changedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Try to find if this line was modified by undo_fix_odd_2.cjs
  // It would be an odd number of spaces, followed by a valid suffix
  const match = line.match(/^( *)(.*)$/);
  if (match) {
    const spaces = match[1].length;
    const suffix = match[2];
    
    if (spaces % 2 !== 0 && validSuffixes.has(suffix)) {
       // Restore it!
       lines[i] = ' '.repeat(spaces) + '       }' + suffix;
       changedCount++;
    }
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log(`Restored ${changedCount} lines from undo_fix_odd_2.cjs.`);
