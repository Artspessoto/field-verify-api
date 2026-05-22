//reference: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export function getDistanceBetweenCoordinates(
  startPoint: Coordinate,
  finalPoint: Coordinate,
): number {
  const R = 6371; //Earth radius in km

  //converts the difference between coordinates from degrees to radians
  const dLat = ((finalPoint.latitude - startPoint.latitude) * Math.PI) / 180;
  const dLong = ((finalPoint.longitude - startPoint.longitude) * Math.PI) / 180;

  //convert original latitudes from degress to radians
  const lat1 = (startPoint.latitude * Math.PI) / 180;
  const lat2 = (finalPoint.latitude * Math.PI) / 180;

  //haversine formula (calculate curvature of Earth between 2 points)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLong / 2) * Math.sin(dLong / 2);

  //calculates angular distance in radians using arctangent (ensures accuracy at short distances)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //multiply the angular distance by the Earth 's radius to obtain the actual distance in km.
  const distance = R * c;

  return distance;
}
