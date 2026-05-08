import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Login from './Login';
import Register from './Register';

const API_URL = 'http://127.0.0.1:8000/api/notes';
const API_BASE = 'http://127.0.0.1:8000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' atau 'register'

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [loading, setLoading] = useState(true);
  const [viewingNote, setViewingNote] = useState(null);

  const colors = [
    { name: 'Yellow', value: '#fef3c7', border: '#f59e0b' },
    { name: 'Blue', value: '#dbeafe', border: '#3b82f6' },
    { name: 'Pink', value: '#fce7f3', border: '#ec4899' },
    { name: 'Green', value: '#d1fae5', border: '#10b981' },
    { name: 'Purple', value: '#f3e8ff', border: '#a855f7' },
  ];

  // Atur header axios otomatis jika token ada
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
      fetchNotes();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE}/user`);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      if (error.response?.status === 401) {
        handleLogout(); // Auto logout jika token tidak valid
      }
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        content: newNote,
        color: selectedColor,
      });
      setNotes([response.data, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await axios.post(`${API_BASE}/logout`);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('auth_token');
    setToken(null);
  };

  // Jika belum login, tampilkan halaman Login atau Register
  if (!token) {
    if (authView === 'login') {
      return <Login setToken={setToken} switchToRegister={() => setAuthView('register')} />;
    }
    return <Register setToken={setToken} switchToLogin={() => setAuthView('login')} />;
  }

  // Jika sudah login, tampilkan VibeBoard
  return (
    <div className="vibe-container">
      <header className="header">
        <div className="header-top">
          <button className="logout-btn" onClick={handleLogout}>Keluar</button>
        </div>
        <h1>✨ VibeBoard</h1>
        <p>Tempelkan apa yang ada di pikiranmu hari ini.</p>
      </header>

      <form className="note-form" onSubmit={addNote}>
        <textarea
          placeholder="Tulis sesuatu..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        ></textarea>
        
        <div className="form-footer">
          <div className="color-picker">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`color-btn ${selectedColor === c.name.toLowerCase() ? 'active' : ''}`}
                style={{ backgroundColor: c.value, borderColor: c.border }}
                onClick={() => setSelectedColor(c.name.toLowerCase())}
              />
            ))}
          </div>
          <button type="submit" className="submit-btn">Tempel!</button>
        </div>
      </form>

      <div className="board">
        {loading ? (
          <p className="status">Memuat getaran...</p>
        ) : notes.length === 0 ? (
          <p className="status">Belum ada catatan. Mulai tempel sesuatu!</p>
        ) : (
          <div className="board-canvas">
            {notes.map((note, index) => {
              const colorInfo = colors.find(c => c.name.toLowerCase() === note.color) || colors[0];
              
              return (
                <div 
                  key={note.id} 
                  className="note-card"
                  style={{ 
                    backgroundColor: colorInfo.value, 
                    borderColor: colorInfo.border,
                    transform: `rotate(${note.rotation}deg)`,
                    left: `${note.x}%`,
                    top: `${note.y}%`,
                    zIndex: notes.length - index
                  }}
                  onClick={() => setViewingNote(note)}
                >
                  {currentUser && currentUser.id === note.user_id && (
                    <button className="delete-btn" onClick={(e) => {
                      e.stopPropagation(); // Biar gajadi buka modal pas klik hapus
                      deleteNote(note.id);
                    }}>×</button>
                  )}
                  <p>{note.content}</p>
                  <div className="note-meta">
                    <strong>{note.user ? note.user.name : 'Unknown'}</strong>
                    <small>{new Date(note.created_at).toLocaleDateString()}</small>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL POP UP */}
      {viewingNote && (
        <div className="modal-backdrop" onClick={() => setViewingNote(null)}>
          <div 
            className="modal-content" 
            style={{ 
              backgroundColor: colors.find(c => c.name.toLowerCase() === viewingNote.color)?.value || '#fef3c7' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={() => setViewingNote(null)}>×</button>
            <div className="modal-body">
              <p>{viewingNote.content}</p>
              <div className="modal-footer">
                <span>Dibuat pada: {new Date(viewingNote.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
