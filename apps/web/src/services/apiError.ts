export function getApiErrorMessage(err: unknown, fallbackMessage = 'Request failed'): string {
  if (!err) return fallbackMessage;

  const errorObj = err as {
    response?: {
      data?: {
        error?: string;
        message?: string;
      };
      statusText?: string;
    };
    message?: string;
  };

  return (
    errorObj.response?.data?.error ||
    errorObj.response?.data?.message ||
    errorObj.message ||
    fallbackMessage
  );
}
