const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace these exact snippets
const snippets = [
  'const limit = match.config.playersPerTeam;',
  '!match?.config?.playersPerTeam',
  'team && team.playerIds.length >= match.config.playersPerTeam',
  '(teams[match.teamAIndex]?.playerIds?.length === match.config.playersPerTeam &&',
  'teams[match.teamBIndex]?.playerIds?.length === match.config.playersPerTeam)',
  'teams.filter(t => t.playerIds.length === match.config.playersPerTeam)',
  'match.config.playersPerTeam - t.playerIds.length',
  't.playerIds.length < match.config.playersPerTeam',
  'const playersPerTeam = match.config.playersPerTeam;',
  '< match.config.playersPerTeam * 2',
  '>= match.config.playersPerTeam * 2',
  'match.config.playersPerTeam - (teams[match.teamAIndex]?.playerIds?.length || 0)',
  'match.config.playersPerTeam - (teams[match.teamBIndex]?.playerIds?.length || 0)',
  '(teams[targetTIdx]?.playerIds?.length || 0) < match.config.playersPerTeam',
  'currentTeam.playerIds.length >= match.config.playersPerTeam'
];

for (const snippet of snippets) {
  const replacement = snippet.replace(/match\??\.config\??\.playersPerTeam/, '(match.config.playersPerTeam + (fixedGoalkeeper ? 1 : 0))');
  code = code.split(snippet).join(replacement);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Done');
