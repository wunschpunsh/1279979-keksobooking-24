import { setFormStateDisabled } from './form.js';
import { createPopup } from './popup.js';
import { getData } from './api.js';
import { filterAds, addFiltersHandler } from './filter.js';
import { debounce } from './utils/debounce.js';

const address = document.querySelector('input[name="address"]');

setFormStateDisabled(true);

const map = L.map('map-canvas');

map.on('load', () => {
  setTimeout(() => {
    setFormStateDisabled(false);
  }, 500);
});

map.setView(
  {
    lat: 35.6895,
    lng: 139.692,
  }, 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const mainIcon = L.icon(
  {
    iconUrl: 'img/main-pin.svg',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
  });

const mainMarker = L.marker(
  {
    lat: 35.6895,
    lng: 139.692,
  },
  {
    icon: mainIcon,
    draggable: true,
  },
);

mainMarker.addTo(map);
address.value = `${mainMarker.getLatLng().lat.toFixed(5)}, ${mainMarker.getLatLng().lng.toFixed(5)}`;
mainMarker.on('moveend', (evt) => {
  address.value = `${evt.target.getLatLng().lat.toFixed(5)}, ${evt.target.getLatLng().lng.toFixed(5)}`;
});

const getAllMarkers = (data) => {

  const newData = data.slice(0, 10);
  for (let i = 0; i < newData.length; i++) {
    const icon = L.icon(
      {
        iconUrl: 'img/pin.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
    const marker = L.marker(newData[i].location, { icon });
    marker.addTo(map);
    marker.bindPopup(createPopup(newData[i]));

  }
};

getData((data) => {
  setFormStateDisabled(false);
  getAllMarkers(data);
  addFiltersHandler(debounce(() => {

    map.eachLayer((layer) => {
      if (layer.options && layer.options.icon && layer.options.icon.options.iconUrl !== 'img/main-pin.svg') {
        layer.remove();
      }
    });

    getAllMarkers(filterAds(data));
  }));
});

export { mainMarker, address, map };
