class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing field of query
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((item) => delete queryCopy[item]);

    // Advance filter by price, ratings etc...
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}
module.exports = ApiFeatures;

//QUERY AVANCED
//{{DOMAIN}}/api/v1/products?keyword=canon&category=Cameras&price[gte]=1&price[lte]=400
