import { clients, tracks } from './content.js';

// Only clients with years can sit on the timeline.
export const timelineClients = clients.filter((c) => c.from && c.to);

export const FIRST_YEAR = Math.min(...timelineClients.map((c) => c.from));
export const LAST_YEAR = Math.max(...timelineClients.map((c) => c.to));
export const SPAN = LAST_YEAR - FIRST_YEAR + 1;
export const YEARS = Array.from({ length: SPAN }, (_, i) => FIRST_YEAR + i);

export const activeIn = (year) => timelineClients.filter((c) => c.from <= year && c.to >= year);

// The playhead position `p` runs from 0 to SPAN. Each year is divided evenly
// between the clients active that year, so scrubbing walks through all of them.
export const STOPS = YEARS.flatMap((year) => {
  const list = activeIn(year);
  return list.map((client, i) => ({
    p: year - FIRST_YEAR + (i + 0.5) / list.length,
    year,
    client,
  }));
});

export function stateAt(p) {
  const safe = Math.min(Math.max(p, 0), SPAN - 0.0001);
  const yearIndex = Math.floor(safe);
  const year = FIRST_YEAR + yearIndex;
  const list = activeIn(year);
  const client = list[Math.floor((safe - yearIndex) * list.length)];
  return { year, list, client };
}

export function stopFor(client, currentYear) {
  const year = client.from <= currentYear && client.to >= currentYear ? currentYear : client.from;
  return STOPS.find((s) => s.client.id === client.id && s.year === year);
}

// Finds the next or previous stop that shows a different client.
export function nextStop(p, direction) {
  const { client } = stateAt(p);
  const isOther = (s) => s.client.id !== client.id;
  if (direction > 0) return STOPS.find((s) => s.p > p + 0.001 && isOther(s)) ?? STOPS[STOPS.length - 1];
  return [...STOPS].reverse().find((s) => s.p < p - 0.001 && isOther(s)) ?? STOPS[0];
}

export const latestStopFor = (id) => STOPS.filter((s) => s.client.id === id).at(-1);

// Places each track's clips on as few rows as possible without overlaps.
export const trackLayout = tracks.map((track) => {
  const lanes = [];
  timelineClients
    .filter((c) => c.track === track.id)
    .sort((a, b) => a.from - b.from || b.to - a.to)
    .forEach((clip) => {
      const lane = lanes.find((l) => l[l.length - 1].to < clip.from);
      if (lane) lane.push(clip);
      else lanes.push([clip]);
    });
  return { ...track, lanes };
});
