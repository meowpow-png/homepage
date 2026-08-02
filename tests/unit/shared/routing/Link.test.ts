import type { MouseEvent } from 'react'
import { describe, expect, it } from 'vitest'

import { shouldInterceptNavigation } from '@/shared/routing'

type ClickEvent = MouseEvent<HTMLAnchorElement>

function makeEvent(
  overrides: Partial<
    Pick<ClickEvent, 'defaultPrevented' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'button'>
  > = {},
): ClickEvent {
  return {
    defaultPrevented: false,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    button: 0,
    ...overrides,
  } as ClickEvent
}

describe('shouldInterceptNavigation', () => {
  it('intercepts a plain left click on an internal link', () => {
    expect(shouldInterceptNavigation(makeEvent(), true)).toBe(true)
  })

  it('does not intercept external links', () => {
    expect(shouldInterceptNavigation(makeEvent(), false)).toBe(false)
  })

  it('does not intercept when the default was already prevented', () => {
    expect(shouldInterceptNavigation(makeEvent({ defaultPrevented: true }), true)).toBe(false)
  })

  it.each(['metaKey', 'ctrlKey', 'shiftKey', 'altKey'] as const)(
    'does not intercept when %s is held',
    (key) => {
      expect(shouldInterceptNavigation(makeEvent({ [key]: true }), true)).toBe(false)
    },
  )

  it('does not intercept non-left clicks', () => {
    expect(shouldInterceptNavigation(makeEvent({ button: 1 }), true)).toBe(false)
  })
})
