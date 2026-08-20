from notes import storage


def test_list_notes_returns_three_notes():
    assert len(storage.list_notes()) == 3


def test_read_note_returns_content():
    content = storage.read_note("blog-1")
    assert content is not None
    assert "Harness" in content


def test_add_note_creates_file(tmp_path, monkeypatch):
    monkeypatch.setattr(storage, "DATA_DIR", tmp_path)
    path = storage.add_note("Hello World")
    assert path.exists()
    assert path.name == "hello-world.md"