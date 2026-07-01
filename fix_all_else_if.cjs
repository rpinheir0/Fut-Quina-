const fs = require('fs');
const file = 'src/App.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

let count = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Find lines that start with 'else if' or 'catch' or 'finally' or 'else {'
  if (line.match(/^ +else if \(/) || line.match(/^ +catch \(/) || line.match(/^ +finally \{/) || line.match(/^ +else \{/)) {
     // Check if the previous line is a single line if
     // A single line if usually starts with 'if (' and doesn't end with '{'
     // OR the previous line is just a normal statement.
     // Wait, it's safer to just look at the indentation!
     // If this line is 'else if', it should be preceded by '}'.
     // Let's just blindly add '} ' and fix the single line ifs manually.
     
     const match = line.match(/^ +/);
     const spaces = match[0].length;
     const origSpaces = spaces;
     lines[i] = ' '.repeat(origSpaces) + '} ' + line.trim();
     count++;
  }
}

fs.writeFileSync(file, lines.join('\n'));
console.log(`Added } to ${count} lines.`);
