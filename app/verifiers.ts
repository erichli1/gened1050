import { containsAnyElements } from "./utils";

// Verify that no conflicts exist in a group
export function verifyNoConflicts(
  groups: string[][],
  conflictsDict: Record<string, string[]>
): boolean {
  for (const group of groups) {
    for (const person of group) {
      if (containsAnyElements(conflictsDict[person], group)) {
        return false;
      }
    }
  }
  return true;
}

// Verify that all groups are roughly the same
export function verifyGroupSizes(groups: string[][]): boolean {
  const groupSizes: number[] = groups.map((group) => group.length);
  if (Math.max(...groupSizes) - Math.min(...groupSizes) > 1) {
    return false;
  }
  return true;
}

// Verify that all students are accounted for
export function verifyExhaustive(
  groups: string[][],
  peopleList: string[]
): boolean {
  const flat = groups.flat(); // Use flat() to flatten the 2D array
  return new Set(flat).size === peopleList.length;
}
