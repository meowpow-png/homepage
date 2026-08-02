export function getMetadata<T>(metadata: Record<string, unknown>): T {
  return metadata as T
}
