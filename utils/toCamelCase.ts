export function toCamelCase(label: string) {
  return label
    .replace(/[^a-zA-Z0-9 ]/g, "")      // remove special chars
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}
