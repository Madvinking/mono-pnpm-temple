const { DEBUG: isDebugMode } = process.env;
const logs = [];
const ship = (...args) => {
  const data = args.map(i => (i instanceof Object ? JSON.stringify(i) : i)).join(', ');

  if (isDebugMode) console.log(data);
  else logs.push(data);
};
const log = (...args) => ship('LOG:', ...args);
const info = (...args) => ship('INFO:', ...args);
const error = (...args) => ship('ERROR:', ...args);
const warn = (...args) => ship('WARN:', ...args);

module.exports.logger = {
  error,
  log,
  warn,
  logs,
  info,
};
