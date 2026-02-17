"""
Build the static JSON data file for the React webapp.
Consolidates all CCR data sources into a single schools.json.
"""

import csv, json, sys
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent  # ccr/
sys.path.insert(0, str(ROOT / "config"))
from master_schools import MASTER_SCHOOLS

def _tier(rank):
    try:
        r = int(rank)
    except (ValueError, TypeError):
        return "Conservative Highlight"
    if r <= 25: return "Top 25"
    if r <= 50: return "26-50"
    if r <= 100: return "51-100"
    return "101-150"

def _bias_label(score):
    if score is None or pd.isna(score): return "No Data"
    if score <= -40: return "Strong Liberal"
    if score <= -15: return "Liberal"
    if score <= 15: return "Moderate"
    if score <= 40: return "Conservative"
    return "Strong Conservative"

STATE_MAP = {
    "Princeton": "NJ", "MIT": "MA", "Harvard": "MA", "Stanford": "CA",
    "Yale": "CT", "CalTech": "CA", "DukeU": "NC", "JohnsHopkins": "MD",
    "NorthwesternU": "IL", "Penn": "PA", "Columbia": "NY", "UChicago": "IL",
    "Cornell": "NY", "BrownU": "RI", "Rice": "TX", "Dartmouth": "NH",
    "Vanderbilt": "TN", "NotreDame": "IN", "WashU": "MO", "Georgetown": "DC",
    "EmoryUniversity": "GA", "UNC": "NC", "UMich": "MI", "NYU": "NY",
    "Carnegie_Mellon": "PA", "UVA": "VA", "WakeForestU": "NC", "UFlorida": "FL",
    "USC_": "CA", "TuftsUniversity": "MA", "UTexasAustin": "TX",
    "BostonCollege": "MA", "GTechNews": "GA", "UWMadison": "WI",
    "UofIllinois": "IL", "BostonU": "MA", "WilliamandMary": "VA",
    "UROCHESTERnews": "NY", "BrandeisU": "MA", "CaseWestern": "OH",
    "GeorgeWashU": "DC", "NortheasternU": "MA", "OhioState": "OH",
    "LifeAtPurdue": "IN", "TulaneU": "LA", "VillanovaU": "PA",
    "FloridaState": "FL", "PittTweet": "PA", "RutgersU": "NJ",
    "SyracuseU": "NY", "templemade": "PA", "UConn": "CT", "UMNews": "MN",
    "VirginiaTech": "VA", "American_U": "DC", "BaylorU": "TX",
    "Clemson": "SC", "ColoradoMines": "CO", "GonzagaU": "WA",
    "SouthMethodistU": "TX", "StevensInst": "NJ", "UDelaware": "DE",
    "UnivOfMiami": "FL", "Auburn": "AL", "DrexelU": "PA", "FordhamNYC": "NY",
    "Creighton": "NE", "HowardU": "DC", "LoyolaChicago": "IL", "NJIT": "NJ",
    "UCBerkeley": "CA", "UCLA": "CA", "UCSB": "CA", "UCSanDiego": "CA",
    "UCDavis": "CA", "UCIrvine": "CA", "UCSC": "CA", "UCMerced": "CA",
    "UCR": "CA", "UBuffalo": "NY", "SBU": "NY", "UMBC": "MD",
    "UMassAmherst": "MA", "IndianaU": "IN", "IowaStateU": "IA",
    "UofIowa": "IA", "KU_News": "KS", "UMissouri": "MO", "UNLincoln": "NE",
    "UOregon": "OR", "USouthCarolina": "SC", "TexasAM": "TX",
    "TheU": "FL", "UANews": "AL", "ASU": "AZ", "UTKnoxville": "TN",
    "UGA": "GA", "UofMaryland": "MD", "ColoradoBoulder": "CO",
    "UKYnews": "KY", "OklahomaSooner": "OK", "LibertyU": "VA",
    "BYU": "UT", "HillsdaleCollg": "MI",
}

def _safe(val):
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return None
    if isinstance(val, (int, float)):
        return round(val, 2)
    return val

