const PREFIX = '2024_'

export function lsGet(key: string) {
  return localStorage.getItem(PREFIX + key)
}

export function lsSet(key: string, value: any) {
  localStorage.setItem(PREFIX + key, value)
}

export function lsRemove(key: string) {
  localStorage.removeItem(PREFIX + key)
}
