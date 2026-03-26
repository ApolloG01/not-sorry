export interface JokeI {
  id?: number | string;
  joke_id?: number | string;
  supabase_id?: string;
  text?: string;
  isUserJoke?: boolean;
  category: string;
  setup?: string;
  delivery?: string;
  joke?: string;
  type?: "twopart" | "single";
  flags?: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  safe?: boolean;
  lang?: string;
}

export interface JokeCardPropsI {
  joke: JokeI;
  isUserJoke?: boolean | undefined;

  editable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface JokesStateI {
  apiJokes: JokeI[];
  favorites: JokeI[];
}

export interface JokesStateI {
  apiJokes: JokeI[];
  userJokes: JokeI[];
  favorites: JokeI[];
  categories: string[];
  currentCategory: string;
  showDirty: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | undefined | null;
}

export interface CategoryMapI {
  programming: string;
  misc: string;
  dark: string;
  pun: string;
}

export interface FetchJokesArgsI {
  category: string;
  showDirty: boolean;
  isDark: boolean;
}

export interface PasswordModalI {
  isOpen: boolean;
  onClose: () => void;
  pendingCategory: string | null;
  onAuthSuccess: (category: string) => void;
}

export interface FavoriteJoke {
  id: number;
  setup?: string;
  isUserJoke?: boolean;
  delivery?: string;
  text?: string;
  category: string;
}
