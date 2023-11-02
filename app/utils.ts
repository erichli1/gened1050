// Check for similarities between arrays
export function containsAnyElements(
  array1: string[],
  array2: string[]
): boolean {
  return array1.some((item) => array2.includes(item));
}
