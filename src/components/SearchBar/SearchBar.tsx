import type { FC } from "react";
import styles from "./SearchBar.module.css";
import { toast } from "react-hot-toast";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const handleFormAction = (formData: FormData) => {
    const query = formData.get("query");

    if (!query || typeof query !== "string" || query.trim() === "") {
      toast.error("Please enter a search term...");
      return;
    }

    onSearch(query.trim());
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit TMDB
        </a>

        <form action={handleFormAction} className={styles.form}>
          <input
            type="text"
            name="query"
            className={styles.input}
            placeholder="Search movies..."
          />

          <button type="submit" className={styles.button}>
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default SearchBar;
