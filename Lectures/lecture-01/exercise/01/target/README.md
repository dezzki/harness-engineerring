# Notes CLI

A tiny command-line tool that manages markdown notes in a local `data/notes/`
folder. Built by hand for Lecture 01, Exercise 1 (comparison experiment:
no-harness run vs. harness run).

## Structure

- `notes/` — Python package
  - `cli.py` — command-line interface (`add`, `list`, `open`)
  - `storage.py` — file operations on `data/notes/`
- `data/notes/` — the markdown documents (blog-1..3)
- `tests/` — pytest tests

## How to run

From this directory:

```
python -m notes.cli list
python -m notes.cli open blog-1
python -m notes.cli add "My first note"
```

## How to test

```
python -m pytest
```

## Requirements

- Python 3.14+
- pytest (see `requirements.txt`)