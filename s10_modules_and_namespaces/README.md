# Modules & Namespaces

### Useful Resources & Links

- [JavaScript Modules (Overview)](https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b)
- [More on ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

### Writing Module Code – Your Options

What is our options when we want to split our code in multiple files? We have **3 options**.

1. The first option would be to simply write multiple code files and then TS will automatically compile all code files in the `src` directory and manually import the compiled JS into HTML. You could use it BUT... you'll have to manage all these imports manually which can be cumbersome and error prone. You'll also lose certain TS features (no type support between files...). As a result, it is not a great option for bigger projects.

2. **Namespace and File Bundling** – namespace is a TS feature, a syntax feature (you can add special code to your code to use this feature). It allows you to basically group code together below a namespace and then import namespace into other files. You could have a namespace per file for example. TS does not only support that but it also bundles the files together into one file (=> you have less imports to manage AND you don't need to manually manage ≠ imports).

3. **ES6 Imports/Exports** (RECOMMENDED) – It's totally detached from TS, modern JS has also a solution for this problem. Modern JS stripped out out of the box supports import and export statements which allows to tell which file depends on which other file. You don't need to manage imports manually. TS supports ES6 import/export syntax. You compile per file but you only need one script import because modern browsers know how to fetch all our dependencies. But you need to bundling via third-party tools (e.g. Webpack).

---

### Working with Namespaces

This notation is only understand by TS. We you look at the compiled files in JS (you can see 3). But they are not "linked", they are compiled standalone. We created a namespace `App` which is understand only in the TS world not in JS.

`app.ts`

```ts
// app.ts (at the top)
/// <reference path="drag-drop-interfaces.ts" />
/// <reference path="project-model.ts" />

namespace App {
  // ALL THE CODE
}
```

`drag-drop-interfaces.ts` wrap all the code in the namespace `App` + don't forget to export interface, class, function,...

```ts
// drag-drop-interfaces.ts
namespace App {
  export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }

  export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
  }
}
```

`project-model.ts` wrap all the code in the namespace `App` + don't forget to export interface, class, function,...

```ts
// project-model.ts
namespace App {
  export enum ProjectStatus {
    Active,
    Finished,
  }

  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: ProjectStatus,
    ) {}
  }
}
```

The solution here is to set up the value of `outFile` in the `tsconfig.json`. Uncomment and add a file `bundle.js` is a convention name. Change module value from `commonjs` to `amd`.

```ts
"module": "amd" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
//...
"outFile": "./dist/bundle.js" /* Concatenate and emit output to single file. */,
```

---

### Organising Files & Folders

`app.ts`

```ts
// MODELS
/// <reference path="models/drag-drop.ts" />
/// <reference path="models/project.ts" />
//STATE
/// <reference path="state/project-state.ts" />
//UTIL
/// <reference path="util/validation.ts" />
// DECORATORS
/// <reference path="decorators/autobind.ts" />
// COMPONENTS
/// <reference path="components/project-list.ts" />
/// <reference path="components/project-input.ts" />

namespace App {
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
```

---

### A Problem with Namespace Imports

It is a good practice to call the reference/call the correct file when you need it and not call them all in the `app.ts`.

`app.ts`

```ts
/// <reference path="components/project-list.ts" />
/// <reference path="components/project-input.ts" />

namespace App {
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
```

`project-input.ts`

```ts
/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {...}
```

---

### Using ES Modules

`app.ts` – now imports `import { XXX } from './folderA/fileA.js';` (do not forget `.js`).

```ts
import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
```

`tsconfig.json` – module should be `es2015`.

```json
//...
"target": "es6",
"module": "es2015",
//...
```

`index.html` – remove `defer` and add `type="module"`.

```html
<script type="module" src="../dist/app.js"></script>
```

---

### Understanding various Import & Export Syntaxes

`import { Validatable, validate }`

```ts
import { Validatable, validate } from '../util/validation.js';
//...
const titleValidatable: Validatable = {
  value: enteredTitle,
  required: true,
};
//...
if (
  !validate(titleValidatable) ||
  !validate(descriptionValidatable) ||
  !validate(peopleValidatable)
) {
  alert('Invalid input, please try again!');
  return;
}
```

Grouping – `import * as Validation`

```ts
import * as Validation from '../util/validation.js';
//...
const titleValidatable: Validation.Validatable = {
  value: enteredTitle,
  required: true,
};
//...
if (
  !Validation.validate(titleValidatable) ||
  !Validation.validate(descriptionValidatable) ||
  !Validation.validate(peopleValidatable)
) {
  alert('Invalid input, please try again!');
  return;
}
```

Renaming alias – `import { Autobind as autBind }`. It is useful to avoid name clashes.

```ts
import { Autobind as autBind } from '../decorators/autobind.js';
//...
@autBind
  private submitHandler(event: Event) {
    //...
```

Export default and not by name – `export default abstract class Component...`. You can have only ONE export default in a file (but you can have multiple exports, only one default).

```ts
export const something = '...';

export default abstract class Component...
```

You can choose the name, here `Cmp` because we have exported `Component` as default.

```ts
import Cmp from './base-component.js';
```

---

### How Does Code In Modules Execute?

A file called (imported) several times its loaded once (the first time) and is not executed anymore.
