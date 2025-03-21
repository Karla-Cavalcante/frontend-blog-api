import { Link } from 'react-router-dom'; 

function PostCard({ post }) {
  return (
    <div className="post">
      <h4>{post.title}</h4>
      <p>{post.content.substring(0, 150)}...</p>
      <Link to={`/post/${post.id}`}>Leia mais</Link> 
    </div>
  );
}

export default PostCard;
