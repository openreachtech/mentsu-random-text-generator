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
