const Type = {
  FLAT: 'Квартира',
  BUNGALOW: 'Бунгало',
  HOUSE: 'Дом',
  PALACE: 'Дворец',
  HOTEL: 'Отель',
};

const similarCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');


const createPopup = ({ author, offer }) => {

  const cardElement = similarCardTemplate.cloneNode(true);
  const renderIf = function (className, data, textContent = data) {
    const element = cardElement.querySelector(className);
    if (data) {
      element.textContent = textContent;
    } else {
      element.remove();
    }
  };
  renderIf('.popup__title', offer.title);
  renderIf('.popup__text--address', offer.address);
  renderIf('.popup__text--price', offer.price, `${offer.price}₽/ночь`);
  renderIf('.popup__type', offer.type, Type[offer.type.toUpperCase()]);
  renderIf('.popup__text--capacity', offer.rooms, `${offer.rooms} комнаты для ${offer.guests} гостей`);
  renderIf('.popup__text--time', offer.checkout, `Заезд после ${offer.checkin} , выезд до ${offer.checkout}`);
  const featuresContainer = cardElement.querySelector('.popup__features');
  if (offer.features) {
    const featuresFragment = document.createDocumentFragment();
    for (let i = 0; i < offer.features.length; i++) {
      const featureItem = document.createElement('li');
      featureItem.classList.add('popup__feature', `popup__feature--${offer.features[i]}`);
      featuresFragment.append(featureItem);
    }
    featuresContainer.innerHTML = '';
    featuresContainer.append(featuresFragment);
  } else {
    featuresContainer.remove();
  }

  renderIf('.popup__description', offer.description);
  const photosContainer = cardElement.querySelector('.popup__photos');
  if (offer.photos && offer.photos.length) {
    const photoFragment = document.createDocumentFragment();
    const photoElement = photosContainer.querySelector('img');
    for (let i = 0; i < offer.photos.length; i++) {
      const clone = photoElement.cloneNode();
      clone.src = offer.photos[i];
      photoFragment.append(clone);
    }
    photosContainer.innerHTML = '';
    photosContainer.append(photoFragment);
  } else {
    photosContainer.remove();
  }


  cardElement.querySelector('.popup__avatar').src = author.avatar;
  return cardElement;

};

export { createPopup };
