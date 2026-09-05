import crypto from 'node:crypto'

const defaultSeeds = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * Random text generator.
 */
export default class RandomTextGenerator {
  /**
   * Constructor.
   *
   * @param {{
   *   seeds: Array<string>
   * }} params - Parameters.
   */
  constructor ({
    seeds,
  }) {
    this.seeds = seeds
  }

  /**
   * Factory method.
   *
   * @param {{
   *   seedString?: string
   * }} [params] - Parameters.
   * @returns {RandomTextGenerator} - Instance of this class.
   */
  static create ({
    seedString = defaultSeeds,
  } = {}) {
    return new this({
      seeds: [...seedString],
    })
  }

  /**
   * get: Crypto module.
   *
   * @returns {typeof crypto} - Crypto module.
   */
  static get crypto () {
    return crypto
  }

  /**
   * get: Constructor of this instance.
   *
   * @returns {typeof RandomTextGenerator} - Constructor of this instance.
   */
  get Ctor () {
    return /** @type {typeof RandomTextGenerator} */ (this.constructor)
  }

  /**
   * Generate random text.
   *
   * @param {{
   *   length?: number
   * }} [params] - Parameters.
   * @returns {string} - Random text.
   */
  generate ({
    length = 10,
  } = {}) {
    return [...Array(length)]
      .map(() =>
        Math.floor(Math.random() * this.seeds.length)
      )
      .map(index => this.seeds[index])
      .join('')
  }
}
