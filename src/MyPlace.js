import {Map} from "./UI/Map";

class LoadedPlace{
    constructor(coords, address) {
        new Map(coords);
        const headerTitleEl = document.querySelector('h1');
        headerTitleEl.textContent = address;
    }
}

const url = new URL(location.href);
const queryParams = url.searchParams;

const coords = {
    lat: parseFloat(queryParams.get('lat')),
    lng: parseFloat(queryParams.get('lng'))
};

const address = queryParams.get('address');

new LoadedPlace(coords, address);