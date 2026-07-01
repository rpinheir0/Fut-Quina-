const fs = require('fs');
const content = fs.readFileSync('onclick_block.tsx', 'utf8');

let depth = 0;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Strip out comments and strings to avoid counting braces inside them
  const cleanedLine = line.replace(/\/\/.*$/g, '').replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '').replace(/`[^`]*`/g, '');
  
  for (let j = 0; j < cleanedLine.length; j++) {
    if (cleanedLine[j] === '{') depth++;
    if (cleanedLine[j] === '}') depth--;
  }
}
console.log(`Final depth: ${depth}`);
