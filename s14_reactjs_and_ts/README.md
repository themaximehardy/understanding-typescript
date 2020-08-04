# React.js & TypeScript

![app](screenshots/app.png?raw=true 'app')

### Useful Resources & Links

- [Official React Docs](https://reactjs.org/docs/getting-started.html)
- [More React Resources](https://academind.com/learn/react/)
- [create-react-app + TypeScript Docs](https://create-react-app.dev/docs/adding-typescript/)

---

### Setting Up a React + TypeScript Project

Let's read [this](https://create-react-app.dev/docs/adding-typescript/) (Create React App / Adding TypeScript).

```sh
yarn create react-app my-app --template typescript
```

Then, we can see a folder `my-app` with inside a `tsconfig.json` (which we can customise).

### How Do React + TypeScript Work Together?

```sh
yarn start
```

Go to `App.tsx` and look at the `App` component – `const App: React.FC ...` (**FC** for Functional Component). Because of TypeScript we've now access to new types `> s14_reactjs_and_ts/my-app/node_modules/@types/react`.

```tsx
import React from 'react';

const App: React.FC = () => {
  return <div className="App"></div>;
};

export default App;
```

### Working with Props and Types for Props

We've created an `App.tsx` which import a `TodoList` component. We're passing props (items) into it.

```tsx
// App.tsx
import React from 'react';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  const todos = [{ id: 't1', text: 'Finish the course' }];
  return (
    <div className="App">
      {/* A component that adds todos */}
      <TodoList items={todos} />
    </div>
  );
};

export default App;
```

We've created an interface `TodoListProps` which allows us to require only these specific props.

```tsx
// components / TodoList.tsx
import React from 'react';

interface TodoListProps {
  items: { id: string; text: string }[];
}

const TodoList: React.FC<TodoListProps> = (props) => {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
};

export default TodoList;
```

### Getting User Input with "refs"

```tsx
// components / NewTodo.tsx
import React, { useRef } from 'react';

const NewTodo: React.FC = () => {
  const textInputRef = useRef<HTMLInputElement>(null);

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredText = textInputRef.current!.value;
    console.log(enteredText);
  };

  return (
    <form onSubmit={todoSubmitHandler}>
      <div>
        <label htmlFor="todo-text">Todo Text</label>
        <input type="text" name="todo-text" ref={textInputRef} />
      </div>
      <button type="submit">ADD TODO</button>
    </form>
  );
};

export default NewTodo;
```

### Cross-Component Communication

We've added a function `todoAddHandler` and pass it as a props (pointer) to the `NewTodo` component.

```tsx
// App.tsx
//...
const App: React.FC = () => {
  //...
  const todoAddHandler = (text: string) => {
    console.log(text);
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} />
    </div>
  );
};

export default App;
```

We need to create a **type** (or an **interface**) `NewTodoProps` and we can pass the value of the input to the parent component `App`.

```tsx
// components / NewTodo.tsx
import React, { useRef } from 'react';

type NewTodoProps = {
  onAddTodo: (todoText: string) => void;
};

const NewTodo: React.FC<NewTodoProps> = (props) => {
  const textInputRef = useRef<HTMLInputElement>(null);

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredText = textInputRef.current!.value;
    props.onAddTodo(enteredText);
  };

  return (
    //...
  );
};

export default NewTodo;
```

### Working with State & Types

We've created a `todo.model.ts` file. We're going to reuse it elsewhere in our project.

```ts
// todo.model.ts
export interface Todo {
  id: string;
  text: string;
}
```

```tsx
// App.tsx
import React, { useState } from 'react';
import { Todo } from './todo.model';

import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const todoAddHandler = (text: string) => {
    setTodos([{ id: Math.random().toString(), text: text }]);
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} />
    </div>
  );
};

export default App;
```

### Managing State Better

```tsx
// App.tsx
import React, { useState } from 'react';
import { Todo } from './todo.model';

import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const todoAddHandler = (text: string) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Math.random().toString(), text: text },
    ]);
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} />
    </div>
  );
};

export default App;
```

### More Props & State Work

We've created a new function `todoDeleteHandler`. And we pass it through `TodoList` component as a props.

```tsx
// App.tsx
//...
const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  //...

  const todoDeleteHandler = (todoId: string) => {
    setTodos((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== todoId);
    });
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} onDeleteTodo={todoDeleteHandler} />
    </div>
  );
};

export default App;
```

We need to add the function definition in our `TodoListProps` interface. And we need to pass the `todoId` -> `onClick={props.onDeleteTodo.bind(null, todo.id)}`.

```tsx
// components / TodoList.tsx
import React from 'react';
import { Todo } from '../todo.model';

interface TodoListProps {
  items: Todo[];
  onDeleteTodo: (todoId: string) => void;
}

const TodoList: React.FC<TodoListProps> = (props) => {
  return (
    <ul>
      {props.items.map((todo) => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={props.onDeleteTodo.bind(null, todo.id)}>
            DELETE
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
```

### Types for other React Features (e.g. Redux or Routing)

You can use Redux with TypeScript (read more [here](https://redux.js.org/recipes/usage-with-typescript)). But you don't see any information about the [React Router](https://reactrouter.com/web/guides/quick-start). You should (as we saw previously, install the types) – `npm install --save-dev @types/react-router-dom`.
