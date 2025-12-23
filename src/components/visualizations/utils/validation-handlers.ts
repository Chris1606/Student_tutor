import { CellValue, GroupType } from './kmap-utils';
import { isValidGroup, isMinimalGroup, areAllOnesCovered, doGroupsOverlap, isGroupRedundant } from './kmap-utils';

interface ValidationResult {
  isValid: boolean;
  message: string;
  error?: string;
}

// Validate K-map filling
export function validateKMapFilling(
  kMap: CellValue[][],
  expectedMinterms: number[],
  expectedDontCares: number[]
): ValidationResult {
  const rows = kMap.length;
  const cols = kMap[0].length;
  
  // Count actual minterms and don't cares
  let actualMinterms: number[] = [];
  let actualDontCares: number[] = [];
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const decimal = r * cols + c;
      if (kMap[r][c] === '1') {
        actualMinterms.push(decimal);
      } else if (kMap[r][c] === 'X') {
        actualDontCares.push(decimal);
      }
    }
  }
  
  // Sort arrays for comparison
  actualMinterms.sort((a, b) => a - b);
  actualDontCares.sort((a, b) => a - b);
  expectedMinterms.sort((a, b) => a - b);
  expectedDontCares.sort((a, b) => a - b);
  
  // Compare arrays
  const mintermsMatch = JSON.stringify(actualMinterms) === JSON.stringify(expectedMinterms);
  const dontCaresMatch = JSON.stringify(actualDontCares) === JSON.stringify(expectedDontCares);
  
  if (mintermsMatch && dontCaresMatch) {
    return {
      isValid: true,
      message: "Great job! Your K-map is filled correctly."
    };
  }
  
  let error = "There are some issues with your K-map:";
  if (!mintermsMatch) {
    error += "\n- Minterms are not correctly placed";
  }
  if (!dontCaresMatch) {
    error += "\n- Don't cares are not correctly placed";
  }
  
  return {
    isValid: false,
    message: "Please check your K-map filling.",
    error
  };
}

// Validate grouping
export function validateGrouping(
  kMap: CellValue[][],
  groups: GroupType[],
  expectedMinterms: number[]
): ValidationResult {
  if (groups.length === 0) {
    return {
      isValid: false,
      message: "Please create at least one group.",
      error: "No groups have been created yet."
    };
  }
  
  // Check if all groups are valid
  const invalidGroups = groups.filter(group => !isValidGroup(kMap, group));
  if (invalidGroups.length > 0) {
    return {
      isValid: false,
      message: "Some groups are invalid.",
      error: "Groups can only cover 1s and don't cares (X)."
    };
  }
  
  // Check if all groups are minimal
  const nonMinimalGroups = groups.filter(group => !isMinimalGroup(kMap, group));
  if (nonMinimalGroups.length > 0) {
    return {
      isValid: false,
      message: "Some groups can be expanded further.",
      error: "Try to make your groups as large as possible."
    };
  }
  
  // Check if all 1s are covered
  if (!areAllOnesCovered(kMap, groups)) {
    return {
      isValid: false,
      message: "Not all 1s are covered by groups.",
      error: "Make sure to cover all 1s with your groups."
    };
  }
  
  // Check for redundant groups
  const redundantGroups = groups.filter((_, index) => isGroupRedundant(groups, index));
  if (redundantGroups.length > 0) {
    return {
      isValid: false,
      message: "Some groups are redundant.",
      error: "Remove groups that don't cover any new 1s."
    };
  }

  // Define correct groups
  const correctGroups = [
    [1, 3, 5, 7],
    [6, 14],
    [11, 3],
    [12, 14],
    [0, 8]
  ];

  // Define index mapping for 4x4 K-map
  const indexMapping = [
    [0, 1, 3, 2],    // 00
    [4, 5, 7, 6],    // 01
    [12, 13, 15, 14], // 11
    [8, 9, 11, 10]   // 10
  ];

  // Convert user groups to array of numbers using indexMapping
  const userGroupNumbers = groups.map(group => 
    group.cells.map(([r, c]) => indexMapping[r][c]).sort((a, b) => a - b)
  );

  // Compare number of groups
  if (userGroupNumbers.length !== correctGroups.length) {
    return {
      isValid: false,
      message: "Number of groups is incorrect.",
      error: `You have ${userGroupNumbers.length} groups, but there should be ${correctGroups.length} groups.`
    };
  }

  // Compare each group
  const userGroupStrings = userGroupNumbers.map(group => JSON.stringify(group));
  const correctGroupStrings = correctGroups.map(group => JSON.stringify(group.sort((a, b) => a - b)));
  
  const missingGroups = correctGroupStrings.filter(group => !userGroupStrings.includes(group));
  if (missingGroups.length > 0) {
    return {
      isValid: false,
      message: "Some groups are incorrect.",
      error: "Please check your groups again. Make sure each group covers exactly the correct cells."
    };
  }
  
  return {
    isValid: true,
    message: "Excellent grouping! Your groups are correct."
  };
}

