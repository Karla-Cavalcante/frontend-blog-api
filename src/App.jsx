import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PostDetail from "./PostDetail"; 
import Admin from "./Admin"; 
import './global.css';
import Home from "./components/Home"; 
import PrivateRoute from './components/PrivateRoute';   
import Login from "./components/Login"; 

function App() {
  const [posts, setPosts] = useState([]);

 
  const addPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  useEffect(() => {
    
    fetch("http://localhost:5001/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))  
      .catch((error) => console.error("Erro ao carregar posts:", error));
  }, []);

  return (
    <div className="App">
      {}
      <header>
        <h1>Blog Tech</h1>
        <nav>
          <Link to="/">Início</Link> | <Link to="/login">Login</Link> | <Link to="/admin">Administração</Link>
        </nav>
      </header>

      {}
      <Routes>
        {}
        <Route
          path="/"
          element={<Home posts={posts} />} 
        />

        {}
        <Route
          path="/post/:id"
          element={<PostDetail posts={posts} setPosts={setPosts} />}
        />

        
        <Route
          path="/login"
          element={<Login />} 
        />

        
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin addPost={addPost} /> 
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
