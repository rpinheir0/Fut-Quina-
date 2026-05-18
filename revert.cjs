const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.split('(match.config.playersPerTeam + (fixedGoalkeeper ? 1 : 0))').join('match.config.playersPerTeam');

fs.writeFileSync('src/App.tsx', code);
console.log('Reverted');
