const geohash = require('ngeohash');

const lat = 77.64462;
const lon = 12.91675;
// const lon1 = 12.99051;

// const lat = 77.64462;
// const lon = 12.91675;

res = geohash.encode(lat, lon, 20)
console.log(res)