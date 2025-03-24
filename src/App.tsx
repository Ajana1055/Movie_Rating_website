import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import axios from "axios";

const API_KEY = "9b3f8ab8";

const SearchMovies: React.FC = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);

  const searchMovies = async () => {
    const response = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    setMovies(response.data.Search || []);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchMovies();
    }
  };

  return (
    <div>
      <h1>Search Movie</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={searchMovies}>Search</button>
      <div>
        {movies.map((movie) => (
          <div key={movie.imdbID}>
            <Link to={`/movie/${movie.imdbID}`}>
              <img src={movie.Poster} alt={movie.Title} width="100" />
              <p>{movie.Title} ({movie.Year})</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const MovieDetails: React.FC<{ id: string }> = ({ id }) => {
  const [movie, setMovie] = useState<any>(null);

  React.useEffect(() => {
    axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`).then((res) => {
      setMovie(res.data);
    });
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h1>{movie.Title}</h1>
      <img src={movie.Poster} alt={movie.Title} />
      <p>Release Year: {movie.Year}</p>
      <p>Rating: {movie.imdbRating}</p>
      <Link to="/movie">Back to Search</Link>
    </div>
  );
};

const MovieDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <MovieDetails id={id} /> : <p>No movie selected</p>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/movie" element={<SearchMovies />} />
        <Route path="/movie/:id" element={<MovieDetailsWrapper />} />
      </Routes>
    </Router>
  );
};

export default App;