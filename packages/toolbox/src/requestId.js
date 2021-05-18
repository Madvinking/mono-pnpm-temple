import { v4 } from 'uuid';

export const REQUEST_ID_LOG_FIELD = 'requestId';
export const REQUEST_ID_HEADER_NAME = 'x-request-id';

export function getRequestIdFromHeaders(headers = {}) {
  return headers[REQUEST_ID_HEADER_NAME] || v4();
}

export function addRequestIdToLog(headers = {}, data = {}) {
  data[REQUEST_ID_LOG_FIELD] = getRequestIdFromHeaders(headers);

  return data;
}

export function setRequestIdToHeaders(headers = {}) {
  if (!headers[REQUEST_ID_HEADER_NAME]) headers[REQUEST_ID_HEADER_NAME] = v4();
}
