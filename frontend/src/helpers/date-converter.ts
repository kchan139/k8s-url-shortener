export const toDateWithSlashes = (dateObject: Date) => {
  return dateObject.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const toDateTimeWithSlashes = (dateObject: Date) => {
  const formattedDate = dateObject.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = dateObject.toLocaleTimeString('en-US', {
    hour12: false,
  });

  return formattedDate + ' ' + formattedTime;
};
