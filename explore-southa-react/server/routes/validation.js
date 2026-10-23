function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isString(value, maxLength) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

function parseFields(body, fields, required = []) {
  if (!isObject(body)) {
    return { error: "Request body must be a JSON object." };
  }

  const values = {};
  for (const [field, validate] of Object.entries(fields)) {
    if (!(field in body)) {
      if (required.includes(field)) {
        return { error: `${field} is required.` };
      }
      continue;
    }

    const result = validate(body[field]);
    if (result === undefined) {
      return { error: `${field} is invalid.` };
    }
    values[field] = result;
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !(field in fields),
  );
  if (unknownFields.length > 0) {
    return { error: `Unsupported field: ${unknownFields[0]}.` };
  }

  if (Object.keys(values).length === 0) {
    return { error: "Provide at least one supported field." };
  }

  return { values };
}

function stringField(maxLength) {
  return (value) => (isString(value, maxLength) ? value.trim() : undefined);
}

function nullableStringField(maxLength) {
  return (value) =>
    value === null || isString(value, maxLength)
      ? typeof value === "string"
        ? value.trim()
        : null
      : undefined;
}

module.exports = {
  isObject,
  isString,
  parseFields,
  stringField,
  nullableStringField,
};
