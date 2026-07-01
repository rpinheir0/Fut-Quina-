const fs = require('fs');
const content = fs.readFileSync('onclick_block.tsx', 'utf8');

const stack = [];
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const cleanedLine = line.replace(/\/\/.*$/g, '').replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '').replace(/`[^`]*`/g, '');
  
  for (let j = 0; j < cleanedLine.length; j++) {
    if (cleanedLine[j] === '{') stack.push(i + 1);
    if (cleanedLine[j] === '}') {
      if (stack.length > 0) stack.pop();
      else console.log(`Extra } on line ${i + 1}`);
    }
  }
}
console.log(`Unmatched { on lines: ${stack.join(', ')}`);
