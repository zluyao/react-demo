export default function (data, success = 0, errorCode = 0, errorMessage = 'no error.') {
  return {
    success,
    errorCode,
    errorMessage,
    data,
  };
}
