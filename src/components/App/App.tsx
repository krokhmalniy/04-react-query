import { useEffect, useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";

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
  const hasQuery = trimmedQuery.length > 0;

  const { data, isPending, isError, error, isFetching, isSuccess } = useQuery({
    queryKey: ["movies", trimmedQuery, page],
    queryFn: () => fetchMovies(trimmedQuery, page),
    enabled: hasQuery,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  // Щоб не показувати toast багато разів для одного й того ж запиту
  const lastNoResultsToastQueryRef = useRef<string>("");

  useEffect(() => {
    if (!hasQuery) return;

    // Запит успішний, але результатів немає
    if (isSuccess && movies.length === 0) {
      // показуємо toast тільки один раз на конкретний trimmedQuery
      if (lastNoResultsToastQueryRef.current !== trimmedQuery) {
        toast("No movies found for your query");
        lastNoResultsToastQueryRef.current = trimmedQuery;
      }
    }
  }, [hasQuery, isSuccess, movies.length, trimmedQuery]);

  const handleSearch = (nextQuery: string) => {
    setQuery(nextQuery);
    setPage(1);

    // коли користувач запускає новий пошук/очищає — скидаємо "пам'ять" про toast
    lastNoResultsToastQueryRef.current = "";

    if (nextQuery.trim().length === 0) {
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

      {hasQuery && (isPending || isFetching) && <Loader />}

      {isError && (
        <ErrorMessage
          message={error instanceof Error ? error.message : "Error"}
        />
      )}

      {!isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={openModal} />
      )}

      {!isPending && !isError && hasQuery && movies.length === 0 && (
        <ErrorMessage message="No movies found." />
      )}

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
