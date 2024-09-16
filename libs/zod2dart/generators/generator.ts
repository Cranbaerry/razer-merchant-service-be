export type Files = Record<
  | 'entity.dart'
  | 'entity.json.dart'
  | 'entity.enums.dart'
  | 'entity.enums.dart',
  string
>;

export const dartFiles: Files = {
  'entity.dart': `
import 'package:freezed_annotation/freezed_annotation.dart';

part 'entity.freezed.dart';
part 'entity.g.dart';
part 'entity.json.dart';
part 'entity.enums.dart';

dynamic handleNumString(val) {
  if (val is String) return num.tryParse(val) ?? 0;
  return val;
}
`,
  'entity.enums.dart': `
part of 'entity.dart';
`,
  'entity.json.dart': `
part of 'entity.dart';
`,
};

export abstract class DartGenerator {
  constructor(public readonly files: Files) {}
}
