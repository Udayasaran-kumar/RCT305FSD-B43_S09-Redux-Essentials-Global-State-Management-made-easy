// Import dependencies
import React, { useEffect, useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import thunk from "redux-thunk";

// Define action types
const FETCH_MATCHES_REQUEST = "FETCH_MATCHES_REQUEST";
const FETCH_MATCHES_SUCCESS = "FETCH_MATCHES_SUCCESS";
const FETCH_MATCHES_FAILURE = "FETCH_MATCHES_FAILURE";
const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";
const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
const SET_FILTER = "SET_FILTER";

// Action creators
const fetchMatchesRequest = () => ({ type: FETCH_MATCHES_REQUEST });
const fetchMatchesSuccess = (matches) => ({ type: FETCH_MATCHES_SUCCESS, payload: matches });
const fetchMatchesFailure = (error) => ({ type: FETCH_MATCHES_FAILURE, payload: error });
const toggleFavorite = (id) => ({ type: TOGGLE_FAVORITE, payload: id });
const setSearchQuery = (query) => ({ type: SET_SEARCH_QUERY, payload: query });
const setFilter = (filter) => ({ type: SET_FILTER, payload: filter });

// Async action to fetch matches
const fetchMatches = () => {
  return async (dispatch) => {
    dispatch(fetchMatchesRequest());
    try {
      const response = await fetch("https://jsonmock.hackerrank.com/api/football_matches?page=2");
      const data = await response.json();
      dispatch(fetchMatchesSuccess(data.data));
    } catch (error) {
      dispatch(fetchMatchesFailure(error.message));
    }
  };
};

// Initial state
const initialMatchesState = { isLoading: false, isError: false, footballMatches: [], favorites: [] };
const initialFilterState = { searchQuery: "", filter: "" };

// Matches reducer
const matchesReducer = (state = initialMatchesState, action) => {
  switch (action.type) {
    case FETCH_MATCHES_REQUEST:
      return { ...state, isLoading: true, isError: false };
    case FETCH_MATCHES_SUCCESS:
      return { ...state, isLoading: false, footballMatches: action.payload };
    case FETCH_MATCHES_FAILURE:
      return { ...state, isLoading: false, isError: true };
    case TOGGLE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    default:
      return state;
  }
};

// Filter reducer
const filterReducer = (state = initialFilterState, action) => {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case SET_FILTER:
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({ matches: matchesReducer, filter: filterReducer });

// Create Redux store with middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

// MatchList component
const MatchList = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, footballMatches, favorites } = useSelector((state) => state.matches);
  const { searchQuery } = useSelector((state) => state.filter);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const filteredMatches = footballMatches.filter((match) =>
    match.team1.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.team2.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold">Football Matches</h1>
      <input
        type="text"
        placeholder="Search matches"
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="mt-4 px-2 py-1 border rounded"
      />
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching data.</p>}
      <ul className="mt-4">
        {filteredMatches.map((match) => (
          <li key={match.fifa_id} className="flex justify-between items-center w-64 p-2 border-b">
            <span>
              {match.team1} vs {match.team2} ({match.match_date})
            </span>
            <button
              className={`px-2 py-1 rounded ${favorites.includes(match.fifa_id) ? "bg-red-500" : "bg-green-500"} text-white`}
              onClick={() => dispatch(toggleFavorite(match.fifa_id))}
            >
              {favorites.includes(match.fifa_id) ? "Unfavorite" : "Favorite"}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4">State: {JSON.stringify(footballMatches)}</p>
    </div>
  );
};

// App component
const App = () => {
  return (
    <Provider store={store}>
      <MatchList />
    </Provider>
  );
};

export default App;
