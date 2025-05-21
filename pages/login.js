import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './_app';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, role } = useContext(AuthContext);
  const router = useRouter();

  if (isAuthenticated) {
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'client') {
      router.push('/client');
    }
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <Link href="/" legacyBehavior>
          <a className="d-flex align-items-center text-decoration-none">
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>&larr;</span> Accueil
          </a>
        </Link>
      </div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
      <p className="mt-3">
        Pas encore de compte? <Link href="/register" legacyBehavior><a>Inscrivez-vous ici</a></Link>
      </p>
    </div>
  );
}