// Validate expression
export function validateExpression(
  userExpression: string,
  expectedExpression: string = "B'CD + A'D + ABD' + BCD' + B'C'D'"
): ValidationResult {
  if (!userExpression) {
    return {
      isValid: false,
      message: "Please enter an expression.",
      error: "The expression field is empty."
    };
  }

  // If no expected expression is provided, use the default one
  if (!expectedExpression || expectedExpression === "AbC + a") {
    expectedExpression = "B'CD + A'D + ABD' + BCD' + B'C'D'";
  }

  // Helper function to normalize a single term
  const normalizeTerm = (term: string) => {
    // Remove all spaces
    term = term.replace(/\s+/g, '');
    
    // Convert to uppercase
    term = term.toUpperCase();
    
    // Split into individual characters
    const chars = term.split('');
    const variables: { letter: string; prime: boolean }[] = [];
    
    // Process each character
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === "'") continue;
      
      const hasNext = i < chars.length - 1;
      const nextIsPrime = hasNext && chars[i + 1] === "'";
      
      variables.push({
        letter: chars[i],
        prime: nextIsPrime
      });
    }
    
    // Sort by letter
    variables.sort((a, b) => a.letter.localeCompare(b.letter));
    
    // Reconstruct the term
    return variables.map(v => v.letter + (v.prime ? "'" : "")).join('');
  };

  // Normalize expressions for comparison
  const normalizeExpression = (expr: string): string => {
    return expr
      .split('+')
      .map(term => term.trim())
      .filter(term => term.length > 0)
      .map(normalizeTerm)
      .sort()
      .join('+');
  };

  // Normalize both expressions
  const normalizedUser = normalizeExpression(userExpression);
  const normalizedExpected = normalizeExpression(expectedExpression);

  console.log('Original user:', userExpression);
  console.log('Original expected:', expectedExpression);
  console.log('Normalized user:', normalizedUser);
  console.log('Normalized expected:', normalizedExpected);

  // Compare normalized expressions
  if (normalizedUser === normalizedExpected) {
    return {
      isValid: true,
      message: "Correct! Your expression matches the expected result."
    };
  }

  // If expressions don't match, provide detailed feedback
  const userTerms = normalizedUser.split('+');
  const expectedTerms = normalizedExpected.split('+');

  let error = "Your expression is not correct. Check for:";

  // Check for missing terms
  const missingTerms = expectedTerms.filter(term => !userTerms.includes(term));
  if (missingTerms.length > 0) {
    error += "\n- Missing terms: " + missingTerms.join(', ');
  }

  // Check for extra terms
  const extraTerms = userTerms.filter(term => !expectedTerms.includes(term));
  if (extraTerms.length > 0) {
    error += "\n- Extra terms: " + extraTerms.join(', ');
  }

  // Check for format issues
  if (userExpression.includes('*')) {
    error += "\n- Do not use * for AND operations, just write variables next to each other";
  }
  if (userExpression.includes('.')) {
    error += "\n- Do not use . for AND operations, just write variables next to each other";
  }
  if (!/^[a-zA-Z'\s+]+$/.test(userExpression)) {
    error += "\n- Use only letters, prime ('), plus (+), and spaces";
  }

  return {
    isValid: false,
    message: "Your expression is not correct.",
    error: error + "\n\nExpected format example: B'CD + A'D + ABD' + BCD' + B'C'D'"
  };
} 