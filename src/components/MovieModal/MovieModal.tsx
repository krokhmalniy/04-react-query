import { useCallback, useEffect, type FC, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import styles from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

const MovieModal: FC<MovieModalProps> = ({ movie, onClose }) => {
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleEsc]);

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE}${movie.backdrop_path}`
    : null;

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.close} type="button" onClick={onClose}>
          ✕
        </button>

        {backdropUrl ? (
          <img className={styles.image} src={backdropUrl} alt={movie.title} />
        ) : (
          <div className={styles.imageFallback}>No image</div>
        )}

        <div className={styles.content}>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.overview}>{movie.overview || "No overview."}</p>

          <div className={styles.meta}>
            <p>
              <strong>Release Date:</strong> {movie.release_date || "—"}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average?.toFixed(1) ?? "—"}/10
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;
