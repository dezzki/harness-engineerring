from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "notes"


def list_notes():
    """Return a sorted list of all note files in the data folder."""
    return sorted(DATA_DIR.glob("*.md"))


def read_note(name):
    """Return the text of a note, or None if it does not exist."""
    path = DATA_DIR / f"{name}.md"
    if not path.exists():
        return None
    return path.read_text(encoding="utf-8")


def add_note(title):
    """Create a new note from a title and return its path."""
    slug = title.strip().lower().replace(" ", "-") or "untitled"
    path = DATA_DIR / f"{slug}.md"
    path.write_text(f"# {title}\n", encoding="utf-8")
    return path