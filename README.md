# mentsu-random-text-generator

A random text generator that builds strings of any length from a customizable character set.

## Installation

Requires Node.js 20.x (the version the CI builds against).

```sh
npm install @openreachtech/mentsu-random-text-generator
```

It is an ES module (`"type": "module"`); import it with ESM `import` syntax.

## Usage

Create a generator and generate a random string. With no arguments, it draws from
`0-9A-Za-z` (62 characters) and produces 10 characters.

```js
import { RandomTextGenerator } from '@openreachtech/mentsu-random-text-generator'

const generator = RandomTextGenerator.create()

const text = generator.generate()
// e.g. 'aZ3kR9mQ1x' (10 characters from 0-9A-Za-z)
```

Pass `seedString` to restrict the character set, and `length` to change the output size.

```js
const generator = RandomTextGenerator.create({
  seedString: '0123456789',
})

const text = generator.generate({
  length: 6,
})
// e.g. '481920' (6 digits)
```

## API

Class members are written with the following notation.

| notation | members |
| :-- | :-- |
| `#instanceProperty` | instance property |
| `#instanceMethod()` | instance method |
| `#get:instanceGetter` | instance getter |
| `#set:instanceSetter` | instance setter |
| `.staticProperty` | static property |
| `.staticMethod()` | static method |
| `.get:staticGetter` | static getter |
| `.set:staticSetter` | static setter |

### `.create()`

Factory method that returns a new instance.

```js
RandomTextGenerator.create({ seedString })
```

| parameter | type | default | description |
| :-- | :-- | :-- | :-- |
| `seedString` | `string` | `'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'` | Characters to draw from. |

Returns a `RandomTextGenerator` instance.

### `#generate()`

Generates a random string by picking characters from the seed set.

Each character is drawn with [`crypto.randomInt()`](https://nodejs.org/api/crypto.html#cryptorandomintmax-callback)
from `node:crypto`, so the output is safe for values whose whole purpose is that
they cannot be guessed — a temporary password, an OAuth `state` parameter. Every
seed is equally likely: `randomInt()` rejects and redraws rather than reducing a
byte modulo the seed count, which would make the first few seeds more likely
than the rest.

```js
generator.generate({ length })
```

| parameter | type | default | description |
| :-- | :-- | :-- | :-- |
| `length` | `number` | `10` | Number of characters to generate. |

Returns a `string`.

### `#seeds`

The array of characters used for generation. It is the `seedString` split into code
points, so multi-byte characters are kept intact.

```js
const generator = RandomTextGenerator.create({
  seedString: 'ab#',
})

generator.seeds
// ['a', 'b', '#']
```

### `.get:crypto`

The `node:crypto` module `#generate()` draws through. Override it in a subclass to
draw from a different source — a deterministic one in a test, say. `#generate()`
reaches the getter through `#get:Ctor`, so a subclass's own is the one that answers.

```js
class StubbedTextGenerator extends RandomTextGenerator {
  static get crypto () {
    return {
      randomInt: () => 0,
    }
  }
}

StubbedTextGenerator.create()
  .generate()
// '0000000000' (the first seed, every time)
```

## Contribution

Bug reports, feature requests, and code contributions are welcome.

Feel free to contact us through GitHub Issues.

```sh
git clone https://github.com/openreachtech/mentsu-random-text-generator.git
cd mentsu-random-text-generator
npm install
npm run lint
npm test
```

## License

This project is released under the Apache License 2.0.

For more details, please see [in the LICENSE file](./LICENSE).

## Developer

[Open Reach Tech Inc.](https://openreach.tech)

## Copyright

© 2026 Open Reach Tech Inc.
