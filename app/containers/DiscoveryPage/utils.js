const MILE_PER_DEGREE_LATITUDE = 1 / 69;
const MILE_PER_DEGREE_LONGITUDE = 1 / 54;

export function radiusBoundingBoxFromPoint(latitude, longitude, mileRadius) {
  return {
    _sw: {
      lng: longitude - mileRadius * MILE_PER_DEGREE_LONGITUDE,
      lat: latitude - mileRadius * MILE_PER_DEGREE_LATITUDE,
    },
    _ne: {
      lng: longitude + mileRadius * MILE_PER_DEGREE_LONGITUDE,
      lat: latitude + mileRadius * MILE_PER_DEGREE_LATITUDE,
    },
  };
}

export function shouldShowDefaultText(actualValue, optionArr) {
  return actualValue.length === optionArr.length || actualValue.length === 0;
}