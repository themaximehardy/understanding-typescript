# 3rd Party Libraries & TypeScript

We are going to look at how to combine "normal" libraries and using them with TypeScript? But also, TypeScript-specific libraries.

### Using JavaScript (!) Libraries with TS

We install `lodash`.

```sh
npm i --save lodash
```

Then we go in our `app.ts` and we import it, and we use the `shuffle` method. But it doesn't work.

```ts
import _ from 'lodash'; // KO – Could not find a declaration file for module 'lodash'.

console.log(_.shuffle([1, 2, 3]));
```

The problem here, `lodash` is a simple JS library, it is built with vanilla JS for vanilla JS.

> Note: it will work if we set `"noEmitOnError"` to `false` (but we're still going to see the error).

You can search for types – `@types/lodash`.

`DefinitelyTyped` offers code which describes the types used in a library, the `.d.ts` files (= declaration files). They contain instructions in TS. Translation from plain JS to TS (no logic, but only types).

---

### Using "declare" as a "Last Resort"

But, let's say we want to use a library which doesn't have the "declaration files". Here, we have added a `var GLOBAL` global variable. Which we want to use in our `app.ts`. We know it is available globally BUT we have an error.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Understanding TypeScript</title>
    <script src="dist/bundle.js" defer></script>
  </head>
  <body>
    <script>
      var GLOBAL = 'THIS IS SET';
    </script>
  </body>
</html>
```

The solution is to use `declare`:

```ts
import _ from 'lodash';
declare var GLOBAL: string; // We need to use declare
console.log(_.shuffle([1, 2, 3]));
console.log(GLOBAL);
```

---

### No Types Needed: class-transformer

Look at [`typestack/class-transformer`](https://github.com/typestack/class-transformer).

A common situation will be, we are fetching data from a server. An array of data, we got from the backend. When we receive `json` data, it has no attached data type to which constructor function can relate to. It is just basic data with no meta data attached to it.

Here is a Product class (model) – `product.model.ts`:

```ts
export class Product {
  title: string;
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }

  getInformation() {
    return [this.title, `$${this.price}`];
  }
}
```

If we transform manually an array of product into an instance of `Product`:

```ts
import { Product } from './product.model';

const products = [
  { title: 'A Carpet', price: 29.99 },
  { title: 'A Book', price: 10.99 },
];

const loadedProducts = products.map((prod) => {
  return new Product(prod.title, prod.price);
});

for (const prod of loadedProducts) {
  console.log(prod.getInformation());
}
```

Let's do it "automatically" with a class-loader:

```sh
npm i --save class-transformer && npm i --save reflect-metadata
```

```ts
import 'reflect-metadata';
import { Product } from './product.model';
import { plainToClass } from 'class-transformer';

const products = [
  { title: 'A Carpet', price: 29.99 },
  { title: 'A Book', price: 10.99 },
];

const loadedProducts = plainToClass(Product, products);

for (const prod of loadedProducts) {
  console.log(prod.getInformation());
}
```

---

### TypeScript-embracing: class-validator

Look at [`typestack/class-validator`](https://github.com/typestack/class-validator).

```sh
npm i --save class-validator
```

```ts
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class Product {
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsPositive()
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }

  getInformation() {
    return [this.title, `$${this.price}`];
  }
}
```
