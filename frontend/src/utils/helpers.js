import { formatDistance } from 'date-fns';

export const shortenAddress = (addr) => {
  if (!addr) return '';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export const shortenSignature = (signature) => {
  if (!signature) return '';
  return `${signature.substring(0, 18)}...`;
};


export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp * 1000);
  return {
    absolute: date.toLocaleString(),
    relative: formatDistance(date, new Date(), { addSuffix: true })
  };
};

export const formatRentEpoch = (nanoseconds) => {
  if (!nanoseconds) return 'N/A';
  const milliseconds = nanoseconds / 1000000;
  const date = new Date(milliseconds);
  return date.toLocaleString();
};