/**
 * InterviewAce - Notes Module
 * CRUD operations for user notes stored in localStorage
 */

function getNotesKey() {
  const user = getCurrentUser();
  return STORAGE_KEYS.NOTES_PREFIX + user.email;
}

function getNotes() {
  return JSON.parse(localStorage.getItem(getNotesKey()) || '[]');
}

function saveNotes(notes) {
  localStorage.setItem(getNotesKey(), JSON.stringify(notes));
}

function initNotes() {
  if (!requireAuth()) return;
  renderNotes();
  bindNotesEvents();
}

function bindNotesEvents() {
  document.getElementById('addNoteBtn').addEventListener('click', openAddModal);
  document.getElementById('noteForm').addEventListener('submit', handleNoteSubmit);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);

  document.getElementById('noteModal').addEventListener('click', (e) => {
    if (e.target.id === 'noteModal') closeModal();
  });
}

function renderNotes() {
  const notes = getNotes();
  const container = document.getElementById('notesGrid');
  const countEl = document.getElementById('notesCount');

  countEl.textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;

  if (!notes.length) {
    container.innerHTML = `
      <div class="empty-state notes-empty">
        <div class="empty-icon">📝</div>
        <h3>No notes yet</h3>
        <p>Create your first note to keep track of important interview topics.</p>
        <button class="btn btn-primary" onclick="openAddModal()">Add Note</button>
      </div>
    `;
    return;
  }

  container.innerHTML = notes.map(note => {
    const date = new Date(note.updatedAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    const preview = note.content.length > 120
      ? note.content.substring(0, 120) + '...'
      : note.content;

    return `
      <article class="note-card" data-id="${note.id}">
        <div class="note-header">
          <h3 class="note-title">${escapeHtml(note.title)}</h3>
          <span class="note-date">${date}</span>
        </div>
        <p class="note-preview">${escapeHtml(preview)}</p>
        <div class="note-actions">
          <button class="btn btn-sm btn-outline" onclick="editNote('${note.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteNote('${note.id}')">Delete</button>
        </div>
      </article>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Add Note';
  document.getElementById('noteId').value = '';
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('noteModal').classList.add('active');
  document.getElementById('noteTitle').focus();
}

function editNote(id) {
  const note = getNotes().find(n => n.id === id);
  if (!note) return;

  document.getElementById('modalTitle').textContent = 'Edit Note';
  document.getElementById('noteId').value = note.id;
  document.getElementById('noteTitle').value = note.title;
  document.getElementById('noteContent').value = note.content;
  document.getElementById('noteModal').classList.add('active');
}

function deleteNote(id) {
  if (!confirm('Are you sure you want to delete this note?')) return;

  const notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
  renderNotes();
}

function closeModal() {
  document.getElementById('noteModal').classList.remove('active');
}

function handleNoteSubmit(event) {
  event.preventDefault();

  const id = document.getElementById('noteId').value;
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();

  if (!title || !content) {
    showFormMessage('noteFormMessage', 'Title and content are required', 'error');
    return;
  }

  const notes = getNotes();
  const now = new Date().toISOString();

  if (id) {
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], title, content, updatedAt: now };
    }
  } else {
    notes.unshift({
      id: Date.now().toString(),
      title,
      content,
      createdAt: now,
      updatedAt: now
    });
  }

  saveNotes(notes);
  closeModal();
  renderNotes();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'notes') {
    initNotes();
  }
});
