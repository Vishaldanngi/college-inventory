import { useState } from 'react';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // <-- new state for errors
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(''); // clear previous error
    try {
      const res = await api.post('/auth/login', { email, password });

      // Save token + user in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Notify App about login
      onLogin(res.data.token, res.data.user);

      // Redirect to inventory
      navigate('/inventory');
    } catch (err: any) {
      // Show backend error if exists
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl mb-4">Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Login
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
