# Node.js + Express & TypeScript

Nodejs is not capable of interpret TS. It means you have to compile TS file first in order to execute the JS file.

### Setting up a Project

```sh
npm install --save express body-parser
npm install --save-dev nodemon
```

### Finished Setup & Working with Types (in Node + Express Apps)

```sh
npm install --save-dev @types/node
npm install --save-dev @types/express
```

👆 because of these types, we know have the autocompletion in our code.

```ts
import express from 'express';

const app = express();

app.listen(3000);
```

Open 2 terminals:

```sh
#1
tsc -w
```

```json
// package.json
{
  //...
  "scripts": {
    //...
    "start": "nodemon dist/app.js"
  }
}
```

```sh
#2
npm start
```

Each time we make a change, `tsc` in watch mode will compile the TS into JS and the server will restart based on the JS compiled.

### Adding Middleware & Types

```ts
// src / routes / todos.ts
import { Router } from 'express';

const router = Router();

router.post('/');
router.get('/');
router.patch('/:id');
router.delete('/:id');

export default router;
```

```ts
// src / app.ts
import express, { Request, Response, NextFunction } from 'express';

import todoRoutes from './routes/todos';

const app = express();

app.use('/todos', todoRoutes);

// Error Handling Middleware Function
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000);
```

### Working with Controllers & Parsing Request Bodies

```ts
import { Request, Response, NextFunction } from 'express';

export const createTodo = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

// OR we can simplify it

import { RequestHandler } from 'express';

export const createTodo: RequestHandler = (req, res, next) => {};
```

### Working with Controllers & Parsing Request Bodies

```ts
// src / controllers / todos.ts
import { RequestHandler } from 'express';

import { Todo } from '../models/todo';

const TODOS: Todo[] = []; // we use in memory (erased each time the compiler run)

export const createTodo: RequestHandler = (req, res, next) => {
  const text = (req.body as { text: string }).text;
  const newTodo = new Todo(Math.random().toString(), text);

  TODOS.push(newTodo);

  res.status(201).json({ message: 'Created the todo.', createdTodo: newTodo });
};
```

```ts
// src / models / todo.ts
export class Todo {
  constructor(public id: string, public text: string) {}
}
```

```ts
// src / routes / todos.ts
import { Router } from 'express';

const router = Router();

router.post('/', createTodo);
//...

export default router;
```

```ts
// src / app.ts
import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

import todoRoutes from './routes/todos';

const app = express();

app.use(json());

app.use('/todos', todoRoutes);

// Error Handling Middleware Function
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000);
```
