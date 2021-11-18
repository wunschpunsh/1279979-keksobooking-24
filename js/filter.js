
const mapFilters = document.querySelector('.map__filters');
const housingType = mapFilters.querySelector('#housing-type');
const housingPrice = mapFilters.querySelector('#housing-price');
const housingRooms = mapFilters.querySelector('#housing-rooms');
const housingGuests = mapFilters.querySelector('#housing-guests');
const ANY = 'any';
const priceMap = {
  low: {
    min: 0,
    max: 10000,
  },
  middle: {
    min: 10000,
    max: 50000,
  },
  high: {
    min: 50000,
    max: Infinity,
  },
};



const filteredAds = ({ offer }) => {
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
    isPrice = offer.price >= priceMap[housingPrice.value].min && offer.price < priceMap[housingPrice.value].max;

    if (!isPrice) {
      return false;
    }
  }

  return isType && isRooms && isGuests && isFeatures && isPrice;
};


const filterAds = (advertisements) => advertisements.filter(getFilterAds);


const addFiltersHandler = (cb) => {
  mapFilters.addEventListener('change', () => {
    cb();
  });
};

export { filterAds, addFiltersHandler };
