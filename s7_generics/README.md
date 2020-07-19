# Generics

### Useful Resources & Links

- [More on Generics](https://www.typescriptlang.org/docs/handbook/generics.html)

### Built-in Generics & What are Generics?

```ts
const names: Array<string> = ['Max', 'Manuel']; // same as string[]
names[0].split(' ');
```

```ts
const promise: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('This is done!');
  }, 2000);
});

promise.then((data) => {
  data.split(' '); // because of the generic type I tell TS data will be string
});
```

---

### Creating a Generic Function

Problem:

```ts
function merge(objA: object, objB: object) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max' }, { age: 30 });
mergedObj.name; // KO – Property 'name' does not exist on type 'object'.
```

Solution, create generic types:

```ts
function merge<T, U>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj1 = merge({ name: 'Max' }, { age: 30 });
// this is what is happening below
// const mergedObj1 = merge<{name:string}, {age: number}>({ name: 'Max' }, { age: 30 });
const mergedObj2 = merge({ name: 'Max', hobbies: ['sport'] }, { age: 30 });
mergedObj1.name; // OK
mergedObj2.age; // OK
```

It creates dynamically (when we call the function) a specific type.

> Note: convention is to start with `T`.

---

### Working with Constraints

What TS does with generic is: we pass some extra information into the `merge` function. As a result, we can better work with the result. They allow you to continue to work with your data in TS optimal way.

```ts
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max', hobbies: ['sport'] }, 30); // KO – Argument of type '30' is not assignable to parameter of type 'object'.
```

---

### Another Generic Function

```ts
interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let description = 'Got no value.';
  if (element.length === 1) {
    description = 'Got 1 element.';
  } else if (element.length > 1) {
    description = 'Got ' + element.length + ' element.';
  }
  return [element, description];
}

console.log(countAndDescribe('Hi there!'));
console.log(countAndDescribe(['sport', 'cooking']));
console.log(countAndDescribe([]));
```

---

### The "keyof" Constraint

```ts
function extractAndConvert(obj: object, key: string) {
  return obj[key];
  // KO – Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  // KO – No index signature with a parameter of type 'string' was found on type '{}'.
}
```

```ts
function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U,
) {
  return obj[key];
}

extractAndConvert({}, 'name'); // KO – Argument of type '"name"' is not assignable to parameter of type 'never'.
extractAndConvert({ name: 'Max' }, 'name'); // OK
```

---

### Generic Classes

```ts
class DataStorage<T> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Max');
textStorage.addItem('Manu');
textStorage.removeItem('Manu');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();
numberStorage.addItem(1);
numberStorage.addItem(2);
numberStorage.removeItem(3);
console.log(numberStorage.getItems());
```

---

### Generic Utility Types

`Partial<T>`

```ts
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date,
): CourseGoal {
  return { title, description, completeUntil: date };
}
```

```ts
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date,
): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  // do validation
  courseGoal.description = description;
  // do whatever
  courseGoal.completeUntil = date;
  return courseGoal as CourseGoal;
}
```

`Readonly<T>` (it works also on object)

```ts
const newNames: Readonly<string[]> = ['Max', 'Anna'];
newNames.push('Manu'); // KO – Property 'push' does not exist on type 'readonly string[]'.
```

---

### Generic Types vs Union Types

---

### QUIZZ

#### Generics

##### 1. When can "Generics" come in very handy?

In cases where you have a type that actually works together with multiple other possible types (e.g. an object which emits data of different types). Generics help you create data structures that work together or wrap values of a broad variety of types (e.g. an array that can hold any type of data).

##### 2. Would the following usage of a generic type make sense?

```ts
const data = extractData<string>(user, 'userId');
```

Yes, `extractData` probably returns different data based on the arguments you provide. This would be a perfect example where you might have some utility method that actually doesn't care too much about the data it operators on (it just fetches it after all).

##### 3. What's the idea behind constraints (when talking about generics)?

Constraints allow you to narrow down the concrete types that may be used in a generic function etc.
