import { ChainId } from '@uniswap/sdk-core'

// export const FACTORY_ADDRESS = '0xfaa89f95CE1948582154ee1C0Ea47701cBb95E04' // base sepolia
export const FACTORY_ADDRESS = '0xfCA1AEf282A99390B62Ca8416a68F5747716260c' // Taiko
export const FACTORY_ADDRESS_MAP = {
  [ChainId.BASE_SEPOLIA]: '0xfaa89f95CE1948582154ee1C0Ea47701cBb95E04',
  [ChainId.TAIKO]: '0xfCA1AEf282A99390B62Ca8416a68F5747716260c'
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const POOL_INIT_CODE_HASH = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200
}
