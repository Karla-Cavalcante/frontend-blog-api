import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import PostDetail from "./PostDetail"; 
import Admin from "./Admin"; 
import "./global.css";
import Home from "./components/Home"; 
import PrivateRoute from "./components/PrivateRoute";   
import Login from "./components/Login"; 


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");  
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/posts`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Erro ao carregar posts:", error));
  }, []);

  
  const addPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  
  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  
  const deletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("authToken", data.token);
      setName("");
      setPassword("");
      navigate("/admin");
    } else {
      setErrorMessage(data.message || "Erro no login.");
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Blog Tech</h1>
        <nav>
          <Link to="/">Início</Link> | <Link to="/login">Login</Link> |{" "}
          <Link to="/admin">Administração</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/post/:id" element={<PostDetail posts={posts} setPosts={setPosts} />} />

        <Route
          path="/login"
          element={
            <div className="login-container">
              <h2>Login</h2>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <form onSubmit={handleLogin}>
                <div>
                  <label htmlFor="name">Nome de usuário:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome de usuário"
                  />
                </div>
                <div>
                  <label htmlFor="password">Senha:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                  />
                </div>
                <button type="submit">Entrar</button>
              </form>
            </div>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin addPost={addPost} updatePost={updatePost} deletePost={deletePost} />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
