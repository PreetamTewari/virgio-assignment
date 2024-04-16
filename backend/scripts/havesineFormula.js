function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
}

const lat1 = 12.91675;
const lon1 = 77.64462;
const lat2 = 12.99051;
const lon2 =  77.6537;

const distance = haversineDistance(lat2, lon2, lat1, lon1);
console.log('Haversine Distance:', distance, 'kilometers');
