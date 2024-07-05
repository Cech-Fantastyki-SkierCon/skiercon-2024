import child_process from 'node:child_process'

export function fixOrphans(text?: string): string {
  if (!text) {
    return ''
  }
  return text.replace(/ (.) /g, ' $1&nbsp;')
}

let gitRevision = ''
export function getGitRevision() {
  if (gitRevision) {
    return gitRevision
  }

  gitRevision = child_process
    .execSync('git rev-parse HEAD')
    .toString()
    .trim()
    .slice(0, 7)

  return gitRevision
}

export function plural(
  count: number,
  singular: string,
  plural1: string,
  plural2: string
): string {
  if (count === 1) {
    return singular
  } else if (count > 1 && count < 5) {
    return plural1
  } else {
    return plural2
  }
}
