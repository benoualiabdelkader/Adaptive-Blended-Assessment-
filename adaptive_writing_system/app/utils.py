def forethought_risk(row):
    if row.get("rubric_views", 0) == 0 and row.get("time_on_task", 0) < 15 and row.get("word_count", 0) < 80:
        return "Forethought risk = High"
    if row.get("rubric_views", 0) <= 1 and row.get("time_on_task", 0) < 30:
        return "Forethought risk = Medium"
    return "Forethought risk = Low"

def argument_state(row):
    comp = row.get("argument_competence", "unknown")
    if comp == "low":
        return "Argumentation weakness = High"
    if comp == "medium":
        return "Argumentation weakness = Medium"
    return "Argumentation weakness = Low"

def revision_state(row):
    if row.get("revision_frequency", 0) == 0:
        return "Revision depth = Low"
    if row.get("revision_frequency", 0) == 1:
        return "Revision depth = Medium"
    return "Revision depth = High"

def feedback_state(row):
    if row.get("feedback_views", 0) >= 1 and row.get("revision_frequency", 0) == 0:
        return "Feedback uptake risk = High"
    if row.get("feedback_views", 0) >= 1 and row.get("revision_frequency", 0) == 1:
        return "Feedback uptake risk = Medium"
    return "Feedback uptake risk = Low"

def help_state(row):
    if row.get("help_seeking_messages", 0) >= 1:
        return "Help-seeking regulation = Adaptive"
    return "Help-seeking regulation = None"
