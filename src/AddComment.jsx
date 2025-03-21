import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function AddComment({ postId, setPosts }) {
  const [content, setContent] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const newComment = { content }; 

    try {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao comentar");
      }

      const data = await response.json();
      console.log("Comentário criado com sucesso:", data);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: [...post.comments, data] } : post
        )
      );

      setContent("");
    } catch (error) {
      console.error("Erro ao comentar:", error);
    }
  };

  return (
    <div>
      <h4>Adicionar Comentário</h4>
      <form onSubmit={handleCommentSubmit}>
        <div>
          <label>Comentário:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite seu comentário"
          />
        </div>
        <button type="submit">Comentar</button>
      </form>
    </div>
  );
}

export default AddComment;
