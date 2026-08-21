export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json() as Promise<T>;
}

export function espn(path: string) {
  return getJson(`/api/espn${path}`);
}

export function jolpica(path: string) {
  return getJson(`/api/jolpica${path}`);
}

export function openf1(path: string) {
  return getJson(`/api/openf1${path}`);
}

export function mlb(path: string) {
  return getJson(`/api/mlb${path}`);
}
