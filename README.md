# Not Sorry - Joke Collection App

A React + Redux Toolkit + React Router practice project for discovering, saving, and creating your own jokes. Never forget a good joke again!

## 📋 About

**Not Sorry** is a web app built to practice modern React concepts and state management. It combines API-driven joke discovery with personal joke creation, allowing you to:

- 🎭 Browse jokes from multiple categories
- ❤️ Save your favorite jokes
- ✍️ Create and manage personal jokes
- 🔐 Access restricted content with password protection
- 🌐 View content in multiple languages (Italian support planned)

## 🚀 Features

### Current Features

- **Joke Categories**: Browse jokes by Programming, Dark, Misc, and Pun categories
- **Content Filtering**: Toggle explicit content visibility with authentication
- **Password Protection**: Dark and Explicit categories are protected (requires credentials)
- **Favorites System**: Save your favorite jokes for quick access
- **Personal Jokes**: Create and manage your own joke collection
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop
- **Two-Part Jokes**: Proper formatting for setup/delivery style jokes

### Planned Features

- 🗄️ **Local Storage**: Persist favorites and personal jokes to browser storage
- 🔑 **Better Authentication**: Replace hardcoded password with proper user authentication
- 🇮🇹 **Italian Support**: Multi-language interface and Italian joke sources
- 📱 **Progressive Web App**: Offline support and installable app
- 📊 **Joke Stats**: Track most-liked categories and joke performance

## 🛠️ Tech Stack

- **Frontend**: React 19
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **APIs**: JokeAPI v2

## 🎮 Usage

### Browsing Jokes

1. Click a category in the sidebar (Programming, Misc, Pun etc...)
2. Jokes are fetched and displayed in a grid

### Protected Content

1. Click **Dark** or **Explicit** categories
2. Enter credentials when prompted:
   - Username: Any value (e.g., "user123")
   - Password: `password123` (change in `src/components/PasswordModal.jsx`)
3. Access restricted content after authentication

### Saving Favorites

- Click the **Favorite** button on any joke card
- Favorited jokes are highlighted in purple

### Creating Personal Jokes

- Navigate to **My Jokes** section
- Add new jokes with setup/delivery format
- Delete jokes you no longer want

### Content Filtering

- Click **Explicit** in the sidebar to toggle explicit content visibility
- Works independently for each category

## 📁 Project Structure

```
src/
├── components/
│   ├── JokeCard.jsx          # Individual joke display
│   ├── PasswordModal.jsx      # Authentication modal
│   └── AppLayout.jsx          # Main layout wrapper
├── features/
│   └── jokes/
│       └── jokesSlice.js      # Redux state & thunks
├── pages/
│   ├── ApiJokes.jsx           # Joke browsing page
│   ├── UserJokes.jsx          # Personal jokes page
│   ├── Header.jsx             # Navigation header
│   └── Sidebar.jsx            # Category navigation
├── services/
│   └── apiJokes.js            # JokeAPI integration
├── App.jsx                    # Main app component
├── store.js                   # Redux store configuration
└── main.jsx                   # Entry point
```

## 🔐 Authentication

**Current Implementation:**

- Password protection for Dark and Explicit categories
- Hardcoded password in `PasswordModal.jsx` (line 13)
- Session-based (resets on page reload)

**To Change Password:**

```javascript
// src/components/PasswordModal.jsx - Line 13
const CORRECT_PASSWORD = "your-password-here";
```

**Future Plan:**

- Backend authentication with user accounts
- Persistent sessions with tokens
- Role-based access control

## 🌐 API Integration

Uses [JokeAPI](https://jokeapi.dev/) v2 for joke data.

**Current Endpoint:**

```
https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun?amount=10&blacklistFlags={flags}
```

**Blacklist Flags:**

- Normal content: `nsfw,religious,political,racist,sexist,explicit`
- Dark category: `nsfw,religious,political,racist,sexist,explicit`
- Explicit category (authenticated): `religious,political,racist,sexist` (allows nsfw + explicit)

## 🗺️ Roadmap

### Phase 1: Storage (Next)

- [ ] Implement Local Storage for favorites
- [ ] Persist personal jokes to browser
- [ ] Add "Export/Import" functionality

### Phase 2: Multi-Language

- [ ] Add Italian language support
- [ ] Create Italian joke API integration
- [ ] Language selector in header
- [ ] Translate UI strings

### Phase 3: Enhanced Auth

- [ ] Firebase authentication
- [ ] User accounts and profiles
- [ ] Persistent login sessions
- [ ] Shared joke collections

### Phase 4: Polish

- [ ] Dark mode toggle
- [ ] Joke search/filter
- [ ] Category tags on personal jokes
- [ ] Analytics dashboard

## 📝 Redux State Shape

```javascript
{
  jokes: {
    apiJokes: [],          // Jokes from API
    userJokes: [],         // User-created jokes
    favorites: [],         // IDs of favorited jokes
    categories: [],        // Available categories
    currentCategory: "",   // Selected category
    showDirty: false,      // Explicit content toggle
    isAuthenticated: false,// Password protection status
    loading: false,        // Fetch loading state
    error: null            // Error messages
  }
}
```

## 🧪 Testing

Currently tested manually. Future plans:

- Jest unit tests for Redux slices
- React Testing Library for components
- E2E tests with Cypress

## 🚀 Deployment

### GitHub Pages

App is configured for GitHub Pages deployment:

```bash
npm run build
npm run deploy
```

**Live URL**: `https://ApolloG01.github.io/not-sorry/`

### Custom Domain

## 🐛 Known Issues / TODOs

- [ ] Local Storage implementation for data persistence
- [ ] Italian language support
- [ ] Better password management (environment variables)
- [ ] Mobile keyboard handling for forms
- [ ] Error boundary for API failures
- [ ] Loading skeleton screens
- [ ] Joke pagination/lazy loading

## 💡 Learning Goals

This project is designed to practice:

✅ **React Hooks**: useState, useEffect, useCallback, useReducer  
✅ **Redux Toolkit**: slices, thunks, selectors  
✅ **React Router**: dynamic routing, URL parameters, nested routes  
✅ **Async Operations**: API calls, loading states, error handling  
✅ **State Management**: global state, local state, derived state  
✅ **Tailwind CSS**: responsive design, utility classes  
✅ **Component Architecture**: composition, prop drilling avoidance

## 📄 License

MIT License - feel free to use this as a learning reference!

## 🤝 Contributing

This is a practice project, but feel free to fork and experiment!

---

**Built with ❤️ for learning React**
