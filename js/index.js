window.onload = () => {
  displayStores(stores);
}

var map;
var markers = [];
var infoWindow;
var icon;

function initMap() {
  var losAngeles = {
    lat: 34.063380,
    lng: -118.358080
  };

  icon = {
    url: "icons/store.png", // url
    // scaledSize: new google.maps.Size(20, 20), // size
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: 'roadmap',
    styles: [{
        elementType: 'geometry',
        stylers: [{
          color: '#ebe3cd'
        }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#523735'
        }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#f5f1e6'
        }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#c9b2a6'
        }]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#dcd2be'
        }]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#ae9e90'
        }]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{
          color: '#dfd2ae'
        }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
          color: '#dfd2ae'
        }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#93817c'
        }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#a5b076'
        }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#447530'
        }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          color: '#f5f1e6'
        }]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: '#fdfcf8'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: '#f8c967'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#e9bc62'
        }]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{
          color: '#e98d58'
        }]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#db8555'
        }]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#806b63'
        }]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{
          color: '#dfd2ae'
        }]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#8f7d77'
        }]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#ebe3cd'
        }]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{
          color: '#dfd2ae'
        }]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{
          color: '#b9d3c2'
        }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#92998d'
        }]
      }
    ]
  });

  infoWindow = new google.maps.InfoWindow();

  showStoresMarkers(stores);

  // var marker = new google.maps.Marker({
  //     position: ktm,
  //     map: map,
  //     title: 'Kathmandu'
  // });
}

function displayStores(stores) {
  // console.log(stores);
  var storesHtml = '';
  for (var [index, store] of stores.entries()) {
    var address = store['addressLines'];
    var phone = store['phoneNumber'];
    storesHtml += `
        <div class="store-container" onclick="showInfoBox(${index});">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span>
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>
                </div>
                <div class="store-number-container">
                    <div class="store-number">${++index}</div>
                </div>
            </div>
        `;
  }
  document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for (var [index, store] of stores.entries()) {
    // console.log(store);
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    var name = store.name;
    var address = store.addressLines[0];
    var phoneNumber = store.phoneNumber;
    var openStatusText = store.openStatusText;

    // window.setTimeout(function() {
      createMarker(latlng, name, address, phoneNumber, openStatusText, index + 1, index * 100);
    // },200);
    bounds.extend(latlng);
  }
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, phoneNumber, openStatusText, index, timeout) {
  var html = `<div class="info-box-container" store-id="${index}"><div class="info-name"><i class="fa fa-store"></i> ${name}</div><div class="info-address"><a href="https://www.google.com/maps?saddr=My+Location&daddr=${address}" target="_blank"><i class="fa fa-location-arrow"></i> ${address}</a></div><div class="info-phone-number"><i class="fa fa-phone"></i> ${phoneNumber}</div><div class="info-opentime"><i class="fa fa-clock"></i> ${openStatusText}</div></div>`;

  window.setTimeout(function() {
    var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    // label: index.toString(),
    label: {
      text: index.toString(),
      color: "#000",
      fontSize: '14px',
      // fontWeight: 'bold',
    },
    icon: icon,
    id: index,
    animation: google.maps.Animation.DROP
  });
  markers.push(marker);
  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  }, timeout);


  
  
}

function showInfoBox(markerId) {
  console.log(markerId);
  google.maps.event.trigger(markers[markerId], 'click');
};

function searchStores() {
  var foundStores = [];
  var zipcode = document.getElementById("zip-code-input").value;
  console.log(zipcode);
  for (var store of stores) {
    var postal = store.address.postalCode.substring(0, 5);
    if (postal == zipcode) {
      foundStores.push(store);
    }
  }
  clearMarkers();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}