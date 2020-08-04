# Decorators

### Useful Resources & Links

- [More on Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

### A First Class Decorator

Decorators can be very useful for meta-programming. A decorator is a `function`.

Decorators execute when your class is defined not when it is instantiating.

```ts
function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}

@Logger
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();
console.log(pers);
```

---

### Working with Decorators Factories

```ts
// Decorator Factory
function Logger(logString: string) {
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

@Logger('LOGGING - PERSON')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();
console.log(pers);
```

---

### Building More Useful Decorators

```ts
function withTemplate(template: string, hookId: string) {
  return function (_: Function) {
    // _ we know there is a param but we don't need to use it
    const hookEl = document.getElementById(hookId);
    if (hookEl) {
      hookEl.innerHTML = template;
    }
  };
}

@withTemplate('<h1>My Person Class</h1>', 'app') // we need to add "<div id="app"></div>" in index.html
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();
console.log(pers);
```

```ts
function withTemplate(template: string, hookId: string) {
  return function (constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  };
}
```

Note: Angular is using decorators, for example `@Component`.

---

### Adding Multiple Decorators

You can call multiple decorators on a `class`. But in which order these decorators (`Logger` or `withTemplate`) are executed? Bottom-Up `withTemplate` first and the `Logger`.

```ts
@Logger('LOGGING - PERSON')
@withTemplate('<h1>My Person Class</h1>', 'app')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();
console.log(pers);
```

---

### Diving into Property Decorators

As we saw, we can apply decorator to a `class`. But also to a **property** (a field).

```ts
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;
  private _price: number;

  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price – should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
```

---

### Accessor & Parameter Decorators

Look at `Log2`, `Log3` and `Log4`.

```ts
// property / field decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

// accessor decorator
function Log2(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor,
) {
  console.log('Accessor decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// method decorator
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor,
) {
  console.log('Method decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// parameter decorator
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price – should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}
```

---

### When Do Decorators Execute?

Decorators run without instantiating the class (without calling `new`). The decorators allow us to do "**behind the scene**" work when the class is defined.

---

### Returning (and changing) a Class in a Class Decorator

[Rewatch it](https://www.udemy.com/course/understanding-typescript/learn/lecture/16935728).

```ts
function withTemplate(template: string, hookId: string) {
  return function <T extends { new (...args: any[]): { name: string } }>(
    originalConstructor: T,
  ) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log('Rendering template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}
```

---

### Other Decorator Return Types

Only decorators for **accessors** and **methods** can return something. **property / field** and **parameter** can also return something but TS will ignore it.

---

### Example: Creating an "Autobind" Decorator

```ts
class Printer {
  message = 'This works!';

  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button');
button?.addEventListener('click', p.showMessage); // undefined
```

We get `undefined`. The reason for that with an event listener if we point at a function it should be excecuted. The `this` keyword inside of the function will not have the same context or reference as it has if we call just `p.showMessage()` in this case `p` will refer to the `Printer`. In this scenario here where we use an event listener this will refer to the target of the event because `addEventListener` binds `this` in the function which is executed to the target of the event.

A work around would be:

```ts
button?.addEventListener('click', p.showMessage.bind(p));
```

`Autobind` decorator bind the `this` automatically to the methods which are called with it.

```ts
function Autobind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this); // here the this is bind
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button');
button?.addEventListener('click', p.showMessage);
```

---

### Validation with Decorators – First Steps

Here is the idea, create decorators we use to validate data (here an object) based on user inputs.

```ts
function Required() {}

function PositiveNumber() {}

function validate(obj: object) {}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  console.log(createdCourse);
});
```

---

### Validation with Decorators – Finished

A first naive validator using decorators.

```ts
interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; // e.g. ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...registeredValidators[target.constructor.name][propName],
      'required',
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...registeredValidators[target.constructor.name][propName],
      'positive',
    ],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  console.log(createdCourse);
});
```
