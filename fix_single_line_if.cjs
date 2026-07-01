const fs = require('fs');

const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

let count = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^ +\} else if \(/)) {
     const prevLine = lines[i-1].trim();
     if (!prevLine.endsWith('}')) {
        const match = line.match(/^ +/);
        const spaces = match[0].length;
        const origSpaces = spaces >= 6 ? spaces - 6 : spaces;
        lines[i] = ' '.repeat(origSpaces) + line.trim().substring(2);
        count++;
     }
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log(`Reverted ${count} single-line if's.`);
