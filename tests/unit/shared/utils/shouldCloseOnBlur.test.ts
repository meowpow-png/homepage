import { describe, expect, it } from 'vitest'

import { shouldCloseOnBlur } from '@/shared/utils'

function makeContainer(contains: boolean): Node {
  return { contains: () => contains } as unknown as Node
}

const relatedTarget = {} as Node

describe('shouldCloseOnBlur', () => {
  it('does not close when focus moves to a node inside the container', () => {
    expect(shouldCloseOnBlur(makeContainer(true), relatedTarget)).toBe(false)
  })

  it('closes when focus moves to a node outside the container', () => {
    expect(shouldCloseOnBlur(makeContainer(false), relatedTarget)).toBe(true)
  })

  it('closes when relatedTarget is null (focus left the document)', () => {
    expect(shouldCloseOnBlur(makeContainer(false), null)).toBe(true)
  })

  it('closes when the container is null', () => {
    expect(shouldCloseOnBlur(null, relatedTarget)).toBe(true)
  })
})
