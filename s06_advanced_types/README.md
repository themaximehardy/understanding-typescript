# Advanced Types

### Useful Resources & Links

- [More on Advanced Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html)

### Intersection Types

With object type, the intersection type make the combination of the properties of the objects.

```ts
type Admin = {
  name: string;
  privilege: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee; // intersection type

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date(),
};
```

We could have use `interface` as well (but a bit more code):

```ts
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

interface ElevatedEmployee extends Employee, Admin {}
// type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Max',
  privilege: ['create-server'],
  startDate: new Date(),
};
```

With union type, the intersection type keep the type(s) they have in common.

```ts
type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric; // => type Universal = number
```

---

### More on Type Guards

```ts
type Combinable = string | number;

function add(a: Combinable, b: Combinable) {
  // the if below is a type guard, being sure our code run correctly at runtime
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
```

We need a type guard below because we don't know if `UnknownEmployee` will be an `Employee` or an `Admin` (which has `privileges` defined).

```ts
type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ', emp.name);
  console.log('Privileges: ', emp.privileges); // KO – Property 'privileges' does not exist on type 'UnknownEmployee'.
}
```

The solution is to check via `in` if the property exists:

```ts
type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ', emp.name);
  if ('privileges' in emp) {
    console.log('Privileges: ', emp.privileges);
  }
  if ('startDate' in emp) {
    console.log('Start Date: ', emp.startDate);
  }
}
```

And type guard with `class`:

```ts
class Car {
  drive() {
    console.log('Driving...');
  }
}

class Truck {
  drive() {
    console.log('Driving a truck...');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo...' + amount);
  }
}

type Vehicle = Car | Truck;
const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  // We could use this
  if ('loadCargo' in vehicle) {
    vehicle.loadCargo(1000);
  }
  // Or instanceof which is more elegant and less error prone
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);
```

---

### Discriminated Unions

If we have multiple animals, it will be a lot of repetitions:

```ts
interface Bird {
  flyingSpeed: number;
}

interface Horse {
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  if ('flyingSpeed' in animal) {
    console.log('Moving with speed: ', animal.flyingSpeed);
  }
  if ('runningSpeed' in animal) {
    console.log('Moving with speed: ', animal.runningSpeed);
  }
}
```

The solution would be to add `type` property which is a literal string and then use a `switch case`.

```ts
interface Bird {
  type: 'bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    case 'bird':
      speed = animal.flyingSpeed;
      break;
    case 'horse':
      speed = animal.runningSpeed;
      break;
    default:
      break;
  }

  console.log('Moving with speed: ', speed);
}

moveAnimal({ type: 'bird', flyingSpeed: 10 });
```

---

### Types Casting

```ts
const paragraph = document.querySelector('p'); // const paragraph: HTMLParagraphElement | null
const paragraphId = document.getElementById('message-output'); // const paragraphId: HTMLElement | null
const userInputElement = <HTMLInputElement>(
  document.getElementById('user-input')!
); // type casting

userInputElement.value = 'Hi there!';
```

Or if we use React:

```ts
const userInputElement = document.getElementById(
  'user-input',
)! as HTMLInputElement; // type casting
```

We add the `!` to say I'm sure this value would never be `null`.

```ts
const userInputElement = document.getElementById('user-input');

if (userInputElement) {
  (userInputElement as HTMLInputElement).value = 'Hi there!';
}
```

---

### Index Properties

We want an object return with all the errors we got when we use a form. For example: `{ email: 'Not a valid email', username: 'Must start with a character!' }` and we can loop through it (via a `for in`). We want to omit `null` value for property which don't have an error. We want an object which only holds properties for input where we have an error.

We need an object where we know the value type (it should be a string). But we don't know in advance how many properties it will have (and the name of the properties). We need index property type here.

```ts
interface ErrorContainer {
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email',
  username: 'Must start with a character!',
};
```

---

### Function Overloads

Go back to our `add` function:

```ts
type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

function add(a: Combinable, b: Combinable) {
  // the if below is a type guard, being sure our code run correctly at runtime
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result1 = add(1, 5); // const result: Combinable
const result2 = add('Max', 'Test'); // const result: Combinable

result2.split(' '); // KO – Property 'split' does not exist on type 'Combinable'.
```

The result is `Combinable` => it is a `string | number`. As a result, if we use 2 strings, `const result2 = add('Max', 'Test');` we can't call a `split(' ')` even if we know it will be a string returned. We could do that, but it is not optimal...

```ts
const result2 = add('Max', 'Test') as string;
```

We need to use function overload to solve it elegantly.

```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Combinable, b: Combinable) {
  //...
}
```

---

### Optional Chaining

Access safely a nested object via `?.`.

```ts
const fetchedUserData = {
  id: 'u1',
  name: 'Max',
  // job: { title: 'CEO', description: 'My own company' },
};

console.log(fetchedUserData?.job?.title);
```

---

### Nullish Coalescing

Be sure the value is `null` or `undefined` via nullish coalescing operator `??`.

```ts
const userInput = null; // "DEFAULT"
const userInput = undefined; // "DEFAULT"
const userInput = ''; // ''
const storedData = userInput ?? 'DEFAULT'; // ?? only null and undefined
```

---

### QUIZZ

#### Advanced Types

##### 1. What's a "Type Guard"?

A code pattern where you check for a certain type before you try to do something with it at runtime. With type guards you avoid runtime errors by checking types before you try to do something with the values.

##### 2. Which of the following type guards would ensure that you get NO runtime error?

a.

```ts
function size(input: string | number) {
  if (input instanceof 'string') {
    return input.length;
  }
  return input;
}
```

b.

```ts
function size(input: string | number) {
  if (<string>input) {
    return input.length;
  }
  return input;
}
```

c.

```ts
function size(input: string | number) {
  if (typeof input === 'string') {
    return input.length;
  }
  return input;
}
```

The correct answer is **c**.

##### 3. In which cases is type casting helpful?

You want to inform TS that a certain value is of a specific type.
