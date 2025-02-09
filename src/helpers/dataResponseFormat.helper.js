const dataResponseFormat = (data) => {
  const result = data.toObject();
  delete result._id;
  delete result.__v;
  delete result.updatedAt;

  return result;
};

module.exports = dataResponseFormat;
