import { expect } from 'chai';

import queryBuilder from './queryBuilder';

describe('queryBuilder service', function() {
  it('should return an empty where clause, and param array when no allowed params are in the query params', function() {
    const requestedParams ={
      foo: 'bar',
      baz: 'snafu'
    };
    const allowedParams = [
      'name',
      'email'
    ];

    const processedQuery = queryBuilder(requestedParams, allowedParams);

    expect(processedQuery.whereClause).to.be.empty;
    expect(processedQuery.paramList).to.be.empty;
  });

  it('should return a single where clause, and matching param array when one allowed param is in the query params', function() {
    const name = 'Cindy Lou Who';
    const requestedParams ={
      name: name,
      baz: 'snafu'
    };
    const allowedParams = [
      'name',
      'email'
    ];

    const processedQuery = queryBuilder(requestedParams, allowedParams);

    expect(processedQuery.whereClause).to.equal('name=$1');
    expect(processedQuery.paramList).to.eql([name]);
  });

  it('should return a multi-part where clause, and matching param array when more than one allowed param is in the query params', function() {
    const name = 'Cindy Lou Who';
    const email = 'cindylou.who@example.com';
    const requestedParams ={
      name: name,
      baz: 'snafu',
      email: email
    };
    const allowedParams = [
      'name',
      'email',
      'foo'
    ];

    const processedQuery = queryBuilder(requestedParams, allowedParams);

    expect(processedQuery.whereClause).to.equal('name=$1&email=$2');
    expect(processedQuery.paramList).to.eql([name, email]);
  });
});