import pandas as pd
from pathlib import Path

from decision_logic import compute_adaptive_decision

BASE = Path(__file__).resolve().parents[1]


def apply_rules():
    df = pd.read_csv(BASE / "outputs" / "06_bayes.csv")

    enriched_rows = []
    for _, row in df.iterrows():
        decision = compute_adaptive_decision(row)
        enriched_rows.append({**row.to_dict(), **decision})

    out = pd.DataFrame(enriched_rows)
    out.to_csv(BASE / "outputs" / "07_rules.csv", index=False)
    return out


if __name__ == "__main__":
    apply_rules()
