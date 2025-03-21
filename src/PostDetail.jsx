import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AddComment from "./AddComment";

function PostDetail({ posts, setPosts }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const selectedPost = posts.find((post) => post.id === parseInt(id));
    if (selectedPost) {
      setPost(selectedPost);
    }
  }, [id, posts]);

  if (!post) {
    return <p>Post não encontrado</p>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>

      <h3>Comentários</h3>
      {post.comments.length === 0 ? (
        <p>Não há comentários para este post.</p>
      ) : (
        post.comments.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>Autor {comment.authorId}</strong>: {comment.content}
            </p>
          </div>
        ))
      )}

      <AddComment postId={post.id} setPosts={setPosts} />
    </div>
  );
}

export default PostDetail;
