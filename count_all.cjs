const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

let depth = 0;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const cleanedLine = line.replace(/\/\/.*$/g, '').replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '').replace(/`[^`]*`/g, '');
  
  for (let j = 0; j < cleanedLine.length; j++) {
    if (cleanedLine[j] === '{') depth++;
    if (cleanedLine[j] === '}') depth--;
  }
}
console.log(`Final depth: ${depth}`);
