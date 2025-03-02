// Import dependencies
import React from "react";
import { createStore } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

// Define action types
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const DELETE_TODO = "DELETE_TODO";

// Action creators
const addTodo = (title) => ({ type: ADD_TODO, payload: { id: uuidv4(), title, status: false } });
const toggleTodo = (id) => ({ type: TOGGLE_TODO, payload: id });
const deleteTodo = (id) => ({ type: DELETE_TODO, payload: id });

// Initial state
const initialState = { todos: [] };

// Reducer function
const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload] };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload ? { ...todo, status: !todo.status } : todo
        ),
      };
    case DELETE_TODO:
      return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };
    default:
      return state;
  }
};

// Create Redux store
const store = createStore(todoReducer);

// TodoList component
const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const [title, setTitle] = React.useState("");

  const handleAddTodo = () => {
    if (title.trim()) {
      dispatch(addTodo(title));
      setTitle("");
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a todo"
          className="px-2 py-1 border rounded"
        />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleAddTodo}
        >
          Add Todo
        </button>
      </div>
      <ul className="mt-4">
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center w-64 p-2 border-b">
            <span className={todo.status ? "line-through" : ""}>{todo.title}</span>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => dispatch(toggleTodo(todo.id))}
              >
                {todo.status ? "Undo" : "Complete"}
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => dispatch(deleteTodo(todo.id))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4">State: {JSON.stringify(todos)}</p>
    </div>
  );
};

// App component
const App = () => {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
};

export default App;
