export const AUTOMATION_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  GREATER_THAN: 'greater_than',
  GREATER_THAN_OR_EQUAL: 'greater_than_or_equal',
  LESS_THAN: 'less_than',
  LESS_THAN_OR_EQUAL: 'less_than_or_equal',
  BETWEEN: 'between',
  NOT_BETWEEN: 'not_between',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  IS_NULL: 'is_null',
  IS_NOT_NULL: 'is_not_null',
} as const;

export type AutomationOperator = typeof AUTOMATION_OPERATORS[keyof typeof AUTOMATION_OPERATORS];

export const OPERATOR_LABELS: Record<AutomationOperator, string> = {
  [AUTOMATION_OPERATORS.EQUALS]: 'Equals',
  [AUTOMATION_OPERATORS.NOT_EQUALS]: 'Not Equals',
  [AUTOMATION_OPERATORS.GREATER_THAN]: 'Greater Than',
  [AUTOMATION_OPERATORS.GREATER_THAN_OR_EQUAL]: 'Greater Than or Equal',
  [AUTOMATION_OPERATORS.LESS_THAN]: 'Less Than',
  [AUTOMATION_OPERATORS.LESS_THAN_OR_EQUAL]: 'Less Than or Equal',
  [AUTOMATION_OPERATORS.BETWEEN]: 'Between',
  [AUTOMATION_OPERATORS.NOT_BETWEEN]: 'Not Between',
  [AUTOMATION_OPERATORS.CONTAINS]: 'Contains',
  [AUTOMATION_OPERATORS.NOT_CONTAINS]: 'Not Contains',
  [AUTOMATION_OPERATORS.STARTS_WITH]: 'Starts With',
  [AUTOMATION_OPERATORS.ENDS_WITH]: 'Ends With',
  [AUTOMATION_OPERATORS.IS_NULL]: 'Is Null',
  [AUTOMATION_OPERATORS.IS_NOT_NULL]: 'Is Not Null',
};

export const OPERATOR_SYMBOLS: Record<AutomationOperator, string> = {
  [AUTOMATION_OPERATORS.EQUALS]: '=',
  [AUTOMATION_OPERATORS.NOT_EQUALS]: '≠',
  [AUTOMATION_OPERATORS.GREATER_THAN]: '>',
  [AUTOMATION_OPERATORS.GREATER_THAN_OR_EQUAL]: '≥',
  [AUTOMATION_OPERATORS.LESS_THAN]: '<',
  [AUTOMATION_OPERATORS.LESS_THAN_OR_EQUAL]: '≤',
  [AUTOMATION_OPERATORS.BETWEEN]: '∈',
  [AUTOMATION_OPERATORS.NOT_BETWEEN]: '∉',
  [AUTOMATION_OPERATORS.CONTAINS]: '⊃',
  [AUTOMATION_OPERATORS.NOT_CONTAINS]: '⊅',
  [AUTOMATION_OPERATORS.STARTS_WITH]: '^',
  [AUTOMATION_OPERATORS.ENDS_WITH]: '$',
  [AUTOMATION_OPERATORS.IS_NULL]: '∅',
  [AUTOMATION_OPERATORS.IS_NOT_NULL]: '!∅',
};

export const OPERATOR_DESCRIPTIONS: Record<AutomationOperator, string> = {
  [AUTOMATION_OPERATORS.EQUALS]: 'Value is exactly equal to the threshold',
  [AUTOMATION_OPERATORS.NOT_EQUALS]: 'Value is not equal to the threshold',
  [AUTOMATION_OPERATORS.GREATER_THAN]: 'Value is greater than the threshold',
  [AUTOMATION_OPERATORS.GREATER_THAN_OR_EQUAL]: 'Value is greater than or equal to the threshold',
  [AUTOMATION_OPERATORS.LESS_THAN]: 'Value is less than the threshold',
  [AUTOMATION_OPERATORS.LESS_THAN_OR_EQUAL]: 'Value is less than or equal to the threshold',
  [AUTOMATION_OPERATORS.BETWEEN]: 'Value is between two thresholds (inclusive)',
  [AUTOMATION_OPERATORS.NOT_BETWEEN]: 'Value is not between two thresholds',
  [AUTOMATION_OPERATORS.CONTAINS]: 'Value contains the specified text',
  [AUTOMATION_OPERATORS.NOT_CONTAINS]: 'Value does not contain the specified text',
  [AUTOMATION_OPERATORS.STARTS_WITH]: 'Value starts with the specified text',
  [AUTOMATION_OPERATORS.ENDS_WITH]: 'Value ends with the specified text',
  [AUTOMATION_OPERATORS.IS_NULL]: 'Value is null or empty',
  [AUTOMATION_OPERATORS.IS_NOT_NULL]: 'Value is not null or empty',
};

