import { default as RandomTextGeneratorCtor } from '../../lib/RandomTextGenerator.js'

import {
  RandomTextGenerator,
} from '../../index.js'

describe('main exports', () => {
  test('RandomTextGenerator is exported', () => {
    expect(RandomTextGenerator)
      .toBe(RandomTextGeneratorCtor) // same reference
  })
})
