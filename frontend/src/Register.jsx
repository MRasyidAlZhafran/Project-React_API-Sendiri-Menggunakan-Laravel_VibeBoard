import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

function Register({ setToken, switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      
      const token = response.data.token;
      // Simpan token ke localStorage
      localStorage.setItem('auth_token', token);
      setToken(token);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: 'Terjadi kesalahan saat mendaftar.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>✨ Daftar VibeBoard</h2>
        <p className="auth-subtitle">Buat akun barumu sekarang</p>
        
        {errors.general && <div className="auth-error">{errors.general}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required 
            />
            {errors.name && <small className="error-text">{errors.name[0]}</small>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required 
            />
            {errors.email && <small className="error-text">{errors.email[0]}</small>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required 
            />
            {errors.password && <small className="error-text">{errors.password[0]}</small>}
          </div>
          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input 
              type="password" 
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Ketik ulang password"
              required 
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>
        
        <p className="auth-switch">
          Sudah punya akun? <span onClick={switchToLogin}>Masuk di sini</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
