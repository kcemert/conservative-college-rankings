import type { School } from "./types";

let _cache: School[] | null = null;

export async function getSchools(): Promise<School[]> {
  if (_cache) return _cache;
  const res = await fetch("/data/schools.json");
  _cache = (await res.json()) as School[];
  return _cache;
}

export function getSchoolsSync(data: School[]): School[] {
  return data;
}

export interface ChartCatalog {
  core: string[];
  cultural: string[];
  hypothesis: string[];
}

export async function getChartCatalog(): Promise<ChartCatalog> {
  const res = await fetch("/data/charts.json");
  return (await res.json()) as ChartCatalog;
}
