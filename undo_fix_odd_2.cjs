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
  
  // Look for lines that contain '       }'
  const match = line.match(/^( *)       \}(.*)$/);
  if (match) {
    const spaces = match[1].length;
    const suffix = match[2];
    
    // Check if spaces is odd and suffix is valid
    if (spaces % 2 !== 0 && validSuffixes.has(suffix)) {
       lines[i] = ' '.repeat(spaces) + suffix;
       changedCount++;
    }
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log(`Reverted ${changedCount} lines.`);
