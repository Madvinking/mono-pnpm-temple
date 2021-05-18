function sendLog(level, data) {
  // fetch('/client/log', {
  //   method: 'POST',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ data, level })
  // }).catch(err => {
  //   console.log('err sending log', err)
  // })
  console.log({ ...data, level });
}
function error(...data) {
  sendLog('ERROR', data);
}
function info(...data) {
  sendLog('INFO', data);
}

function warn(...data) {
  sendLog('WARN', data);
}

function debug(...data) {
  sendLog('DEBUG', data);
}
export const logger = {
  error,
  info,
  warn,
  debug,
};
