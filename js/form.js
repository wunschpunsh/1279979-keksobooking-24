import { mainMarker, address, map } from './map.js';

const roomToCapacity = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0],
};
const typeToValue = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,
};

const adForm = document.querySelector('.ad-form');
const mapFilterForm = document.querySelector('.map__filters');
const resetButton = document.querySelector('.ad-form__reset');
const setFormStateDisabled = function (show) {
  const fieldsets = adForm.querySelectorAll('fieldset');
  const mapFilters = mapFilterForm.querySelectorAll('.map__filter');
  const mapFeatures = mapFilterForm.querySelectorAll('.map__features');
  for (let i = 0; i < mapFeatures.length; i++) {
    mapFeatures[i].disabled = show;
  }
  adForm.classList.toggle('.ad-form--disabled', show);
  mapFilterForm.classList.toggle('.map__filters--disabled', show);
  for (let i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = show;
  }
  for (let i = 0; i < mapFilters.length; i++) {
    mapFilters[i].disabled = show;
  }
};

const price = document.querySelector('input[name="price"]');
const type = document.querySelector('select[name="type"]');
const room = document.querySelector('select[name="rooms"]');
const capacity = document.querySelector('select[name="capacity"]');
const timein = document.querySelector('select[name="timein"]');
const timeout = document.querySelector('select[name="timeout"]');

const onTypeChange = () => {
  price.min = typeToValue[type.value];
  price.placeholder = `${typeToValue[type.value]}`;
};
type.addEventListener('change', onTypeChange);
onTypeChange();

const onRoomChange = () => {
  for (let i = 0; i < capacity.children.length; i++) {
    const option = capacity.children[i];
    option.disabled = true;
    const capacityValues = roomToCapacity[room.value];
    for (let j = 0; j < capacityValues.length; j++) {
      if (+option.value === capacityValues[j]) {
        option.disabled = false;
        option.selected = true;
      }
    }
  }
};
room.addEventListener('change', onRoomChange);
onRoomChange();

timein.addEventListener('change', () => {
  const timeoutOptions = timeout.options;
  for (let i = 0; i < timeoutOptions.length; i++) {
    if (timein.value === timeoutOptions[i].value) {
      timeoutOptions[i].selected = true;
    }

  }
});
timeout.addEventListener('change', () => {
  const timeinOptions = timein.options;
  for (let i = 0; i < timeinOptions.length; i++) {
    if (timeout.value === timeinOptions[i].value) {
      timeinOptions[i].selected = true;
    }
  }
});
const resetForm = () => {
  mapFilterForm.reset();

  price.placeholder = typeToValue.flat;
  mainMarker.setLatLng({ lat: 35.68950, lng: 139.69200 });

  setTimeout(() => {
    address.value = `${35.68950.toFixed(5)}, ${139.69200.toFixed(5)}`;
  }, 0);
  map.closePopup();
};
resetButton.addEventListener('click', () => {
  resetForm();
});

const getSuccessMessage = () => {
  const body = document.querySelector('body');
  const successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  const successMessageElement = successTemplate.cloneNode(true);
  body.append(successMessageElement);
  const closeListenerSuccessByKeydown = (evt) => {
    if (evt.key === 'Escape') {
      document.removeEventListenre('keydown', closeListenerSuccessByKeydown)
      successMessageElement.remove();
    }
  };

  const closeListenerSuccessByClick = () => {
    successMessageElement.removeEventListener('click', closeListenerSuccessByClick);
    successMessageElement.remove();

  };
  successMessageElement.addEventListener('click', closeListenerSuccessByClick);
  document.addEventListener('keydown', closeListenerSuccessByKeydown);

};
const getErrorMessage = () => {
  const body = document.querySelector('body');
  const errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  const errorMessageElement = errorTemplate.cloneNode(true);
  body.append(errorMessageElement);
  const closeListenerErrorByKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      document.removeEventListener('keydown', closeListenerErrorByKeyDown);
      errorMessageElement.remove();
    }
  };
  const closeListenerErrorByClick = () => {
    errorMessageElement.removeEventListener('click', closeListenerErrorByClick);
    errorMessageElement.remove();
    ;
  };
  errorMessageElement.addEventListener('click', closeListenerErrorByClick);
  document.addEventListener('keydown', closeListenerErrorByKeyDown);
};


const setUserFormSubmit = () => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    fetch('https://24.javascript.pages.academy/keksobooking',
      {
        method: 'POST',
        body: formData,
      },
    )
      .then((response) => {
        if (response.ok) {
          resetForm();
          getSuccessMessage();
        } else {
          getErrorMessage();
        }
      })
      .catch(() => getErrorMessage());
  });
};

export { setFormStateDisabled, setUserFormSubmit };
