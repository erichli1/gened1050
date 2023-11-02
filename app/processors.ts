import assert from "assert";
import { shuffle } from "lodash";
import {
  verifyExhaustive,
  verifyGroupSizes,
  verifyNoConflicts,
} from "./verifiers";
import { Dispatch, SetStateAction } from "react";

export function processCsvIntoString(
  file: File,
  numGroups: number,
  setGroups: Dispatch<SetStateAction<string[][] | undefined>>,
  setFileError: Dispatch<SetStateAction<boolean>>
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const csvData = (e.target as FileReader).result;
    const rawMappings = parseCSVData(csvData as string);

    if (rawMappings.length === 0) {
      setFileError(true);
      return;
    }

    const peopleList = generatePeopleList(rawMappings);
    const conflictsDict = generateConflictsDict(peopleList, rawMappings);
    setGroups(generateGroupsIteratively(peopleList, numGroups, conflictsDict));
  };

  reader.readAsText(file);
}

// export function testProcess() {
//   const rawMappings = TEST_MAPPING_DATA;
//   const peopleList = generatePeopleList(rawMappings);
//   const conflictsDict = generateConflictsDict(peopleList, rawMappings);
//   generateGroupsIteratively(peopleList, 5, conflictsDict);
// }

function parseCSVData(csvData: string) {
  const rows = csvData.split("\n");
  const parsedData: string[][] = [];

  if (!rows[0].includes("Name")) return [];

  for (const row of rows.slice(1)) {
    const columns = row.split(",");
    if (columns.length !== 2) return [];

    const trimmedColumns = columns.map((str) => str.trim());
    parsedData.push(trimmedColumns);
  }

  return parsedData;
}

function generatePeopleList(rawMappings: string[][]) {
  const peopleList: string[] = [];
  for (const subarray of rawMappings) {
    peopleList.push(subarray[0]);
  }

  return peopleList;
}

function generateConflictsDict(peopleList: string[], rawMappings: string[][]) {
  const conflictsDict: { [person: string]: string[] } = {};

  for (const person of peopleList) {
    conflictsDict[person] = [];
  }

  for (const subarray of rawMappings) {
    conflictsDict[subarray[0]].push(subarray[1]);
    conflictsDict[subarray[1]].push(subarray[0]);
  }

  return conflictsDict;
}

// Get the conflicts of all the members of a group
function getConflicts(
  group: string[],
  conflictsDict: Record<string, string[]>
): string[] {
  const conflicts = new Set<string>();
  for (const person of group) {
    for (const personConflict of conflictsDict[person]) {
      conflicts.add(personConflict);
    }
  }
  return Array.from(conflicts);
}

// Get the next group index
function getNextGroupIter(
  groups: string[][],
  excludedIndices: number[]
): number {
  let minLength = Number.POSITIVE_INFINITY;
  let minLengthGroupIndex: number | null = null;

  for (let i = 0; i < groups.length; i++) {
    if (!excludedIndices.includes(i)) {
      if (groups[i].length < minLength) {
        minLength = groups[i].length;
        minLengthGroupIndex = i;
      }
    }
  }

  assert(minLengthGroupIndex !== null);
  return minLengthGroupIndex;
}

function generateGroups(
  peopleList: string[],
  numGroups: number,
  conflictsDict: Record<string, string[]>
): string[][] {
  let people = [...peopleList]; // Create a copy of all the people
  people = shuffle(people);

  const groups: string[][] = [];
  for (let i = 0; i < numGroups; i++) {
    groups.push([]);
  }

  while (people.length > 0) {
    const person = people[0];
    const conflictGroupIndexes: number[] = [];

    while (true) {
      const groupIter = getNextGroupIter(groups, conflictGroupIndexes);
      const conflicts = getConflicts(groups[groupIter], conflictsDict);

      // Successfully add to the group
      if (!conflicts.includes(person)) {
        groups[groupIter].push(person);
        people.splice(people.indexOf(person), 1);
        break;
      } else {
        conflictGroupIndexes.push(groupIter);
      }
    }
  }

  return groups;
}

function generateGroupsIteratively(
  peopleList: string[],
  numGroups: number,
  conflictsDict: Record<string, string[]>
): string[][] {
  for (let i = 0; i < 10; i++) {
    const groups = generateGroups(peopleList, numGroups, conflictsDict);
    if (!verifyGroupSizes(groups)) {
      console.log(
        `Attempt ${i + 1}: Generated uneven group sizes. Retrying...`
      );
    } else {
      if (
        verifyNoConflicts(groups, conflictsDict) &&
        verifyExhaustive(groups, peopleList)
      ) {
        console.log(groups);
        console.log("Success");
        return groups;
      } else {
        console.log(
          `Attempt ${
            i + 1
          }: Unexpected behavior. Generated a group that failed conflict or exhaustive verifier. Retrying...`
        );
      }
    }
  }

  return [];
}
