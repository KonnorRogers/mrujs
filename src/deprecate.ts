interface DeprecatedInterface {
  name?: string
}

type Deprecated = DeprecatedInterface & string

export function isDeprecated (fn: Deprecated, version?: string): void {
  let asOf = '.'
  if (version != null) {
    asOf = ` as of version ${version}.`
  }
  console.error(`${fn?.name ?? fn} is deprecated${asOf}`)
}