def main():
    # Base from master list
    schools = []
    for handle, rank, display, highlight, fec_kw in MASTER_SCHOOLS:
        schools.append({
            "handle": handle,
            "rank": rank if isinstance(rank, int) else 999,
            "rankDisplay": str(rank),
            "name": display,
            "highlight": highlight,
            "tier": _tier(rank),
            "state": STATE_MAP.get(handle, ""),
        })

    # Index by handle for merging
    idx = {s["handle"]: s for s in schools}

    # Twitter bias
    bias_path = ROOT / "output" / "school_bias.csv"
    if bias_path.exists():
        for row in csv.DictReader(open(bias_path)):
            h = row["school"]
            if h in idx:
                idx[h]["biasScore"] = round(float(row["mean_score"]), 2)
                idx[h]["tweetCount"] = int(row["n_tweets"])
                idx[h]["biasLabel"] = _bias_label(float(row["mean_score"]))

    # FEC
    fec_path = ROOT / "output" / "fec_donations.csv"
    if fec_path.exists():
        for row in csv.DictReader(open(fec_path)):
            h = row["school"]
            if h in idx:
                idx[h]["fecDemPct"] = round(float(row["dem_pct"]), 1)
                idx[h]["fecRepPct"] = round(float(row["rep_pct"]), 1)
                idx[h]["fecTotal"] = round(float(row["total_donations"]))
                idx[h]["fecContributions"] = int(row["n_contributions"])
                idx[h]["fecBiasScore"] = round(float(row["fec_bias_score"]), 2)

    # FIRE
    fire_path = ROOT / "data" / "fire_rankings.csv"
    if fire_path.exists():
        for row in csv.DictReader(open(fire_path)):
            h = row["handle"]
            if h in idx:
                idx[h]["fireRank"] = int(row["fire_rank"])
                idx[h]["fireScore"] = round(float(row["fire_score"]), 2)
                idx[h]["fireGrade"] = row["fire_grade"]

    # DEI
    dei_path = ROOT / "scrapers" / "dei" / "data" / "dei_staffing.csv"
    if dei_path.exists():
        for row in csv.DictReader(open(dei_path)):
            h = row["handle"]
            if h in idx:
                idx[h]["deiStaff"] = int(row["staff_count"])

    # Phase scores from assessments
    assess_path = ROOT / "data" / "assessments.csv"
    tweets_path = ROOT / "data" / "tweets.csv"
    if assess_path.exists() and tweets_path.exists():
        tw = pd.read_csv(tweets_path, usecols=["school", "tweet_id", "created_at"])
        tw["year"] = pd.to_datetime(tw["created_at"], errors="coerce").dt.year
        asc = pd.read_csv(assess_path, usecols=["school", "tweet_id", "score"])
        asc["score"] = pd.to_numeric(asc["score"], errors="coerce")
        merged = tw.merge(asc, on=["school", "tweet_id"], how="inner")

        for handle, grp in merged.groupby("school"):
            if handle not in idx:
                continue
            for key, lo, hi in [("phase1", 2012, 2019), ("phase2", 2020, 2023), ("phase3", 2024, 2026)]:
                sub = grp[(grp["year"] >= lo) & (grp["year"] <= hi)]
                if len(sub):
                    idx[handle][key] = round(sub["score"].mean(), 2)

    # Chart catalog
    charts = {
        "core": [],
        "cultural": [],
        "hypothesis": [],
    }
    for cat, dirname in [("core", "charts/core"), ("cultural", "charts/cultural"), ("hypothesis", "charts/hypothesis")]:
        d = ROOT / dirname
        if d.exists():
            for f in sorted(d.iterdir()):
                if f.suffix == ".png":
                    charts[cat].append(f.name)

    # Write output
    out_dir = Path(__file__).parent / "public" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    with open(out_dir / "schools.json", "w") as f:
        json.dump(schools, f, indent=2)

    with open(out_dir / "charts.json", "w") as f:
        json.dump(charts, f, indent=2)

    print(f"Wrote {len(schools)} schools to {out_dir / 'schools.json'}")
    print(f"Wrote chart catalog to {out_dir / 'charts.json'}")

    # Copy chart images
    import shutil
    img_dir = Path(__file__).parent / "public" / "charts"
    for cat in ["core", "cultural", "hypothesis"]:
        src = ROOT / "charts" / cat
        dst = img_dir / cat
        if src.exists():
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            print(f"Copied {cat} charts → {dst}")

if __name__ == "__main__":
    main()
