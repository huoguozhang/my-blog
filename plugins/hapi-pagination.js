const hapiPagination = require('hapi-pagination');

const options = {
  query: {
    page: {
      name: 'the_page' // The page parameter will now be called the_page
    },
    limit: {
      name: 'per_page', // The limit will now be called per_page
      default: 10       // The default value will be 10
    }
  },
  meta: {
    location: 'body', // The metadata will be put in the response body
    name: 'metadata', // The meta object will be called metadata
    count: {
      active: true,
      name: 'count'
    },
    pageCount: {
      name: 'totalPages'
    },
    self: {
      active: false // Will not generate the self link
    },
    first: {
      active: false // Will not generate the first link
    },
    last: {
      active: false // Will not generate the last link
    }
  },
  routes: {
    include: ['/article'],
  }
}

module.exports = {
  plugin: hapiPagination,
  options
};
