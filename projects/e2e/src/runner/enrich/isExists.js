async function isExists(selector) {
  if ((await this.$(selector)) !== null) return true;

  return false;
}

module.exports = {
  isExists,
};
