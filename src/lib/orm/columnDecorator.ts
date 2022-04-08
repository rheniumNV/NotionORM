import "reflect-metadata";

export const COLUMN_METADATA_KEY = Symbol("NOTION_ORM_COLUMN_METADATA");

type FieldType<CodeType, RawType> = {
  encoder: (data: CodeType) => RawType;
  decoder: (data: RawType) => CodeType;
};
export type ColumnMetadata<CodeType, RawType> = {
  rawName?: string;
  type: FieldType<CodeType, RawType>;
};

export default function Column<CodeType, RawType>(
  option: ColumnMetadata<CodeType, RawType>
) {
  return Reflect.metadata(COLUMN_METADATA_KEY, option);
}
