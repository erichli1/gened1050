// Check for similarities between arrays
export function containsAnyElements(
  array1: string[],
  array2: string[]
): boolean {
  return array1.some((item) => array2.includes(item));
}

export const TEST_MAPPING_DATA = [
  ["person1", "person2"],
  ["person2", "person3"],
  ["person3", "person4"],
  ["person4", "person5"],
  ["person5", "person6"],
  ["person6", "person7"],
  ["person7", "person8"],
  ["person8", "person9"],
  ["person9", "person10"],
  ["person10", "person11"],
  ["person11", "person12"],
  ["person12", "person13"],
  ["person13", "person14"],
  ["person14", "person15"],
  ["person15", "person16"],
  ["person16", "person17"],
  ["person17", "person18"],
  ["person18", "person19"],
  ["person19", "person20"],
  ["person20", "person21"],
  ["person21", "person22"],
  ["person22", "person23"],
  ["person23", "person24"],
  ["person24", "person25"],
  ["person25", "person1"],
];
