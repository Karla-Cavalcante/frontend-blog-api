import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [name, setName] = useState('');  
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = { name, password };  

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin', JSON.stringify(data));
        navigate('/admin');
      } else {
        setErrorMessage(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      setErrorMessage('Erro de autenticação. Tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login de Admin</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Nome de usuário:</label>
          <input
            type="text"
            value={name}  
            onChange={(e) => setName(e.target.value)}  
            placeholder="Digite seu nome de usuário"
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
