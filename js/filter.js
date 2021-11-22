const ANY = 'any';
const MAX_ITEMS = 10;

const PriceMap = {
  LOW: {
    MIN: 0,
    MAX: 10000,
  },
  MIDDLE: {
    MIN: 10000,
    MAX: 50000,
  },
  HIGH: {
    MIN: 50000,
    MAX: Infinity,
  },
};

const mapFilters = document.querySelector('.map__filters');
const housingType = mapFilters.querySelector('#housing-type');
const housingPrice = mapFilters.querySelector('#housing-price');
const housingRooms = mapFilters.querySelector('#housing-rooms');
const housingGuests = mapFilters.querySelector('#housing-guests');

const getFilteredAd = ({ offer }) => {
  const checkedFeatures = mapFilters.querySelectorAll('input[name="features"]:checked');

  let isType = true;
  let isRooms = true;
  let isGuests = true;
  let isPrice = true;
  let isFeatures = true;

  if (checkedFeatures.length) {
    checkedFeatures.forEach((feature) => {
      if (!offer.features) {
        isFeatures = false;
      } else if (offer.features.indexOf(feature.value) === -1) {
        isFeatures = false;
      }
    });

    if (!isFeatures) {
      return false;
    }
  }

  if (housingType.value !== ANY) {
    isType = offer.type === housingType.value;

    if (!isType) {
      return false;
    }
  }

  if (housingRooms.value !== ANY) {
    isRooms = offer.rooms === Number(housingRooms.value);

    if (!isRooms) {
      return false;
    }
  }

  if (housingGuests.value !== ANY) {
    isGuests = offer.guests === Number(housingGuests.value);

    if (!isGuests) {
      return false;
    }
  }

  if (housingPrice.value !== ANY) {
    isPrice = offer.price >= PriceMap[housingPrice.value.toUpperCase()].MIN && offer.price < PriceMap[housingPrice.value.toUpperCase()].MAX;

    if (!isPrice) {
      return false;
    }
  }

  return isType && isRooms && isGuests && isFeatures && isPrice;
};


const filterAds = (advertisements) => {
  const result = [];
  let i = 0;
  while (result.length <= MAX_ITEMS && i < advertisements.length) {
    const item = advertisements[i++];
    if (getFilteredAd(item)) {
      result.push(item);
    }
  }

  return result;
};


const addFiltersHandler = (cb) => {
  mapFilters.addEventListener('change', cb);
};

export { filterAds, addFiltersHandler };
