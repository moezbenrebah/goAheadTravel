module.exports = class APIClass {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filtering() {
		const queryObj = { ...this.queryString };
		const excludedQueryItem = ['page', 'limit', 'sort',  'fields'];
		excludedQueryItem.forEach(item => delete queryObj[item])
		
		// Implementing filter query
		let queryToString = JSON.stringify(queryObj);
		queryToString = queryToString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

		this.query = this.query.find(JSON.parse(queryToString));

		return this;
	}

	sorting() {
		if (this.queryString.sort) {
			const querySort = this.queryString.sort.split(',').join('');
			this.query = this.query.sort(querySort);
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	fieldsLimiting() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}

	pagination() {
		const page = this.queryString.page * 1 || 1; // JS trick to convert a string to number
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}
