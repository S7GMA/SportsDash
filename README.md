# Danny Boy Sports (DBS)

Live sports board. No account. Real data.

- **F1** via Jolpica + OpenF1 (current grid, standings, career results, official headshots)
- **NFL / NBA / MLB / Premier League** via ESPN’s public site API (all teams, logos, scores, news, standings)
- **MLB** scores also hydrate from MLB Stats API

Off-season sports (NBA, NFL regular season until kickoff) are greyed with a wax-seal countdown. Those shelves keep news and official X profiles only.

## Run

```bash
cd %USERPROFILE%\OneDrive\Desktop\sports-dashboard
npm install
npm run dev
```

Open http://localhost:5173

Vite proxies `/api/espn`, `/api/jolpica`, `/api/openf1`, `/api/mlb` so the browser can talk to those hosts.
