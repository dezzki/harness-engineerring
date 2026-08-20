import argparse
import sys

from . import storage


def cmd_list(args):
    notes = storage.list_notes()
    if not notes:
        print("No notes found.")
        return
    for note in notes:
        print(note.stem)


def cmd_open(args):
    content = storage.read_note(args.name)
    if content is None:
        print(f"No note named '{args.name}'.")
        sys.exit(1)
    print(content)


def cmd_add(args):
    path = storage.add_note(args.title)
    print(f"Created {path.name}")


def main(argv=None):
    parser = argparse.ArgumentParser(description="A tiny notes CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    p_list = sub.add_parser("list", help="list all notes")
    p_list.set_defaults(func=cmd_list)

    p_open = sub.add_parser("open", help="show a note")
    p_open.add_argument("name", help="note name without .md")
    p_open.set_defaults(func=cmd_open)

    p_add = sub.add_parser("add", help="create a note")
    p_add.add_argument("title", help="title of the note")
    p_add.set_defaults(func=cmd_add)

    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()