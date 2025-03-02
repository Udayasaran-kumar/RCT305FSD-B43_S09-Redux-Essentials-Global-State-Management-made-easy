// Import dependencies
import React from "react";
import { createStore } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";

// Define action types
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// Action creators
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// Initial state
const initialState = { count: 0 };

// Reducer function
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

// Create Redux store
const store = createStore(counterReducer);

// Counter component
const Counter = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.count);

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold">Counter: {count}</h1>
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
      <p className="mt-4">State: {JSON.stringify({ count })}</p>
    </div>
  );
};

// App component
const App = () => {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
};

export default App;
