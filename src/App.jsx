import { useState, useEffect } from "react";
import Search from "./components/search";
import ErrorState from "./components/errorState";
import PostCard from "./components/postCard";

const App = () => {
  // api declarations
  const API_URL = "https://dummyjson.com/posts";

  // usestate declarations
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");

  const FetchPosts = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed To Fetch Posts");
      const data = await response.json();
      const normalizedPosts = data.posts || data;
      setPosts(normalizedPosts);
      setFilteredPosts(normalizedPosts);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search term
  const filterPosts = (searchValue) => {
    if (!searchValue) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(
      (post) => post.id.toString() === searchValue.toString()
    );
    setFilteredPosts(filtered);
  };

  // method to retry on error
  const handleRetry = () => {
    FetchPosts();
  };

  useEffect(() => {
    FetchPosts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    filterPosts(debounceSearchTerm);
  }, [debounceSearchTerm, posts]);

  // Loading Component
  const LoadingComponent = () => (
    <div className="loading">
      <div className="loading__spinner"></div>
      <div className="loading__text">
        Loading posts
        <div className="loading__dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-state__icon">📝</div>
      <h3 className="empty-state__title">No Posts Found</h3>
      <p className="empty-state__message">
        {searchTerm
          ? `No post found with ID "${searchTerm}". Try searching for a different post ID.`
          : "There are no posts available at the moment. Please try again later."}
      </p>
    </div>
  );

  return (
    <>
      <header className="header">
        <h1 className="header__title">Posts Dashboard</h1>
        <p className="header__subtitle">Discover and explore amazing posts</p>
      </header>

      <div className="container">
        <div className="search-container">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {error && (
          <ErrorState
            error={error}
            onRetry={handleRetry}
            maxAttempts={3}
            retryDelay={3}
          />
        )}

        {loading && <LoadingComponent />}

        {!loading && !error && filteredPosts.length === 0 && <EmptyState />}

        {!loading && !error && filteredPosts.length > 0 && (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
