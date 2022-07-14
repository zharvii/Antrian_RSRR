let dirname = "";

const set = (path) => {
  dirname = path;
};

const get = () => {
  return dirname;
};

module.exports = {
  set: set,
  get: get,
};
