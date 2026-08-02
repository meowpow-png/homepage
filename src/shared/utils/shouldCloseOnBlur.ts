export function shouldCloseOnBlur(container: Node | null, relatedTarget: Node | null): boolean {
  return !container?.contains(relatedTarget)
}
