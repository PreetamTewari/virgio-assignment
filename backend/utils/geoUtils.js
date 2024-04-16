function calculateGeohashPrecision(range) {
    const earthCircumference = 40075017; 
    const geohashPrecision = Math.ceil((Math.log(earthCircumference) - Math.log(range)) / Math.log(2));
    return geohashPrecision;
}
module.exports = {
    calculateGeohashPrecision
};


