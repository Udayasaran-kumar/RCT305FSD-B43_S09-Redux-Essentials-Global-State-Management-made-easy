// Import dependencies
import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

// Define action types
const ADD_BOOK = "ADD_BOOK";
const TOGGLE_READ_STATUS = "TOGGLE_READ_STATUS";
const DELETE_BOOK = "DELETE_BOOK";
const EDIT_BOOK = "EDIT_BOOK";
const FILTER_BOOKS = "FILTER_BOOKS";

// Action creators
const addBook = (title, author, genre) => ({ 
  type: ADD_BOOK, 
  payload: { id: uuidv4(), title, author, genre, read: false } 
});
const toggleReadStatus = (id) => ({ type: TOGGLE_READ_STATUS, payload: id });
const deleteBook = (id) => ({ type: DELETE_BOOK, payload: id });
const editBook = (id, updatedDetails) => ({ type: EDIT_BOOK, payload: { id, updatedDetails } });
const filterBooks = (criteria) => ({ type: FILTER_BOOKS, payload: criteria });

// Initial states
const initialBooksState = { books: [] };
const initialFilterState = { filter: "" };

// Books reducer
const booksReducer = (state = initialBooksState, action) => {
  switch (action.type) {
    case ADD_BOOK:
      return { ...state, books: [...state.books, action.payload] };
    case TOGGLE_READ_STATUS:
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload ? { ...book, read: !book.read } : book
        ),
      };
    case DELETE_BOOK:
      return { ...state, books: state.books.filter(book => book.id !== action.payload) };
    case EDIT_BOOK:
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload.id ? { ...book, ...action.payload.updatedDetails } : book
        ),
      };
    default:
      return state;
  }
};

// Filter reducer
const filterReducer = (state = initialFilterState, action) => {
  switch (action.type) {
    case FILTER_BOOKS:
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({ books: booksReducer, filter: filterReducer });

// Create Redux store
const store = createStore(rootReducer);

// BookList component
const BookList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [genre, setGenre] = React.useState("");

  const handleAddBook = () => {
    if (title.trim() && author.trim() && genre.trim()) {
      dispatch(addBook(title, author, genre));
      setTitle("");
      setAuthor("");
      setGenre("");
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold">Book Library</h1>
      <div className="mt-4 flex gap-2">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="px-2 py-1 border rounded" />
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="px-2 py-1 border rounded" />
        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" className="px-2 py-1 border rounded" />
        <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleAddBook}>Add Book</button>
      </div>
      <ul className="mt-4">
        {books.map((book) => (
          <li key={book.id} className="flex justify-between items-center w-64 p-2 border-b">
            <span className={book.read ? "line-through" : ""}>{book.title} by {book.author} ({book.genre})</span>
            <div className="flex gap-2">
              <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => dispatch(toggleReadStatus(book.id))}>
                {book.read ? "Unread" : "Read"}
              </button>
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => dispatch(deleteBook(book.id))}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4">State: {JSON.stringify(books)}</p>
    </div>
  );
};

// App component
const App = () => {
  return (
    <Provider store={store}>
      <BookList />
    </Provider>
  );
};

export default App;
