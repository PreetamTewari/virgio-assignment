function haversineDistance(coord1, coord2) {
    const R = 6371;
    const dLat = degToRad(coord2.latitude - coord1.latitude);
    const dLon = degToRad(coord2.longitude - coord1.longitude);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(coord1.latitude)) * Math.cos(degToRad(coord2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000;
  
    return distance;
  }
  
  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

module.exports = {
    haversineDistance
}