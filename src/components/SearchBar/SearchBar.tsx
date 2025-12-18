import { useState, type FC, type FormEvent } from "react";
import { toast } from "react-hot-toast";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [value, setValue] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = value.trim();

    if (!query) {
      toast.error("Please enter a search term...");
      return;
    }

    onSearch(query);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Movie Search</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            name="query"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.input}
            placeholder="Search movies..."
            autoComplete="off"
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
