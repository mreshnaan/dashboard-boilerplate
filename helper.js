export const getNestedValue = (obj, path) => {
  const properties = path.split(".");
  return properties.reduce((value, key) => (value ? value[key] : ""), obj);
};
