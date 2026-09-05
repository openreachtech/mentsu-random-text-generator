# mentsu-random-text-generator

任意の長さのランダムな文字列を、カスタマイズ可能な文字集合から生成するジェネレーターです。

## インストール

Node.js 20.x が必要です（CI がビルド対象とするバージョン）。

```sh
npm install @openreachtech/mentsu-random-text-generator
```

ES モジュール（`"type": "module"`）です。ESM の `import` 構文でインポートしてください。

## 使い方

ジェネレーターを生成してランダムな文字列を作ります。引数なしの場合は `0-9A-Za-z`
（62 文字）から 10 文字を生成します。

```js
import { RandomTextGenerator } from '@openreachtech/mentsu-random-text-generator'

const generator = RandomTextGenerator.create()

const text = generator.generate()
// 例: 'aZ3kR9mQ1x'（0-9A-Za-z から 10 文字）
```

`seedString` で文字集合を絞り込み、`length` で出力の長さを変更できます。

```js
const generator = RandomTextGenerator.create({
  seedString: '0123456789',
})

const text = generator.generate({
  length: 6,
})
// 例: '481920'（数字 6 文字）
```

## API

クラスメンバーは以下の表記に従って記述します。

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

新しいインスタンスを返す factory メソッドです。

```js
RandomTextGenerator.create({ seedString })
```

| パラメーター | 型 | デフォルト | 説明 |
| :-- | :-- | :-- | :-- |
| `seedString` | `string` | `'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'` | 生成に使う文字。 |

`RandomTextGenerator` のインスタンスを返します。

### `#generate()`

シード文字集合から文字を選び、ランダムな文字列を生成します。

1 文字ごとの抽出には `node:crypto` の
[`crypto.randomInt()`](https://nodejs.org/api/crypto.html#cryptorandomintmax-callback)
を使います。そのため、推測されないことが存在意義であるような値
— 仮パスワード、OAuth の `state` パラメーター — にそのまま使えます。
また、どのシードも等確率です。`randomInt()` はシード数で剰余を取らず、
範囲外を引いたら引き直します。剰余では先頭の数文字が他より出やすくなります。

```js
generator.generate({ length })
```

| パラメーター | 型 | デフォルト | 説明 |
| :-- | :-- | :-- | :-- |
| `length` | `number` | `10` | 生成する文字数。 |

`string` を返します。

### `#seeds`

生成に使う文字の配列です。`seedString` をコードポイント単位で分割したもので、
マルチバイト文字はそのまま保持されます。

```js
const generator = RandomTextGenerator.create({
  seedString: 'ab#',
})

generator.seeds
// ['a', 'b', '#']
```

## コントリビューション

バグ報告・機能要望・コード貢献を歓迎します。

GitHub Issues からお気軽にご連絡ください。

```sh
git clone https://github.com/openreachtech/mentsu-random-text-generator.git
cd mentsu-random-text-generator
npm install
npm run lint
npm test
```

## ライセンス

本プロジェクトは Apache License 2.0 で公開されています。

詳細は [LICENSE ファイル](./LICENSE) を参照してください。

## 開発者

[Open Reach Tech Inc.](https://openreach.tech)

## 著作権

© 2026 Open Reach Tech Inc.
