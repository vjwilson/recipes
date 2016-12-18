export default function(searchParams, allowedParams) {

  const allowedKeys = Object.keys(searchParams).filter(key => {
    return allowedParams.includes(key);
  });

  const whereClauses = [];
  const paramList = [];
  allowedKeys.forEach((key, index) => {
    if (searchParams[key]) {
      whereClauses.push(`${key}=$${index + 1}`);
      paramList.push(searchParams[key]);
    }
  });
  const combinedWhereClause = whereClauses.join('&');

  return {
    whereClause: combinedWhereClause,
    paramList: paramList
  };
}
