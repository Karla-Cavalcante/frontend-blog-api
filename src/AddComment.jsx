import { useState } from "react";

function AddComment({ postId, setPosts }) {
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState(1); 

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const newComment = { content, authorId };

    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) {
        throw new Error("Falha ao comentar");
      }

      const data = await response.json();
      console.log("Comentário criado com sucesso:", data);

      
      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post.id === postId) {
            return { ...post, comments: [...post.comments, data] };
          }
          return post;
        });
      });

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
          />
        </div>
        <div>
          <label>Autor ID:</label>
          <input
            type="number"
            value={authorId}
            onChange={(e) => setAuthorId(Number(e.target.value))}
          />
        </div>
        <button type="submit">Comentar</button>
      </form>
    </div>
  );
}

export default AddComment;
