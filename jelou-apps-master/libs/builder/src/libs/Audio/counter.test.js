import { describe, expect, it } from 'vitest'
import { Counter } from './counter'

describe('counter', () => {
  it('should convert milliseconds to time', () => {
    const counter = new Counter()

    const timeString = counter.millisecondsToTime(3723000)

    expect(timeString).toEqual('01:02:03')
  })
})