export const OPERATOR_CATEGORIES = {
  COMPARISON: [
    AUTOMATION_OPERATORS.EQUALS,
    AUTOMATION_OPERATORS.NOT_EQUALS,
    AUTOMATION_OPERATORS.GREATER_THAN,
    AUTOMATION_OPERATORS.GREATER_THAN_OR_EQUAL,
    AUTOMATION_OPERATORS.LESS_THAN,
    AUTOMATION_OPERATORS.LESS_THAN_OR_EQUAL,
  ],
  RANGE: [
    AUTOMATION_OPERATORS.BETWEEN,
    AUTOMATION_OPERATORS.NOT_BETWEEN,
  ],
  TEXT: [
    AUTOMATION_OPERATORS.CONTAINS,
    AUTOMATION_OPERATORS.NOT_CONTAINS,
    AUTOMATION_OPERATORS.STARTS_WITH,
    AUTOMATION_OPERATORS.ENDS_WITH,
  ],
  NULL_CHECK: [
    AUTOMATION_OPERATORS.IS_NULL,
    AUTOMATION_OPERATORS.IS_NOT_NULL,
  ],
} as const;

export const OPERATOR_INPUT_TYPES: Record<AutomationOperator, 'single' | 'range' | 'text' | 'none'> = {
  [AUTOMATION_OPERATORS.EQUALS]: 'single',
  [AUTOMATION_OPERATORS.NOT_EQUALS]: 'single',
  [AUTOMATION_OPERATORS.GREATER_THAN]: 'single',
  [AUTOMATION_OPERATORS.GREATER_THAN_OR_EQUAL]: 'single',
  [AUTOMATION_OPERATORS.LESS_THAN]: 'single',
  [AUTOMATION_OPERATORS.LESS_THAN_OR_EQUAL]: 'single',
  [AUTOMATION_OPERATORS.BETWEEN]: 'range',
  [AUTOMATION_OPERATORS.NOT_BETWEEN]: 'range',
  [AUTOMATION_OPERATORS.CONTAINS]: 'text',
  [AUTOMATION_OPERATORS.NOT_CONTAINS]: 'text',
  [AUTOMATION_OPERATORS.STARTS_WITH]: 'text',
  [AUTOMATION_OPERATORS.ENDS_WITH]: 'text',
  [AUTOMATION_OPERATORS.IS_NULL]: 'none',
  [AUTOMATION_OPERATORS.IS_NOT_NULL]: 'none',
};

export const OPERATOR_VALIDATION_RULES: Record<AutomationOperator, any[]> = {
  [AUTOMATION_OPERATORS.EQUALS]: [],
  [AUTOMATION_OPERATORS.NOT_EQUALS]: [],
  [AUTOMATION_OPERATORS.GREATER_THAN]: [],
  [AUTOMATION_OPERATORS.GREATER_THAN_OR_EQUAL]: [],
  [AUTOMATION_OPERATORS.LESS_THAN]: [],
  [AUTOMATION_OPERATORS.LESS_THAN_OR_EQUAL]: [],
  [AUTOMATION_OPERATORS.BETWEEN]: [],
  [AUTOMATION_OPERATORS.NOT_BETWEEN]: [],
  [AUTOMATION_OPERATORS.CONTAINS]: [],
  [AUTOMATION_OPERATORS.NOT_CONTAINS]: [],
  [AUTOMATION_OPERATORS.STARTS_WITH]: [],
  [AUTOMATION_OPERATORS.ENDS_WITH]: [],
  [AUTOMATION_OPERATORS.IS_NULL]: [],
  [AUTOMATION_OPERATORS.IS_NOT_NULL]: [],
};

export const getOperatorInfo = (operator: AutomationOperator) => ({
  label: OPERATOR_LABELS[operator],
  symbol: OPERATOR_SYMBOLS[operator],
  description: OPERATOR_DESCRIPTIONS[operator],
  inputType: OPERATOR_INPUT_TYPES[operator],
  category: Object.entries(OPERATOR_CATEGORIES).find(([_, operators]) => 
    operators.includes(operator)
  )?.[0] || 'COMPARISON',
});

export const OPERATOR_OPTIONS = Object.entries(OPERATOR_LABELS).map(([value, label]) => ({
  value,
  label,
  symbol: OPERATOR_SYMBOLS[value as AutomationOperator],
  description: OPERATOR_DESCRIPTIONS[value as AutomationOperator],
  inputType: OPERATOR_INPUT_TYPES[value as AutomationOperator],
  category: Object.entries(OPERATOR_CATEGORIES).find(([_, operators]) => 
    operators.includes(value as AutomationOperator)
  )?.[0] || 'COMPARISON',
}));

export const getOperatorsByCategory = (category: keyof typeof OPERATOR_CATEGORIES) => {
  return OPERATOR_CATEGORIES[category];
};

export const getOperatorsByInputType = (inputType: 'single' | 'range' | 'text' | 'none') => {
  return Object.entries(OPERATOR_INPUT_TYPES)
    .filter(([_, type]) => type === inputType)
    .map(([operator]) => operator as AutomationOperator);
};

export const formatOperatorExpression = (
  operator: AutomationOperator,
  value1: any,
  value2?: any
): string => {
  const symbol = OPERATOR_SYMBOLS[operator];
  
  switch (operator) {
    case AUTOMATION_OPERATORS.BETWEEN:
    case AUTOMATION_OPERATORS.NOT_BETWEEN:
      return `${value1} ${symbol} [${value2}]`;
    case AUTOMATION_OPERATORS.IS_NULL:
    case AUTOMATION_OPERATORS.IS_NOT_NULL:
      return symbol;
    default:
      return `${symbol} ${value1}`;
  }
}; 