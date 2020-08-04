// type AddFn = (a: number, b: number) => number;
interface AddFn {
  (a: number, b: number): number; // no method name, same as above
}

let add: AddFn;

add = (n1: number, n2: number) => {
  return n1 + n2;
};

interface Named {
  readonly name?: string;
  outputName?: string; // optional property
  myMethod?(): void; // optional method
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable {
  name?: string;

  constructor(n: string) {
    if (n) {
      this.name = n;
    }
  }

  greet(phrase: string) {
    console.log(`${phrase} from ${this.name}`);
  }
}

let user1: Greetable;
user1 = new Person('Max');

// interface Person {
//   name: string;
//   age: number;

//   greet(phrase: string): void;
// }

// let user1: Person;

// user1 = {
//   name: 'Max',
//   age: 30,
//   greet(phrase: string) {
//     console.log(`${phrase} from ${this.name}`);
//   },
// };

// console.log(user1);
// console.log(user1.greet('Hi there –'));
