import type {
  CareerRecord,
  DbsCatalog,
  DbsDriver,
  DbsEvent,
  DbsNews,
  DbsTeam,
  SeasonGate,
  SportKey,
  StandingRow,
} from '@/domain/dbs';
import { espn, jolpica, mlb, openf1 } from '@/api/client';
import { CAREER_CHAMPIONSHIPS, F1_TEAM_LOGOS, F1_TEAM_X } from '@/lib/socials';

const SPORT_PATH: Record<Exclude<SportKey, 'f1'>, string> = {
  nfl: '/apis/site/v2/sports/football/nfl',
  nba: '/apis/site/v2/sports/basketball/nba',
  mlb: '/apis/site/v2/sports/baseball/mlb',
  soccer: '/apis/site/v2/sports/soccer/eng.1',
};

function hex(color?: string, fallback = '1e4d32') {
  if (!color) return `#${fallback}`;
  return color.startsWith('#') ? color : `#${color}`;
}

function parseTeams(sport: SportKey, json: any): DbsTeam[] {
  const raw = json?.sports?.[0]?.leagues?.[0]?.teams ?? [];
  return raw
    .map((row: any) => row.team)
    .filter(Boolean)
    .map((t: any) => ({
      id: `${sport}-${t.id}`,
      sport,
      name: t.displayName as string,
      abbr: (t.abbreviation as string) ?? t.name,
      city: t.location,
      logo: t.logos?.[0]?.href ?? t.logo ?? '',
      color: hex(t.color),
      altColor: hex(t.alternateColor, 'f4ead3'),
    }));
}

function competitor(c: any) {
  const t = c.team ?? {};
  return {
    id: String(t.id ?? c.id ?? ''),
    name: (t.displayName ?? t.name ?? c.displayName ?? 'TBD') as string,
    abbr: (t.abbreviation ?? t.name ?? 'TBD') as string,
    logo: t.logo ?? t.logos?.[0]?.href,
    score: c.score != null ? String(c.score) : undefined,
  };
}

function parseEvents(sport: SportKey, json: any): DbsEvent[] {
  return (json?.events ?? []).map((e: any) => {
    const comp = e.competitions?.[0];
    const comps = comp?.competitors ?? [];
    const home = comps.find((c: any) => c.homeAway === 'home') ?? comps[0];
    const away = comps.find((c: any) => c.homeAway === 'away') ?? comps[1];
    const st = e.status?.type ?? {};
    const state = st.state === 'in' ? 'in' : st.state === 'post' ? 'post' : 'pre';
    return {
      id: String(e.id),
      sport,
      name: e.name ?? e.shortName,
      status: st.shortDetail ?? st.description ?? st.name ?? 'Scheduled',
      state,
      start: e.date,
      venue: comp?.venue?.fullName ?? e.circuit?.address?.city,
      detail: st.detail ?? st.shortDetail,
      home: home ? competitor(home) : undefined,
      away: away ? competitor(away) : undefined,
    } as DbsEvent;
  });
}

function parseNews(sport: SportKey, json: any): DbsNews[] {
  return (json?.articles ?? []).slice(0, 8).map((a: any) => ({
    id: String(a.id ?? a.headline),
    sport,
    headline: a.headline,
    description: a.description,
    image: a.images?.[0]?.url,
    published: a.published,
    href: a.links?.web?.href ?? a.links?.mobile?.href,
  }));
}

function parseStandings(json: any): StandingRow[] {
  const groups = json?.children?.length ? json.children : [json];
  const rows: StandingRow[] = [];
  for (const g of groups) {
    const entries = g?.standings?.entries ?? [];
    for (const e of entries) {
      const stats = Object.fromEntries((e.stats ?? []).map((s: any) => [s.name, s.value]));
      rows.push({
        position: Number(stats.playoffSeed ?? stats.rank ?? rows.length + 1),
        id: String(e.team?.id ?? e.team?.abbreviation),
        name: e.team?.displayName ?? e.team?.name,
        logo: e.team?.logos?.[0]?.href ?? e.team?.logo,
        played: stats.gamesPlayed,
        wins: stats.wins,
        losses: stats.losses,
        draws: stats.ties ?? stats.draws,
        points: stats.points,
      });
    }
  }
  return rows.sort((a, b) => a.position - b.position);
}

