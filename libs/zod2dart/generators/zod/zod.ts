import {
  z,
  ZodEnum,
  ZodFirstPartyTypeKind,
  ZodNativeEnum,
  ZodTypeAny,
} from 'zod';
import * as Schemas from '~libs/entities/zod';
import { correctParameterNameIfInvalid } from '../dart-parameter';
import { DartGenerator, Files } from '../generator';
import { camelCase } from 'change-case';

const blacklistedEffectTypes = ['transform'];

function extractZodType(
  zodObject: ZodTypeAny,
  nullish?: boolean,
): {
  type: z.ZodTypeAny;
  nullish?: boolean;
} {
  if (zodObject instanceof z.ZodLazy) {
    return extractZodType(zodObject._def.getter(), nullish);
  } else if (zodObject instanceof z.ZodIntersection) {
    return extractZodType(zodObject._def.left, nullish);
  } else if (
    zodObject instanceof z.ZodNullable ||
    zodObject instanceof z.ZodOptional
  ) {
    return extractZodType(zodObject._def.innerType, true);
  } else if (
    zodObject instanceof z.ZodEffects &&
    blacklistedEffectTypes.includes(zodObject._def.effect?.type) !== true
  ) {
    return extractZodType(zodObject._def.schema, nullish);
  } else if (zodObject instanceof z.ZodDefault) {
    return extractZodType(zodObject._def.innerType, nullish);
  }
  return { type: zodObject, nullish };
}

function isNumString(zodObject: z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]>) {
  const unions = zodObject._def;
  let isNumString = false;
  if (unions.options.length == 2) {
    isNumString = unions.options.find((e) => e instanceof z.ZodString) != null;
    isNumString =
      isNumString &&
      unions.options.find((e) => e instanceof z.ZodNumber) != null;
  }
  return isNumString;
}

function findTypeFromZod(zodObject: ZodTypeAny): string {
  const found = Object.entries(Schemas).find((e) => Object.is(e[1], zodObject));
  return found ? found[0] : 'dynamic';
}

function parseZodToDartType(
  parameterName: string,
  zodObject: z.ZodTypeAny | string,
  nullable?: boolean,
): string {
  if (typeof zodObject === 'string') {
    return `${zodObject}${nullable === true ? '?' : ''}`;
  } else {
    const type = zodObject?._def?.typeName;
    if (!type) return parseZodToDartType(parameterName, 'Object', nullable);
    let ret = '';
    switch (type) {
      case ZodFirstPartyTypeKind.ZodNull:
        ret = 'dynamic';
        break;
      case ZodFirstPartyTypeKind.ZodObject:
      case ZodFirstPartyTypeKind.ZodNativeEnum:
      case ZodFirstPartyTypeKind.ZodEnum:
      case ZodFirstPartyTypeKind.ZodEffects:
        ret = findTypeFromZod(zodObject);
        break;
      case ZodFirstPartyTypeKind.ZodDate:
      case ZodFirstPartyTypeKind.ZodString:
        ret = 'String';
        break;
      case ZodFirstPartyTypeKind.ZodBigInt:
      case ZodFirstPartyTypeKind.ZodNumber:
        ret = 'num';
        break;
      case ZodFirstPartyTypeKind.ZodBoolean:
        ret = 'bool';
        break;
      case ZodFirstPartyTypeKind.ZodRecord:
        const { type } = extractZodType(zodObject._def.valueType);
        if (type instanceof z.ZodObject) {
          ret = `Map<String, ${findTypeFromZod(type)}>`;
        } else {
          ret = `Map<String, ${parseZodToDartType(parameterName, type)}>`;
        }
        break;
      case ZodFirstPartyTypeKind.ZodArray:
        const zodArray = extractZodType(zodObject._def.type);
        const arrayType = parseZodToDartType(
          parameterName,
          zodArray.type,
          zodArray.nullish,
        );
        ret = `List<${arrayType}>`;
        break;
      case ZodFirstPartyTypeKind.ZodAny:
        ret = 'dynamic';
        break;
      case ZodFirstPartyTypeKind.ZodOptional:
      case ZodFirstPartyTypeKind.ZodNullable:
        return parseZodToDartType(
          parameterName,
          zodObject._def.innerType,
          true,
        );
      default:
        ret = 'Object';
        break;
    }
    return parseZodToDartType(parameterName, ret, nullable);
  }
}

