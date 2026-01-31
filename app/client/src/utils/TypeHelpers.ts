import _ from "lodash";

export enum Types {
  URL = "URL",
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  OBJECT = "OBJECT",
  ARRAY = "ARRAY",
  FUNCTION = "FUNCTION",
  UNDEFINED = "UNDEFINED",
  NULL = "NULL",
  UNKNOWN = "UNKNOWN",
}

export const getType = (value: unknown) => {
  if (typeof value === "string") return Types.STRING;

  if (typeof value === "number") return Types.NUMBER;

  if (typeof value === "boolean") return Types.BOOLEAN;

  if (Array.isArray(value)) return Types.ARRAY;

  if (typeof value === "function") return Types.FUNCTION;

  if (typeof value === "object" && value !== null) return Types.OBJECT;

  if (value === undefined) return Types.UNDEFINED;

  if (value === null) return Types.NULL;

  return Types.UNKNOWN;
};

export function isURL(str: string) {
  const pattern = new RegExp(
    "^((blob:)?https?:\\/\\/)?" + //protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(/[^?#]*)?" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // fragment locator

  return !!pattern.test(str);
}

export type TruthyPrimitiveTypes = number | string | boolean | bigint | symbol;
