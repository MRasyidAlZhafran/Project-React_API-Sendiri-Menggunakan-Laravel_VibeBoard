import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

function Login({ setToken, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });
      
      const token = response.data.token;
      // Simpan token ke localStorage
      localStorage.setItem('auth_token', token);
      setToken(token);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.email[0]);
      } else {
        setError('Terjadi kesalahan saat login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>✨ Masuk VibeBoard</h2>
        <p className="auth-subtitle">Silakan login untuk melanjutkan</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required 
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        
        <p className="auth-switch">
          Belum punya akun? <span onClick={switchToRegister}>Daftar di sini</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
