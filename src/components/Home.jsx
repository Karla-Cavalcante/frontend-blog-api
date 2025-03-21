import PostCard from "./PostCard"; 

function Home({ posts }) {
  return (
    <div>
      <section className="intro">
        <h2>Bem-vindo ao meu blog!</h2>
        <p>
          Explore uma variedade de artigos sobre tecnologia, estilo de vida e muito mais.
        </p>
      </section>

      
      <div className="container">
        <div className="posts">
          {posts.length === 0 ? (
            <p>Nenhum post encontrado</p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

