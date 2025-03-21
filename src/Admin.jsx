import { useState, useEffect } from "react";
import "./Admin.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Admin({ addPost, updatePost, deletePost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/posts`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Erro ao carregar posts:", error));
  }, []);

  
  const handleCreateOrUpdatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("Você precisa estar logado para criar ou editar posts.");
      return;
    }

    const postData = { title, content };

    try {
      let response, data;
      if (editingPost) {
        response = await fetch(`${BACKEND_URL}/api/posts/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error("Erro ao editar post");
        data = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === data.id ? data : post))
        );
        setSuccessMessage("Post atualizado com sucesso!");
      } else {
        
        response = await fetch(`${BACKEND_URL}/api/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });
        if (!response.ok) throw new Error("Erro ao criar post");
        data = await response.json();
        setPosts((prevPosts) => [...prevPosts, data]);
        setSuccessMessage("Post criado com sucesso!");
      }
      setTitle("");
      setContent("");
      setEditingPost(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  
  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  
  const handleDelete = async (postId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("Você precisa estar logado para excluir posts.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir post");
      }

      
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setSuccessMessage("Post excluído com sucesso!");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="admin-container">
      <h2>{editingPost ? "Editar Post" : "Criar Novo Post"}</h2>

      <form onSubmit={handleCreateOrUpdatePost} className="admin-form">
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do post"
          />
        </div>
        <div className="form-group">
          <label>Conteúdo:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite o conteúdo do post"
          />
        </div>
        <button type="submit">
          {editingPost ? "Salvar Alterações" : "Criar Post"}
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h3>Posts Criados</h3>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.content.substring(0, 100)}...</p>
            <button onClick={() => handleEdit(post)}>Editar</button>
            <button onClick={() => handleDelete(post.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
