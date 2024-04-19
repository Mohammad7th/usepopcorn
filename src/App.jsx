import { useEffect, useState } from "react";
import Main from "./components/Main";
import NavBar from "./components/NavBar";
import NumResults from "./components/NumResults";
import MovieList from "./components/MovieList";
import Search from "./components/Search";
import Box from "./components/Box";
import WatchedSummery from "./components/WatchedSummery";
import WatchedMovieList from "./components/WatchedMovieList";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import StarRating from './components/StarRating'
import { useMovies } from "./hooks/useMovies";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useKey } from "./hooks/useKey";

const KEY = '10de09f';

export default function App() {

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, loading, error } = useMovies(query)
  const [watched, setWatched] = useLocalStorage([], 'watched')

  function handleSelectMovie(id) {
    setSelectedId(selectedId => id === selectedId ? null : id)
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }






  return (
    <>
      <NavBar >
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        {/* <Box element={<MovieList movies={movies} />} />
        <Box element={
          <>
            <WatchedSummery watched={watched} />
            <WatchedMovieList watched={watched} />
          </>
        } /> */}
        <Box>
          {/* {loading ? <Loader /> :
            <MovieList movies={movies} />
          } */}
          {loading && <Loader />}
          {!loading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box >
          {selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched} /> : <>
            <WatchedSummery watched={watched} />
            <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
          </>}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {

  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      // countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();

    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating) => (avgRating + userRating) / 2);
  }

  useKey('Escape', onCloseMovie)

  useEffect(function () {
    async function getMovieDetails() {
      setLoading(true)
      const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json()
      console.log('data', data);
      setMovie(data)
      setLoading(false)
    }
    getMovieDetails()
  }, [selectedId])

  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return function () {
      document.title = 'usePopcorn';
    }
  }, [title])
  return (


    <div className="details">
      {loading ? <Loader /> : <>
        <header>
          <button className="btn-back" onClick={onCloseMovie}>
            &larr;
          </button>
          <img src={poster} alt={`Poster of ${movie} movie`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p>
              <span>⭐️</span>
              {imdbRating} IMDb rating
            </p>
          </div>
        </header>
        <section>
          <div className="rating">
            {!isWatched ? (
              <>
                <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                {userRating > 0 && (<button className="btn-add" onClick={handleAdd}> + Add to list</button>)}
              </>
            ) : <p>You rated with movie {watchedUserRating} <span>⭐️</span></p>}

          </div>
          <p>
            <em>{plot}</em>
          </p>
          <p>Starring {actors}</p>
          <p>Directed by {director}</p>
        </section>
      </>}

    </div>
  )
}