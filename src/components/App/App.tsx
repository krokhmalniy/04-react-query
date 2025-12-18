import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import css from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const trimmedQuery = query.trim();

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["movies", trimmedQuery, page],
    queryFn: () => fetchMovies(trimmedQuery, page),
    enabled: trimmedQuery.length > 0,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (nextQuery: string) => {
    const nextTrimmed = nextQuery.trim();

    setQuery(nextQuery);
    setPage(1);

    // Якщо запит порожній — просто не буде запиту (enabled: false),
    // а сторінка вже скинута на 1 без useEffect.
    if (nextTrimmed.length === 0) {
      setSelectedMovie(null);
    }
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {(isPending || isFetching) && <Loader />}

      {isError && (
        <ErrorMessage
          message={error instanceof Error ? error.message : "Error"}
        />
      )}

      {!isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={openModal} />
      )}

      {!isPending &&
        !isError &&
        trimmedQuery.length > 0 &&
        movies.length === 0 && <ErrorMessage message="No movies found." />}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
