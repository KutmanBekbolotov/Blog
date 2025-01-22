import React from "react";
import { Link } from "react-router-dom"; 

function Home() {
  return (
    <div>
      <h2>Welcome to Home Page</h2>
      <p>
        Go to <Link to="/blogs">Blogs</Link> to view all the posts.
      </p>
    </div>
  );
}

export default Home;