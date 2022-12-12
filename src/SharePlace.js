import {Modal} from "./UI/Modal";
import {Map} from "./UI/Map";
import {getCoordsFromAddress, getAddressFromCoords} from "./Utility/Location";

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locateUserBtn = document.querySelector('#locate-btn');
        this.shareBtn = document.getElementById('share-btn');

        addressForm.addEventListener('submit', this.findAddressHandler);
        locateUserBtn.addEventListener('click', () => this.locateUserHandler());
        this.shareBtn.addEventListener('click', this.sharePlaceHandler);
    }

    selectPlace(coordinates, address) {
        if(this.map) {
            this.map.render(coordinates);
            return;
        }

        this.map = new Map(coordinates);

        this.shareBtn.disabled = false;

        const shareLinkInputEl = document.getElementById('share-link');
        shareLinkInputEl.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
    }

     locateUserHandler() {
        if(!navigator.geolocation) {
            alert('Location feature is not available in your browser - please use a more modern browser or manually enter the address!');
            return;
        }

        const modal = new Modal('loading-modal-content', 'Loading location..., please wait!');
        modal.show();

        navigator.geolocation.getCurrentPosition(async position => {
            const coordinates = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            modal.hide();
            const address = await getAddressFromCoords(coordinates);
            this.selectPlace(coordinates, address);
        }, error => {
            modal.hide();
            alert('Could not locate you unfortunately. Please enter an address manually');
        }, {
            enableHighAccuracy: true
        });
    }

    findAddressHandler(event) {
        event.preventDefault();
        const address = event.target.querySelector('input').value;

        if(!address.trim()) {
            alert('Invalid address - please try again');
            return;
        }

        const modal = new Modal('loading-modal-content', 'Loading location..., please wait!');
        modal.show();

        getCoordsFromAddress(address)
            .then(coords => {
                this.selectPlace(coords);
            })
            .catch(error => console.log(error.message))
            .finally(() => modal.hide());
    }

    sharePlaceHandler() {
        const shareLinkInputEl = document.getElementById('share-link');

        if(!navigator.clipboard) {
            shareLinkInputEl.select();
            return;
        }

        navigator.clipboard.writeText(shareLinkInputEl.value)
            .then(() => {
                alert('Copied into clipboard');
            })
            .catch(error => {
                shareLinkInputEl.select();
                console.log(error.message);
            });
    }
}

new PlaceFinder();