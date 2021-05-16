import {Condition} from './condition';

export class ConditionJSONDeserialiser {
  static fromJSON(input: any): Condition[] {
    if (input === undefined) {
      return [];
    }

    if (typeof input !== 'object') {
      throw new Error(
          `Unsupported Condition type ${typeof input}: ` +
          `expecting an object {[operator:string]: {[key:string]:string[]}}`);
    }

    if (Array.isArray(input)) {
      throw new Error(
          `Unsupported Condition type array: ` +
          `expecting an object {[operator:string]: {[key:string]:string[]}}`);
    }

    const result: Condition[] = [];

    Object.keys(input).forEach((operator) => {
      const operatorValue = input[operator];

      if (typeof operatorValue !== 'object') {
        throw new Error(
            `Unsupported Condition operator type ${typeof operatorValue}: ` +
            'expecting an object {[key:string]:string[]}');
      }

      if (Array.isArray(operatorValue)) {
        throw new Error(
            'Unsupported Condition operator type array: ' +
            'expecting an object {[key:string]:string[]}');
      }

      result.push(...Object.keys(operatorValue).map((key) => {
        const values = operatorValue[key];

        return new Condition(operator, key, parseArray(values));
      }));
    });

    return result;

    function parseArray(obj: any) {
      if (Array.isArray(obj)) {
        if (isArrayOfStrings(obj)) {
          return obj as [];
        } else {
          throw new Error('Unsupported type: expecting an array of strings');
        }
      } else {
        throw new Error('Unsupported type: expecting an array');
      }
    }

    function isArrayOfStrings(obj: any[]) {
      return obj.every((element) => typeof element === 'string');
    }
  };
}
