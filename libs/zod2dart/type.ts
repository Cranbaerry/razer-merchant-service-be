import type { DMMF } from '@prisma/generator-helper';

export type PrismaPrimitive =
  | 'String'
  | 'BigInt'
  | 'Bytes'
  | 'Decimal'
  | 'Boolean'
  | 'Int'
  | 'Float'
  | 'Json'
  | 'DateTime';

export function isPrimitive(field: DMMF.Field) {
  return field.kind === 'scalar';
}

export function isEnumType(field: DMMF.Field): boolean {
  return field['kind'] === 'enum';
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function parseType(field: DMMF.Field) {
  const fieldType = field.type as PrismaPrimitive;
  switch (fieldType) {
    case 'Int':
    case 'BigInt':
    case 'Decimal':
    case 'Float':
      return 'num';
    case 'DateTime':
    case 'Bytes':
    case 'String':
      return 'String';
    case 'Json':
      return `Map<String, dynamic>`;
    case 'Boolean':
      return 'bool';
    default:
      return fieldType;
  }
}

export function getDartType(field: DMMF.Field, nullable: boolean): string {
  let resp = '';
  if (field.isList) {
    resp += `List<${parseType(field)}>`;
  } else {
    resp += parseType(field);
  }
  if (nullable) {
    resp += '?';
  }
  return resp;
}
