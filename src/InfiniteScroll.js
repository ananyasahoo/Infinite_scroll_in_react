import React, { useCallback, useState, useEffect } from "react";
const InfiniteScroll = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your API endpoint
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      setData((prevData) => [...prevData, ...result]); // Append new data
      setHasMore(result.length > 0); // Check if there is more data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Load the next page
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on component unmount
    };
  }, [handleScroll]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Infinite Scroll</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.map((item) => (
          <li
            key={item.id}
            style={{
              margin: "10px 0",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>

      {loading && <p>Loading...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error} <button onClick={fetchData}>Retry</button>
        </p>
      )}

      {!hasMore && !loading && <p>No more data to load</p>}
    </div>
  );
};

export default InfiniteScroll;
