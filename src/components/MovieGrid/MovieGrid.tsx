import type { FC } from "react";
import type { Movie } from "../../types/movie";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const MovieGrid: FC<MovieGridProps> = ({ movies, onSelect }) => {
  return (
    <ul className={styles.grid}>
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `${IMAGE_BASE}${movie.poster_path}`
          : null;

        return (
          <li
            key={movie.id}
            className={styles.item}
            onClick={() => onSelect(movie)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelect(movie);
            }}
          >
            <div className={styles.card}>
              {posterUrl ? (
                <img
                  className={styles.poster}
                  src={posterUrl}
                  alt={movie.title}
                  loading="lazy"
                />
              ) : (
                <div className={styles.noPoster}>No image</div>
              )}
              <p className={styles.title}>{movie.title}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default MovieGrid;
