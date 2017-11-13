export default function(searchParams, allowedParams, fuzzyMatch = false) {

  const allowedKeys = Object.keys(searchParams).filter(key => {
    return allowedParams.includes(key);
  });

  const whereClauses = [];
  const paramList = [];
  const operator = (fuzzyMatch) ? ' ILIKE ' : '=';

  allowedKeys.forEach((key, index) => {
    if (searchParams[key]) {
      whereClauses.push(`${key}${operator}$${index + 1}`);

      const value = (fuzzyMatch) ? `%${searchParams[key]}%` : searchParams[key];
      paramList.push(value);
    }
  });
  const combinedWhereClause = whereClauses.join('&');

  return {
    whereClause: combinedWhereClause,
    paramList: paramList
  };
}
