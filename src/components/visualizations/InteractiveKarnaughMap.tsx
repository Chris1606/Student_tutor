import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  CellValue, 
  StepType, 
  MapSize, 
  GroupType, 
  groupColors, 
  parseBooleanFunction, 
  decimalToBinary, 
  generateExpression 
} from './utils/kmap-utils';
import { validateKMapFilling, validateGrouping, validateExpression } from './utils/validation-handlers';

// Import step components
import { IntroStep } from './steps/IntroStep';
import { FillingStep } from './steps/FillingStep';
import { GroupingStep } from './steps/GroupingStep';
import { ExpressionStep } from './steps/ExpressionStep';
import { FinalStep } from './steps/FinalStep';
import { ReviewStep } from './steps/ReviewStep';

interface KMapProps {
  booleanFunction?: string;
  minterms?: number[];
  dontCares?: number[];
  onComplete?: (expression: string) => void;
}

export const InteractiveKarnaughMap: React.FC<KMapProps> = ({ 
  booleanFunction = "f(a,b,c,d)=Σm0,m1,m5,m6,m7,m11,m12,m14+d3,8,13",
  minterms = [0, 1, 5, 6, 7, 11, 12, 14],
  dontCares = [3, 8, 13],
  onComplete
}) => {
  // Định nghĩa các giá trị đúng cho K-map
  const correctMinterms = [0, 1, 5, 6, 7, 11, 12, 14];  // Các vị trí số 1
  const correctDontCares = [3, 8, 13];  // Các vị trí X

  // Thêm vào đầu component
  const indexMapping = [
    [0, 1, 3, 2],    // 00
    [4, 5, 7, 6],    // 01
    [12, 13, 15, 14], // 11
    [8, 9, 11, 10]   // 10
  ];

  // State definitions
  const [mapSize, setMapSize] = useState<MapSize>('4x4');
  const [currentStep, setCurrentStep] = useState<StepType>('intro');
  const [kMap, setKMap] = useState<CellValue[][]>([
    ['0', '0', '0', '0'],
    ['0', '0', '0', '0'],
    ['0', '0', '0', '0'],
    ['0', '0', '0', '0']
  ]);
  const [userMinterms, setMinterms] = useState<number[]>(minterms);
  const [userDontCares, setDontCares] = useState<number[]>(dontCares);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [simplifiedExpression, setSimplifiedExpression] = useState<string>('');
  const [userExpression, setUserExpression] = useState<string>('');
  const [expressionCorrect, setExpressionCorrect] = useState<boolean | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [thinking, setThinking] = useState(false);
  
  const { toast } = useToast();

  // Parse function if provided
  useEffect(() => {
    if (booleanFunction) {
      const { minterms: parsedMinterms, dontCares: parsedDontCares } = parseBooleanFunction(booleanFunction);
      
      if (parsedMinterms.length > 0) {
        setMinterms(parsedMinterms);
      }
      
      if (parsedDontCares.length > 0) {
        setDontCares(parsedDontCares);
      }
    }
  }, [booleanFunction]);

  // Effect to resize the map when size changes
  useEffect(() => {
    let rows = 4;
    let cols = 4;
    
    if (mapSize === '2x2') {
      rows = 2;
      cols = 2;
    } else if (mapSize === '2x4') {
      rows = 2;
      cols = 4;
    }
    
    const newKMap = Array(rows).fill(null).map(() => Array(cols).fill('0') as CellValue[]);
    setKMap(newKMap);
    setGroups([]);
    setActiveGroup(null);
  }, [mapSize]);

  // Initialize K-map based on minterms and don't cares
  useEffect(() => {
    const rows = kMap.length;
    const cols = kMap[0].length;
    const newKMap = Array(rows).fill(null).map(() => Array(cols).fill('0') as CellValue[]);
    
    // Fill in minterms
    userMinterms.forEach(minterm => {
      try {
        const [row, col] = decimalToBinary(minterm);
        if (row < rows && col < cols) {
          newKMap[row][col] = '1';
        }
      } catch (e) {
        console.error(`Error mapping minterm ${minterm}`, e);
      }
    });
    
    // Fill in don't cares
    userDontCares.forEach(dontCare => {
      try {
        const [row, col] = decimalToBinary(dontCare);
        if (row < rows && col < cols) {
          newKMap[row][col] = 'X';
        }
      } catch (e) {
        console.error(`Error mapping don't care ${dontCare}`, e);
      }
    });
    
    setKMap(newKMap);
  }, [userMinterms, userDontCares]);

  // Handle cell click in filling mode
  const handleCellClick = (row: number, col: number) => {
    const newKMap = [...kMap];
    const currentValue = newKMap[row][col];
    
    // Cycle through values: 0 -> 1 -> X -> 0
    if (currentValue === '0') newKMap[row][col] = '1';
    else if (currentValue === '1') newKMap[row][col] = 'X';
    else newKMap[row][col] = '0';
    
    setKMap(newKMap);
  };

  // Handle cell click in grouping mode
  const handleGroupCellClick = (row: number, col: number) => {
    if (currentStep !== 'grouping' || kMap[row][col] === '0') return;
    
    if (activeGroup === null) return;
    
    // Check if cell is already in this group
    const existingGroupIndex = groups.findIndex(g => 
      g.id === activeGroup && g.cells.some(([r, c]) => r === row && c === col)
    );
    
    if (existingGroupIndex !== -1) {
      // Remove cell from group
      const updatedGroups = [...groups];
      const groupCells = updatedGroups[existingGroupIndex].cells;
      
      updatedGroups[existingGroupIndex].cells = groupCells.filter(
        ([r, c]) => !(r === row && c === col)
      );
      
      // If group becomes empty, remove it
      if (updatedGroups[existingGroupIndex].cells.length === 0) {
        updatedGroups.splice(existingGroupIndex, 1);
        setActiveGroup(null);
      }
      
      setGroups(updatedGroups);
    } else {
      // Add cell to group
      const updatedGroups = [...groups];
      const groupIndex = updatedGroups.findIndex(g => g.id === activeGroup);
      
      if (groupIndex !== -1) {
        updatedGroups[groupIndex].cells.push([row, col]);
        setGroups(updatedGroups);
      }
    }
  };

  // Delete the currently active group
  const deleteActiveGroup = () => {
    if (activeGroup === null) return;
    
    const updatedGroups = groups.filter(g => g.id !== activeGroup);
    setGroups(updatedGroups);
    setActiveGroup(null);
  };

  // Reset K-map
  const resetKMap = () => {
    setKMap([
      ['0', '0', '0', '0'],
      ['0', '0', '0', '0'],
      ['0', '0', '0', '0'],
      ['0', '0', '0', '0']
    ]);
  };

  // Reset grouping
  const resetGroups = () => {
    setGroups([]);
    setActiveGroup(null);
  };

  // Validate the user's K-map filling
  const validateKMap = () => {
    setThinking(true);
    
    // Kiểm tra từng ô trong K-map
    const currentMinterms: number[] = [];
    const currentDontCares: number[] = [];
    
    // Duyệt qua K-map để lấy các giá trị người dùng đã điền
    kMap.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const index = indexMapping[rowIndex][colIndex];
        if (cell === '1') {
          currentMinterms.push(index);
        } else if (cell === 'X') {
          currentDontCares.push(index);
        }
      });
    });

    // So sánh với đáp án đúng
    const mintersCorrect = currentMinterms.length === correctMinterms.length && 
      currentMinterms.every(m => correctMinterms.includes(m));
    const dontCaresCorrect = currentDontCares.length === correctDontCares.length && 
      currentDontCares.every(d => correctDontCares.includes(d));

    if (mintersCorrect && dontCaresCorrect) {
      setValidationMessage("Correct! You can now proceed to grouping the terms.");
      setValidationError(null);
      setCurrentStep('grouping');
    } else {
      let errorMessage = "The K-map values are not correct. Please check the following:\n";
      
      // Kiểm tra minterms sai
      const wrongMinterms = currentMinterms.filter(m => !correctMinterms.includes(m));
      const missingMinterms = correctMinterms.filter(m => !currentMinterms.includes(m));
      
      if (wrongMinterms.length > 0) {
        errorMessage += `\n- You have incorrectly placed 1s in cells: ${wrongMinterms.join(', ')}`;
      }
      if (missingMinterms.length > 0) {
        errorMessage += `\n- You are missing 1s in cells: ${missingMinterms.join(', ')}`;
      }
      
      // Kiểm tra don't cares sai
      const wrongDontCares = currentDontCares.filter(d => !correctDontCares.includes(d));
      const missingDontCares = correctDontCares.filter(d => !currentDontCares.includes(d));
      
      if (wrongDontCares.length > 0) {
        errorMessage += `\n- You have incorrectly placed Xs in cells: ${wrongDontCares.join(', ')}`;
      }
      if (missingDontCares.length > 0) {
        errorMessage += `\n- You are missing Xs in cells: ${missingDontCares.join(', ')}`;
      }
      
      setValidationError(errorMessage);
      setValidationMessage(null);
    }
    
    setThinking(false);
  };

  // Add a new group
  const addGroup = () => {
    const newGroup: GroupType = {
      id: groups.length + 1,
      cells: [],
      color: groupColors[groups.length % groupColors.length].bg
    };
    
    setGroups([...groups, newGroup]);
    setActiveGroup(newGroup.id);
  };

  // Validate grouping
  const validateGroupingStep = () => {
    setThinking(true);
    setValidationMessage("Analyzing your grouping...");
    
    // Add deliberate delay to simulate thinking
    setTimeout(() => {
      const result = validateGrouping(kMap, groups, userMinterms);
      
      setValidationMessage(result.message);
      setValidationError(result.error);
      
      if (result.isValid) {
        const expression = generateExpression(groups);
        setSimplifiedExpression(expression);
        setCurrentStep('expression');
      }
      
      setThinking(false);
    }, 1500); // 1.5 second delay
  };

  // Validate user's expression
  const validateExpressionStep = () => {
    setThinking(true);
    setValidationMessage("Checking your expression...");
    
    // Add deliberate delay to simulate thinking
    setTimeout(() => {
      const result = validateExpression(userExpression, simplifiedExpression);
      
      setValidationMessage(result.message);
      setExpressionCorrect(result.isValid);
      
      if (result.isValid) {
        setCurrentStep('final');
        if (onComplete) onComplete(userExpression);
      }
      
      setThinking(false);
    }, 1500); // 1.5 second delay
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <IntroStep 
            booleanFunction={booleanFunction}
            userMinterms={userMinterms}
            userDontCares={userDontCares}
            mapSize={mapSize}
            setMapSize={setMapSize}
            goToNextStep={() => setCurrentStep('filling')}
          />
        );

      case 'filling':
        return (
          <FillingStep 
            kMap={kMap}
            mapSize={mapSize}
            userMinterms={userMinterms}
            userDontCares={userDontCares}
            groups={groups}
            activeGroup={activeGroup}
            fullscreen={fullscreen}
            thinking={thinking}
            validationMessage={validationMessage}
            validationError={validationError}
            handleCellClick={handleCellClick}
            setFullscreen={setFullscreen}
            resetKMap={resetKMap}
            validateKMap={validateKMap}
          />
        );

      case 'grouping':
        return (
          <GroupingStep 
            kMap={kMap}
            mapSize={mapSize}
            groups={groups}
            activeGroup={activeGroup}
            fullscreen={fullscreen}
            thinking={thinking}
            validationMessage={validationMessage}
            validationError={validationError}
            handleGroupCellClick={handleGroupCellClick}
            setFullscreen={setFullscreen}
            setActiveGroup={setActiveGroup}
            addGroup={addGroup}
            deleteActiveGroup={deleteActiveGroup}
            resetGroups={resetGroups}
            validateGrouping={validateGroupingStep}
          />
        );

      case 'expression':
        return (
          <ExpressionStep 
            kMap={kMap}
            mapSize={mapSize}
            groups={groups}
            activeGroup={activeGroup}
            thinking={thinking}
            validationMessage={validationMessage}
            expressionCorrect={expressionCorrect}
            userExpression={userExpression}
            setUserExpression={setUserExpression}
            validateExpression={validateExpressionStep}
          />
        );

      case 'final':
        return (
          <FinalStep 
            kMap={kMap}
            mapSize={mapSize}
            groups={groups}
            activeGroup={activeGroup}
            booleanFunction={booleanFunction}
            userExpression={userExpression}
            onResetProblem={() => setCurrentStep('intro')}
            onReview={() => setCurrentStep('review')}
          />
        );
        
      case 'review':
        return (
          <ReviewStep 
            kMap={kMap}
            mapSize={mapSize}
            groups={groups}
            activeGroup={activeGroup}
            booleanFunction={booleanFunction}
            userExpression={userExpression}
            onResetProblem={() => setCurrentStep('intro')}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border p-4 bg-card shadow-sm">
      <div className="grid grid-cols-1 gap-4">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              currentStep === 'intro' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>1</span>
            <span className="h-0.5 w-4 bg-muted"></span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              currentStep === 'filling' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>2</span>
            <span className="h-0.5 w-4 bg-muted"></span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              currentStep === 'grouping' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>3</span>
            <span className="h-0.5 w-4 bg-muted"></span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              currentStep === 'expression' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>4</span>
            <span className="h-0.5 w-4 bg-muted"></span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              (currentStep === 'final' || currentStep === 'review') ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>5</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentStep === 'intro' && "Introduction"}
            {currentStep === 'filling' && "Fill K-Map"}
            {currentStep === 'grouping' && "Group Terms"}
            {currentStep === 'expression' && "Write Expression"}
            {currentStep === 'final' && "Complete"}
            {currentStep === 'review' && "Review"}
          </div>
        </div>

        {/* Step content */}
        {renderStepContent()}
      </div>
    </div>
  );
}; 