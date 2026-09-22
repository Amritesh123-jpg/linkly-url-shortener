const getPagination = (page = 1, limit = 5) => {
  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  if (isNaN(limit) || limit < 1) {
    limit = 5;
  }

  if (limit > 50) {
    limit = 50;
  }

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

const getTotalPages = (total, limit) => {
  return Math.ceil(total / limit);
};

module.exports = {
  getPagination,
  getTotalPages,
};