function gateFor(
  sport: SportKey,
  scoreboard: any,
  extra?: { regularStart?: string },
): SeasonGate {
  const season = scoreboard?.leagues?.[0]?.season;
  const typeName = season?.type?.name ?? 'Unknown';
  const start = season?.startDate ? new Date(season.startDate).getTime() : 0;
  const end = season?.endDate ? new Date(season.endDate).getTime() : 0;
  const now = Date.now();
  const isPre = /pre/i.test(typeName);
  const startInFuture = start && now < start;

  if (sport === 'nfl') {
    const resumesAt = extra?.regularStart ?? '2026-09-10T00:20:00Z';
    const inSeason = now >= new Date(resumesAt).getTime() && !isPre;
    return {
      sport,
      inSeason,
      phase: inSeason ? typeName : 'Offseason / preseason',
      resumesAt: inSeason ? undefined : resumesAt,
      resumesLabel: 'Regular season',
    };
  }
  if (sport === 'nba') {
    const resumesAt = extra?.regularStart ?? season?.startDate ?? '2026-10-03T23:00:00Z';
    const inSeason = now >= new Date(resumesAt).getTime() && now <= end;
    return {
      sport,
      inSeason,
      phase: inSeason ? typeName : 'Offseason',
      resumesAt: inSeason ? undefined : resumesAt,
      resumesLabel: 'Tip-off',
    };
  }
  const inSeason = !isPre && !startInFuture && now <= end;
  return {
    sport,
    inSeason,
    phase: typeName,
    resumesAt: inSeason ? undefined : season?.startDate,
    resumesLabel: 'Next season',
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function localYmd(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function localIsoDate(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function mergeEvents(sport: SportKey, payloads: any[]): DbsEvent[] {
  const map = new Map<string, DbsEvent>();
  for (const p of payloads) {
    for (const e of parseEvents(sport, p)) map.set(e.id, e);
  }
  return [...map.values()];
}

function parseMlbSchedule(json: any): DbsEvent[] {
  const games = ((json?.dates ?? []) as any[]).flatMap((d) => d.games ?? []);
  return games.map((g: any) => {
    const abstract = String(g.status?.abstractGameState ?? '');
    const state = abstract === 'Live' ? 'in' : abstract === 'Final' ? 'post' : 'pre';
    const away = g.teams?.away;
    const home = g.teams?.home;
    return {
      id: `mlb-${g.gamePk}`,
      sport: 'mlb' as const,
      name: `${away?.team?.name ?? 'Away'} at ${home?.team?.name ?? 'Home'}`,
      status: g.status?.detailedState ?? g.status?.abstractGameState ?? 'Scheduled',
      state,
      start: g.gameDate,
      venue: g.venue?.name,
      home: {
        id: String(home?.team?.id ?? ''),
        name: home?.team?.name ?? 'Home',
        abbr: home?.team?.abbreviation ?? home?.team?.teamName ?? 'H',
        score: home?.score != null ? String(home.score) : undefined,
      },
      away: {
        id: String(away?.team?.id ?? ''),
        name: away?.team?.name ?? 'Away',
        abbr: away?.team?.abbreviation ?? away?.team?.teamName ?? 'A',
        score: away?.score != null ? String(away.score) : undefined,
      },
    } as DbsEvent;
  });
}

export function hqHeadshot(url?: string): string {
  if (!url) return '';
  const dam = url.match(/content\/dam\/fom-website\/drivers\/[^\s?"]+?\.png/i);
  if (dam) {
    return `https://media.formula1.com/image/upload/f_auto,c_fit,q_auto,w_800/${dam[0]}`;
  }
  return url
    .replace(/\.transform\/1col\//gi, '.transform/4col/')
    .replace(/\.transform\/2col\//gi, '.transform/4col/')
    .replace(/\/w_\d+/g, '/w_800')
    .replace(/,w_\d+/g, ',w_800');
}

async function espnDayBoards(path: string) {
  const today = localYmd(0);
  const yest = localYmd(-1);
  const tom = localYmd(1);
  return Promise.all([
    espn(`${path}/scoreboard`).catch(() => ({})),
    espn(`${path}/scoreboard?dates=${today}`).catch(() => ({})),
    espn(`${path}/scoreboard?dates=${yest}`).catch(() => ({})),
    espn(`${path}/scoreboard?dates=${tom}`).catch(() => ({})),
  ]);
}

export async function loadCatalog(): Promise<DbsCatalog> {
  const todayIso = localIsoDate(0);
  const [nflTeams, nbaTeams, mlbTeams, eplTeams, nflBoards, nbaBoards, mlbBoards, eplBoards, f1Sb, nflNews, nbaNews, soccerNews, f1News, nflW1, mlbLive] =
    await Promise.all([
      espn(`${SPORT_PATH.nfl}/teams?limit=50`),
      espn(`${SPORT_PATH.nba}/teams?limit=50`),
      espn(`${SPORT_PATH.mlb}/teams?limit=50`),
      espn(`${SPORT_PATH.soccer}/teams?limit=50`),
      espnDayBoards(SPORT_PATH.nfl),
      espnDayBoards(SPORT_PATH.nba),
      espnDayBoards(SPORT_PATH.mlb),
      espnDayBoards(SPORT_PATH.soccer),
      espn('/apis/site/v2/sports/racing/f1/scoreboard'),
      espn(`${SPORT_PATH.nfl}/news?limit=8`).catch(() => ({})),
      espn(`${SPORT_PATH.nba}/news?limit=8`).catch(() => ({})),
      espn(`${SPORT_PATH.soccer}/news?limit=8`).catch(() => ({})),
      espn('/apis/site/v2/sports/racing/f1/news?limit=8').catch(() => ({})),
      espn(`${SPORT_PATH.nfl}/scoreboard?seasontype=2&week=1`).catch(() => ({})),
      mlb(`/api/v1/schedule?sportId=1&date=${todayIso}&hydrate=team,linescore`).catch(() => ({})),
    ]);

  const nflSb = nflBoards[0];
  const nbaSb = nbaBoards[0];
  const mlbSb = mlbBoards[0];
  const eplSb = eplBoards[0];

  const [nflStand, nbaStand, eplStand] = await Promise.all([
    espn('/apis/v2/sports/football/nfl/standings').catch(() => ({})),
    espn('/apis/v2/sports/basketball/nba/standings').catch(() => ({})),
    espn('/apis/v2/sports/soccer/eng.1/standings').catch(() => ({})),
  ]);

  const nflRegularStart = (nflW1 as any)?.events?.[0]?.date;
  const nbaFirst = (nbaSb as any)?.events?.[0]?.date ?? (nbaSb as any)?.leagues?.[0]?.season?.startDate;

  const gates: Record<SportKey, SeasonGate> = {
    nfl: gateFor('nfl', nflSb, { regularStart: nflRegularStart }),
    nba: gateFor('nba', nbaSb, { regularStart: nbaFirst }),
    mlb: gateFor('mlb', mlbSb),
    soccer: gateFor('soccer', eplSb),
    f1: gateFor('f1', f1Sb),
  };
  if (!gates.mlb.inSeason) {
    const games = (mlbLive as any)?.dates?.[0]?.games ?? [];
    if (games.length) gates.mlb = { sport: 'mlb', inSeason: true, phase: 'Regular Season', resumesLabel: 'Opening Day' };
  }
  if ((f1Sb as any)?.events?.length) {
    gates.f1 = { sport: 'f1', inSeason: true, phase: 'Race weekend', resumesLabel: 'Lights out' };
  }

  const teams = [
    ...parseTeams('nfl', nflTeams),
    ...parseTeams('nba', nbaTeams),
    ...parseTeams('mlb', mlbTeams),
    ...parseTeams('soccer', eplTeams),
  ];

  const mlbMap = new Map<string, DbsEvent>();
  for (const e of [...mergeEvents('mlb', mlbBoards), ...parseMlbSchedule(mlbLive)]) mlbMap.set(e.id, e);

  const events = [
    ...mergeEvents('nfl', nflBoards),
    ...mergeEvents('nba', nbaBoards),
    ...mlbMap.values(),
    ...mergeEvents('soccer', eplBoards),
    ...parseEvents('f1', f1Sb),
  ];

  const news = [
    ...parseNews('nfl', nflNews),
    ...parseNews('nba', nbaNews),
    ...parseNews('soccer', soccerNews),
    ...parseNews('f1', f1News),
  ];

  const { drivers, constructorRows, f1Teams } = await loadF1();
  teams.push(...f1Teams);

  return {
    loading: false,
    gates,
    teams,
    drivers,
    events,
    news,
    constructors: constructorRows,
    standings: {
      nfl: parseStandings(nflStand),
      nba: parseStandings(nbaStand),
      soccer: parseStandings(eplStand),
      f1: constructorRows,
    },
  };
}

async function loadF1(): Promise<{ drivers: DbsDriver[]; constructorRows: StandingRow[]; f1Teams: DbsTeam[] }> {
  const [standings, constructors, openDrivers] = await Promise.all([
    jolpica('/ergast/f1/current/driverStandings.json?limit=40'),
    jolpica('/ergast/f1/current/constructorStandings.json?limit=20'),
    openf1('/v1/drivers?session_key=latest').catch(() => []),
  ]);

  const openList = Array.isArray(openDrivers) ? openDrivers : [];
  const openByCode = new Map<string, any>();
  for (const d of openList) {
    if (d.name_acronym) openByCode.set(String(d.name_acronym).toUpperCase(), d);
    if (d.full_name) openByCode.set(String(d.full_name).replace(/\s+/g, ' ').toUpperCase(), d);
  }

  const list = (standings as any)?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  const drivers: DbsDriver[] = list.map((row: any) => {
    const dr = row.Driver;
    const ctor = row.Constructors?.[0];
    const code = String(dr.code ?? '').toUpperCase();
    const open =
      openByCode.get(code) ??
      openByCode.get(`${dr.givenName} ${dr.familyName}`.toUpperCase()) ??
      openByCode.get(`${dr.givenName} ${String(dr.familyName).toUpperCase()}`.toUpperCase());
    const teamColor = open?.team_colour ? `#${open.team_colour}` : '#1e4d32';
    return {
      id: dr.driverId,
      name: `${dr.givenName} ${dr.familyName}`,
      code,
      number: Number(open?.driver_number ?? dr.permanentNumber ?? 0),
      teamId: ctor?.constructorId ?? '',
      teamName: ctor?.name ?? open?.team_name ?? '',
      nationality: dr.nationality,
      headshot: hqHeadshot(open?.headshot_url),
      teamColor,
      dob: dr.dateOfBirth,
      wiki: dr.url,
      season: {
        position: Number(row.position),
        points: Number(row.points),
        wins: Number(row.wins),
      },
    } as DbsDriver;
  });

  const ctorList = (constructors as any)?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
  const constructorRows: StandingRow[] = ctorList.map((row: any) => ({
    position: Number(row.position),
    id: row.Constructor.constructorId,
    name: row.Constructor.name,
    logo: F1_TEAM_LOGOS[row.Constructor.constructorId],
    wins: Number(row.wins),
    points: Number(row.points),
  }));

  const f1Teams: DbsTeam[] = ctorList.map((row: any) => ({
    id: `f1-${row.Constructor.constructorId}`,
    sport: 'f1' as const,
    name: row.Constructor.name,
    abbr: row.Constructor.constructorId,
    logo: F1_TEAM_LOGOS[row.Constructor.constructorId] ?? '',
    color: drivers.find((d) => d.teamId === row.Constructor.constructorId)?.teamColor ?? '#1e4d32',
    altColor: '#f4ead3',
    x: F1_TEAM_X[row.Constructor.constructorId],
  }));

  return { drivers, constructorRows, f1Teams };
}

export async function loadDriverCareer(driverId: string): Promise<CareerRecord> {
  const [results, seasons] = await Promise.all([
    jolpica(`/ergast/f1/drivers/${driverId}/results.json?limit=500`),
    jolpica(`/ergast/f1/drivers/${driverId}/seasons.json`).catch(() => ({})),
  ]);
  const races = (results as any)?.MRData?.RaceTable?.Races ?? [];
  let wins = 0;
  let podiums = 0;
  let poles = 0;
  let points = 0;
  let dnfs = 0;
  for (const race of races) {
    const res = race.Results?.[0];
    if (!res) continue;
    const pos = Number(res.position);
    if (pos === 1) wins += 1;
    if (pos >= 1 && pos <= 3 && res.status === 'Finished') podiums += 1;
    else if (pos >= 1 && pos <= 3) podiums += 1;
    if (Number(res.grid) === 1) poles += 1;
    points += Number(res.points ?? 0);
    if (!/^(Finished|\+\d+ Laps?)$/i.test(String(res.status))) dnfs += 1;
  }
  const seasonCount = Number((seasons as any)?.MRData?.total ?? (seasons as any)?.MRData?.SeasonTable?.Seasons?.length ?? 0);
  return {
    races: races.length,
    wins,
    podiums,
    poles,
    points: Math.round(points),
    dnfs,
    championships: CAREER_CHAMPIONSHIPS[driverId] ?? 0,
    seasons: seasonCount,
  };
}
