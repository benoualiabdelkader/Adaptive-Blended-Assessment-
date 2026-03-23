import pandas as pd
from pathlib import Path
from pgmpy.models import DiscreteBayesianNetwork
from pgmpy.estimators import MaximumLikelihoodEstimator
from pgmpy.inference import VariableElimination

BASE = Path(__file__).resolve().parents[1]

def band_score(x):
    if x <= 2:
        return "low"
    if x == 3:
        return "medium"
    return "high"

def band_revision(x):
    if x == 0:
        return "low"
    if x == 1:
        return "medium"
    return "high"

def band_feedback(x):
    if x == 0:
        return "low"
    if x == 1:
        return "medium"
    return "high"

def run_bayesian():
    df = pd.read_csv(BASE / "outputs" / "05_rf.csv")

    d = df.copy()
    
    # Ensure columns exist before applying
    for c in ["argumentation", "cohesion", "grammar_accuracy", "lexical_resource", "revision_frequency", "feedback_views"]:
        if c not in d.columns:
            d[c] = 0

    d["argument_state"] = d["argumentation"].apply(band_score)
    d["cohesion_state"] = d["cohesion"].apply(band_score)
    d["linguistic_state"] = (d["grammar_accuracy"] + d["lexical_resource"]).apply(
        lambda x: "low" if x <= 4 else ("medium" if x <= 6 else "high")
    )
    d["revision_state"] = d["revision_frequency"].apply(band_revision)
    d["feedback_state"] = d["feedback_views"].apply(band_feedback)

    bn_data = d[
        ["revision_state", "feedback_state", "argument_state", "cohesion_state", "linguistic_state"]
    ].dropna()

    model = DiscreteBayesianNetwork([
        ("revision_state", "argument_state"),
        ("feedback_state", "argument_state"),
        ("revision_state", "cohesion_state"),
        ("feedback_state", "cohesion_state"),
        ("revision_state", "linguistic_state"),
    ])

    if len(bn_data) > 0:
        model.fit(bn_data, estimator=MaximumLikelihoodEstimator)
    else:
        print("Not enough data to fit Bayesian Network.")
        # We can still add dummy competence to avoid failing down the pipeline
        d["argument_competence"] = "unknown"
        d["cohesion_competence"] = "unknown"
        d["linguistic_competence"] = "unknown"
        d.to_csv(BASE / "outputs" / "06_bayes.csv", index=False)
        return d, None

    infer = VariableElimination(model)

    arg_probs = []
    coh_probs = []
    ling_probs = []

    for _, row in d.iterrows():
        try:
            arg_q = infer.query(
                variables=["argument_state"],
                evidence={
                    "revision_state": band_revision(row["revision_frequency"]),
                    "feedback_state": band_feedback(row["feedback_views"]),
                },
            )
            coh_q = infer.query(
                variables=["cohesion_state"],
                evidence={
                    "revision_state": band_revision(row["revision_frequency"]),
                    "feedback_state": band_feedback(row["feedback_views"]),
                },
            )
            ling_q = infer.query(
                variables=["linguistic_state"],
                evidence={"revision_state": band_revision(row["revision_frequency"])},
            )
            arg_probs.append(arg_q.state_names["argument_state"][arg_q.values.argmax()])
            coh_probs.append(coh_q.state_names["cohesion_state"][coh_q.values.argmax()])
            ling_probs.append(ling_q.state_names["linguistic_state"][ling_q.values.argmax()])
        except Exception as e:
            # Fallback for inference failures
            arg_probs.append("unknown")
            coh_probs.append("unknown")
            ling_probs.append("unknown")

    d["argument_competence"] = arg_probs
    d["cohesion_competence"] = coh_probs
    d["linguistic_competence"] = ling_probs

    d.to_csv(BASE / "outputs" / "06_bayes.csv", index=False)
    return d, model

if __name__ == "__main__":
    run_bayesian()
