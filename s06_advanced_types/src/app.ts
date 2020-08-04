type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date(),
};

// ---

// type Combinable = string | number;
// type Numeric = number | boolean;

// type Universal = Combinable & Numeric;

// function add(a: Combinable, b: Combinable) {
//   // the if below is a type guard, being sure our code run correctly at runtime
//   if (typeof a === 'string' || typeof b === 'string') {
//     return a.toString() + b.toString();
//   }
//   return a + b;
// }

// ---

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

printEmployeeInformation(e1);

// ---

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

// ---

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

// ---

const paragraph = document.querySelector('p'); // const paragraph: HTMLParagraphElement | null
const paragraphId = document.getElementById('message-output'); // const paragraphId: HTMLElement | null
// const userInputElement = <HTMLInputElement>(
//   document.getElementById('user-input')!
// ); // type casting

// const userInputElement = document.getElementById(
//   'user-input',
// )! as HTMLInputElement; // type casting

// userInputElement.value = 'Hi there!';

const userInputElement = document.getElementById('user-input');

if (userInputElement) {
  (userInputElement as HTMLInputElement).value = 'Hi there!';
}

// ---

// { email: 'Not a valid email', username: 'Must start with a character!' }
interface ErrorContainer {
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email',
  username: 'Must start with a character!',
};

// ---

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
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

// ---

const fetchedUserData = {
  id: 'u1',
  name: 'Max',
  // job: { title: 'CEO', description: 'My own company' },
};

// console.log(fetchedUserData?.job?.title);

// ---

// const userInput = null; // "DEFAULT"
// const userInput = undefined; // "DEFAULT"
const userInput = ''; // ''
const storedData = userInput ?? 'DEFAULT'; // ?? only null and undefined
