import { useState, useEffect } from "react";
import "./Admin.css"; 

function Admin({ addPost }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState(1);
  const [posts, setPosts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [editingPost, setEditingPost] = useState(null); 

  
  useEffect(() => {
    fetch("http://localhost:5001/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data)) 
      .catch((error) => console.error("Erro ao carregar posts:", error));
  }, []);

  
  const handleCreateOrUpdatePost = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      content,
      authorId,
    };

    try {
      let response;
      let data;

      if (editingPost) {
        
        response = await fetch(`http://localhost:5001/api/posts/${editingPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        });
        data = await response.json();
        setSuccessMessage("Post atualizado com sucesso!");
      } else {
        
        response = await fetch("http://localhost:5001/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        });
        data = await response.json();
        setSuccessMessage("Post criado com sucesso!");
      }

      if (!response.ok) {
        throw new Error("Falha ao salvar post");
      }

      
      setPosts((prevPosts) => {
        if (editingPost) {
          
          return prevPosts.map((post) =>
            post.id === editingPost.id ? data : post
          );
        } else {
          
          return [...prevPosts, data];
        }
      });

     
      setTitle("");
      setContent("");
      setAuthorId(1); 
      setErrorMessage(""); 
      setEditingPost(null); 
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      setErrorMessage("Erro ao salvar post, tente novamente.");
      setSuccessMessage(""); 
    }
  };

  
  const handleEditPost = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setAuthorId(post.authorId);
    setEditingPost(post);
  };

  
  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir post");
      }

      
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setSuccessMessage("Post excluído com sucesso!");
      setErrorMessage(""); 
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      setErrorMessage("Erro ao excluir post, tente novamente.");
      setSuccessMessage(""); 
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
        <div className="form-group">
          <label>Autor ID:</label>
          <input
            type="number"
            value={authorId}
            onChange={(e) => setAuthorId(Number(e.target.value))}
            placeholder="ID do autor"
          />
        </div>
        <button type="submit">{editingPost ? "Salvar Alterações" : "Criar Post"}</button>
      </form>

      {/* Exibe mensagem de sucesso ou erro */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h3>Posts Criados</h3>
      <div className="posts-list">
        {posts.length === 0 ? (
          <p>Nenhum post encontrado</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <h4>{post.title}</h4>
              <p>{post.content.substring(0, 100)}...</p>
              <button onClick={() => handleEditPost(post)}>Editar</button>
              <button onClick={() => handleDeletePost(post.id)}>Excluir</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
