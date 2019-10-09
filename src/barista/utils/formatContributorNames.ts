export function formatContributorName(name: string): string {
  return name
    .split('.')
    .map(s =>
      s
        .split('-')
        .map(p => uppercaseFirstLetter(p))
        .join('-'),
    )
    .join(' ');
}

function uppercaseFirstLetter(name: string): string {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}
