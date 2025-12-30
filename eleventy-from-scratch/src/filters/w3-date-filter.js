import { DateTime } from 'luxon';

export const w3DateFilter = (value) => {
	return DateTime.fromISO(value, { zone: 'utc' }).toString();
};
