module.exports.waitForResponseByUrl = function (url) {
  return this.waitForResponse(response => response.url().includes(url));
};