function createJsonKey(name: string, functionName: string | null) {
  if (functionName) {
    return `@JsonKey(name: '${name}', fromJson: ${functionName})`;
  }
  return `@JsonKey(name: '${name}')`;
}

function zodToDartParameter(
  parameterName: string,
  zodObject: z.ZodTypeAny,
): string {
  const { type, nullish } = extractZodType(zodObject as z.ZodTypeAny);
  const fieldParams: string[] = [];
  const paramResult = correctParameterNameIfInvalid(parameterName);
  let newParamName = '';

  const camelCased = camelCase(parameterName);
  if (camelCased !== parameterName) {
    fieldParams.push(
      createJsonKey(
        parameterName,
        type instanceof z.ZodBigInt ? 'handleNumString' : null,
      ),
    );
    newParamName = camelCased;
  } else if (paramResult.isInvalid) {
    fieldParams.push(`@JsonKey(name: \'${parameterName}\')`);
    newParamName = paramResult.newValue;
  } else {
    newParamName = paramResult.newValue;
  }

  if (type instanceof z.ZodUnion && isNumString(type)) {
    fieldParams.push(`@JsonKey(fromJson: handleNumString)`);
  }
  if (!nullish) fieldParams.push('required');

  const dartType = parseZodToDartType(newParamName, type, nullish);

  fieldParams.push(dartType);
  fieldParams.push(newParamName);
  return fieldParams.join(' ');
}

export class ZodGenerator extends DartGenerator {
  constructor(public readonly dartFiles: Files) {
    super(dartFiles);
  }

  public async generate() {
    const mergedSchemas = { ...Schemas };

    console.info(
      'Parsing Zod. Found %d models.',
      Object.keys(mergedSchemas).length,
    );

    Object.entries(mergedSchemas).forEach(([key, v]) => {
      console.info('Generating Dart class for %s', key);

      if (v instanceof ZodEnum || v instanceof ZodNativeEnum) {
        const enums = Object.entries(v.enum);
        const validEnums = enums.some((e) => typeof e[1] === 'number')
          ? enums.slice(enums.length / 2, enums.length)
          : enums;

        this.files['entity.enums.dart'] += `
        enum ${key} {
            ${validEnums.reduce((pv, e) => {
              return (
                pv +
                `@JsonValue(r"${e[1]}")
                ${correctParameterNameIfInvalid(e[0]).newValue},\n`
              );
            }, '')}
          }
    `;
      } else {
        this.files[
          'entity.json.dart'
        ] += `${key} ${key}FromJson(Map<String, dynamic> json) => ${key}.fromJson(json);\n
            Map<String, dynamic> ${key}ToJson(${key} body) => body.toJson();\n
            `;

        const schemaShape = (v as any).shape || (v._def as any).innerType.shape;

        this.files['entity.dart'] += `
            @freezed
            class ${key} with _$${key} {
              @JsonSerializable(explicitToJson: true)
              const factory ${key}({ 
                ${Object.entries(schemaShape).reduce(
                  (pv, [fieldName, field]) => {
                    const param = zodToDartParameter(
                      fieldName,
                      field as z.ZodTypeAny,
                    );

                    return `${pv}${param},\n`;
                  },
                  '',
                )}
              }) = _${key};
              
              factory ${key}.fromJson(Map<String, dynamic> json) => _$${key}FromJson(json);
            }
              `;
      }
    });
  }
}
