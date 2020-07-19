const names: Array<string> = ['Max', 'Manuel']; // same as string[]
// names[0].split(' ');

// const promise: Promise<string> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('This is done!');
//   }, 2000);
// });

// promise.then((data) => {
//   data.split(' '); // because of the generic type I tell TS data will be string
// });

// ---

// function merge(objA: object, objB: object) {
//   return Object.assign(objA, objB);
// }

// const mergedObj = merge({ name: 'Max' }, { age: 30 });
// mergedObj.name; // Property 'name' does not exist on type 'object'.

// function merge<T, U>(objA: T, objB: U): T & U
// function merge<T, U>(objA: T, objB: U) {
//   return Object.assign(objA, objB);
// }

// const mergedObj1 = merge({ name: 'Max' }, { age: 30 });
const mergedObj1 = merge<{ name: string }, { age: number }>(
  { name: 'Max' },
  { age: 30 },
);
const mergedObj2 = merge({ name: 'Max', hobbies: ['sport'] }, { age: 30 });
mergedObj1.name; // OK
mergedObj2.age; // OK

// ---

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max', hobbies: ['sport'] }, { age: 30 });

// ---

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

// ---

function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U,
) {
  return obj[key];
}

// extractAndConvert({}, 'name'); // KO – Argument of type '"name"' is not assignable to parameter of type 'never'.
extractAndConvert({ name: 'Max' }, 'name'); // OK

// ---

class DataStorage<T extends string | number | boolean> {
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

// const objStorage = new DataStorage<object>();
// objStorage.addItem({ name: 'Max' });
// objStorage.addItem({ name: 'Manu' });
// //...
// objStorage.removeItem({ name: 'Manu' }); // problem because objects work with reference
// console.log(objStorage.getItems());

// ---

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
  courseGoal.description = description;
  courseGoal.completeUntil = date;
  return courseGoal as CourseGoal;
}

const newNames: Readonly<string[]> = ['Max', 'Anna'];
// newNames.push('Manu'); // KO – Property 'push' does not exist on type 'readonly string[]'.

// ---
