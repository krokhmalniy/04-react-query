import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";

const App = () => {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const trimmedQuery = query.trim();

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["movies", trimmedQuery, page],
    queryFn: () => fetchMovies(trimmedQuery, page),
    enabled: trimmedQuery.length > 0,
    // Keeps previous page results while loading the next page
    placeholderData: (previous) => previous,
  });

  const movies = useMemo(() => data?.results ?? [], [data]);
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof Error ? error.message : "Failed to load movies";
      toast.error(message);
    }
  }, [isError, error]);

  const handleSearch = (nextQuery: string) => {
    const q = nextQuery.trim();
    if (!q) return;

    if (q !== trimmedQuery) {
      setPage(1);
    }
    setQuery(q);
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <SearchBar onSearch={handleSearch} />

      {isPending && <Loader />}
      {isError && <ErrorMessage />}

      {!isPending && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {!isPending && !isError && trimmedQuery && movies.length === 0 && (
        <ErrorMessage />
      )}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* subtle feedback when changing pages */}
      {isFetching && !isPending && <Loader />}
    </div>
  );
};

export default App;
