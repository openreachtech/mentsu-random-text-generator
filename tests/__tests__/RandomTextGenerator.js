import crypto from 'node:crypto'

import RandomTextGenerator from '../../lib/RandomTextGenerator.js'

const eachArray = [...Array(5)]

describe('RandomTextGenerator', () => {
  test('.create()', () => {
    const generator = RandomTextGenerator.create()

    expect(generator)
      .toBeInstanceOf(RandomTextGenerator)
  })
})

describe('RandomTextGenerator', () => {
  describe('#seeds', () => {
    test('default seeds', () => {
      const generator = RandomTextGenerator.create()

      expect.each(generator.seeds)
        .toBe.each([
          '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
          'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
          'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        ])
    })

    describe('custom seeds', () => {
      const table = [
        {
          seedString: '0123456789',
          expectedSeeds: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        {
          seedString: '0123456789#$%&',
          expectedSeeds: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '$', '%', '&'],
        },
      ]

      test.each(table)('$seedString', ({ seedString, expectedSeeds }) => {
        const generator = RandomTextGenerator.create({
          seedString,
        })

        expect.each(generator.seeds)
          .toBe.each(expectedSeeds)
      })
    })
  })
})

describe('RandomTextGenerator', () => {
  describe('.get:crypto', () => {
    describe('when called as is', () => {
      test('should be fixed value', () => {
        const received = RandomTextGenerator.crypto

        expect(received)
          .toBe(crypto) // same reference
      })
    })
  })
})

describe('RandomTextGenerator', () => {
  describe('#get:Ctor', () => {
    class AlphaRandomTextGenerator extends RandomTextGenerator {}

    class BetaRandomTextGenerator extends RandomTextGenerator {}

    describe('should be constructor of instance', () => {
      const cases = [
        {
          input: {
            Generator: RandomTextGenerator,
          },
          expected: RandomTextGenerator,
        },
        {
          input: {
            Generator: AlphaRandomTextGenerator,
          },
          expected: AlphaRandomTextGenerator,
        },
        {
          input: {
            Generator: BetaRandomTextGenerator,
          },
          expected: BetaRandomTextGenerator,
        },
      ]

      test.each(cases)('Generator: $input.Generator.name', ({ input, expected }) => {
        const generator = input.Generator.create()

        const received = generator.Ctor

        expect(received)
          .toBe(expected) // same reference
      })
    })
  })
})

describe('RandomTextGenerator', () => {
  describe('#generate()', () => {
    describe('default length (10)', () => {
      describe('default seeds [0-9A-Za-z]', () => {
        test.each(eachArray)('default seeds: #%', () => {
          const generator = RandomTextGenerator.create()

          expect(generator.generate())
            .toMatch(/^[0-9A-Za-z]{10}$/u)
        })
      })

      describe('custom seeds', () => {
        const table = [
          {
            seedString: '0123456789',
            matcher: /^\d{10}$/u,
          },
          {
            seedString: '0123456789abcdefghijklmnopqrstuvwxyz#$%&',
            matcher: /^[0-9a-z#$%&]{10}$/u,
          },
        ]

        test.each(table)('$seedString', ({ seedString, matcher }) => {
          const generator = RandomTextGenerator.create({
            seedString,
          })

          expect(generator.generate())
            .toMatch(matcher)
        })
      })
    })
  })
})

describe('RandomTextGenerator', () => {
  describe('#generate()', () => {
    const cases = [
      5,
      10,
      32,
      64,
    ]

    describe.each(cases)('custom length [%d]', expectedLength => {
      describe('default seeds [0-9A-Za-z]', () => {
        const regexp = new RegExp(`^[0-9A-Za-z]{${expectedLength}}$`, 'u')

        test.each(eachArray)('default seeds: #%', () => {
          const generator = RandomTextGenerator.create()
          const text = generator.generate({
            length: expectedLength,
          })

          expect(text)
            .toHaveLength(expectedLength)
          expect(text)
            .toMatch(regexp)
        })
      })

      describe('custom seeds', () => {
        const table = [
          {
            seedString: '0123456789',
            matcher: new RegExp(`^\\d{${expectedLength}}$`, 'u'),
          },
          {
            seedString: '0123456789abcdefghijklmnopqrstuvwxyz#$%&',
            matcher: new RegExp(`^[0-9a-z#$%&]{${expectedLength}}$`, 'u'),
          },
        ]

        test.each(table)('$seedString', ({ seedString, matcher }) => {
          const generator = RandomTextGenerator.create({
            seedString,
          })
          const text = generator.generate({
            length: expectedLength,
          })

          expect(text)
            .toHaveLength(expectedLength)
          expect(text)
            .toMatch(matcher)
        })
      })
    })
  })
})

describe('RandomTextGenerator', () => {
  describe('#generate()', () => {
    describe('when crypto.randomInt() is called three times', () => {
      const cases = [
        {
          override: {
            drawnIndex: 3,
          },
          input: {
            seedString: '0123456789',
            length: 3,
          },
          expected: {
            seedsLength: 10,
            text: '333',
          },
        },
        {
          override: {
            drawnIndex: 25,
          },
          input: {
            seedString: 'abcdefghijklmnopqrstuvwxyz',
            length: 3,
          },
          expected: {
            seedsLength: 26,
            text: 'zzz',
          },
        },
      ]

      test.each(cases)('seedString: $input.seedString', ({ override, input, expected }) => {
        const randomIntSpy = jest.spyOn(crypto, 'randomInt')
          .mockReturnValue(override.drawnIndex)

        const createArgs = {
          seedString: input.seedString,
        }
        const generator = RandomTextGenerator.create(createArgs)
        const generateArgs = {
          length: input.length,
        }

        const received = generator.generate(generateArgs)

        expect(randomIntSpy)
          .toHaveBeenCalledTimes(3)
        // The seed count is the whole of the argument: the draw is bounded, never reduced.
        expect(randomIntSpy)
          .toHaveBeenNthCalledWith(1, expected.seedsLength)
        expect(randomIntSpy)
          .toHaveBeenNthCalledWith(2, expected.seedsLength)
        expect(randomIntSpy)
          .toHaveBeenNthCalledWith(3, expected.seedsLength)
        // The drawn value indexes the seeds as it stands.
        expect(received)
          .toBe(expected.text)
      })
    })

    describe('when crypto.randomInt() is called twice', () => {
      const cases = [
        {
          override: {
            drawnIndex: 2,
          },
          input: {
            seedString: '#$%&',
            length: 2,
          },
          expected: {
            seedsLength: 4,
            text: '%%',
          },
        },
        {
          override: {
            drawnIndex: 7,
          },
          input: {
            seedString: 'ABCDEFGHIJKL',
            length: 2,
          },
          expected: {
            seedsLength: 12,
            text: 'HH',
          },
        },
      ]

      test.each(cases)('seedString: $input.seedString', ({ override, input, expected }) => {
        const randomIntSpy = jest.spyOn(crypto, 'randomInt')
          .mockReturnValue(override.drawnIndex)

        const createArgs = {
          seedString: input.seedString,
        }
        const generator = RandomTextGenerator.create(createArgs)
        const generateArgs = {
          length: input.length,
        }

        const received = generator.generate(generateArgs)

        expect(randomIntSpy)
          .toHaveBeenCalledTimes(2)
        expect(randomIntSpy)
          .toHaveBeenNthCalledWith(1, expected.seedsLength)
        expect(randomIntSpy)
          .toHaveBeenNthCalledWith(2, expected.seedsLength)
        expect(received)
          .toBe(expected.text)
      })
    })

    describe('when crypto.randomInt() is called once', () => {
      const cases = [
        {
          override: {
            drawnIndex: 0,
          },
          input: {
            seedString: 'xyz',
            length: 1,
          },
          expected: {
            seedsLength: 3,
            text: 'x',
          },
        },
        {
          override: {
            drawnIndex: 4,
          },
          input: {
            seedString: '01234',
            length: 1,
          },
          expected: {
            seedsLength: 5,
            text: '4',
          },
        },
      ]

      test.each(cases)('seedString: $input.seedString', ({ override, input, expected }) => {
        const randomIntSpy = jest.spyOn(crypto, 'randomInt')
          .mockReturnValue(override.drawnIndex)

        const createArgs = {
          seedString: input.seedString,
        }
        const generator = RandomTextGenerator.create(createArgs)
        const generateArgs = {
          length: input.length,
        }

        const received = generator.generate(generateArgs)

        expect(randomIntSpy)
          .toHaveBeenCalledTimes(1)
        expect(randomIntSpy)
          .toHaveBeenNthCalledWith(1, expected.seedsLength)
        expect(received)
          .toBe(expected.text)
      })
    })

    describe('when crypto.randomInt() is not called', () => {
      const cases = [
        {
          input: {
            seedString: 'pqrstu',
            length: 0,
          },
        },
        {
          input: {
            seedString: '567',
            length: 0,
          },
        },
      ]

      test.each(cases)('seedString: $input.seedString', ({ input }) => {
        const randomIntSpy = jest.spyOn(crypto, 'randomInt')

        const createArgs = {
          seedString: input.seedString,
        }
        const generator = RandomTextGenerator.create(createArgs)
        const generateArgs = {
          length: input.length,
        }

        const received = generator.generate(generateArgs)

        expect(randomIntSpy)
          .not
          .toHaveBeenCalled()
        expect(received)
          .toBe('')
      })
    })
  })
})
