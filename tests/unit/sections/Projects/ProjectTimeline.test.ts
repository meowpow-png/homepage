import type { MouseEvent } from 'react'
import { describe, expect, it } from 'vitest'

import { shouldHandleProjectNavigation } from '@/sections/Projects/ProjectTimeline'

type ClickEvent = MouseEvent<HTMLAnchorElement>

function makeEvent(
  overrides: Partial<
    Pick<ClickEvent, 'defaultPrevented' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'>
  > = {},
): ClickEvent {
  return {
    defaultPrevented: false,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    ...overrides,
  } as ClickEvent
}

const target = {} as HTMLElement

describe('shouldHandleProjectNavigation', () => {
  it('handles a plain click with a target', () => {
    expect(shouldHandleProjectNavigation(makeEvent(), target)).toBe(true)
  })

  it('does not handle a missing target', () => {
    expect(shouldHandleProjectNavigation(makeEvent(), null)).toBe(false)
  })

  it('does not handle when the default was already prevented', () => {
    expect(shouldHandleProjectNavigation(makeEvent({ defaultPrevented: true }), target)).toBe(false)
  })

  it.each(['metaKey', 'ctrlKey', 'shiftKey', 'altKey'] as const)(
    'does not handle when %s is held',
    (key) => {
      expect(shouldHandleProjectNavigation(makeEvent({ [key]: true }), target)).toBe(false)
    },
  )
})
