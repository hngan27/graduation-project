export const formatDateTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  return formattedDate;
};

export const dateFromTimeAndDate = (time: string, date: string) => {
  return new Date(`${date}T${time}:00`);
};

export const timeAndDateFromDateObject = (date: Date) => {
  const dateString = date.toISOString().split('T')[0];
  const timeString = date.toTimeString().split(' ')[0].substring(0, 5);
  return { time: timeString, date: dateString };
};
