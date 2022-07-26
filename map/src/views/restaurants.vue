<template>
  <div class="container">
    <h2 class="restaurant_location">桃園市熱門餐廳</h2>
    <div class="map-container">
      <!-- <ul class="restaurant_nav">
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{active: $route.query.district === 'zhongli' || !$route.query.district}"
            :to="{name: 'restaurants', query: {district: 'zhongli'}}"
          >中壢區</router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{active: $route.query.district === 'taoyuan'}"
            :to="{name: 'restaurants', query: {district: 'taoyuan'}}"
          >桃園區</router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :class="{active: $route.query.district === 'pingzhen'}"
            :to="{name: 'restaurants', query: {district: 'pingzhen'}}"
          >平鎮區</router-link>
        </li>
      </ul> -->
      <div class="search">
        <input id="search-input" type="text" placeholder="請輸入餐廳名稱" ref="searchInputRef" v-model="searchInputRef">
      </div>
      <!--地圖呈現在此-->
      <div class="google-map" id="map"></div>
    </div>
  </div>
</template>

<script>
// 引入餐廳 Dummy data
// import zhongli from '../dummy_data/zhongli.json';
// import taoyuan from '../dummy_data/taoyuan.json';
// import pingzhen from '../dummy_data/pingzhen.json';

export default {
  name: 'RestaurantsMap',
  data() {
    return {
      map: null,
      // 預設經緯度在中壢區附近
      lat: 24.955405221676468,
      lng: 121.22558478085799,
      currentPosition: {},
      // 存放目前開啟的訊息視窗
      infowindow: null,
      restaurants: [],
      // 存放已建立的地標
      markers: [],
      isLoading: true,
      selectRestaurants: {},
      options: {},
      searchInputRef: '', // place API要綁定的搜尋框
      place: null, // 存place確定後回傳的資料
      directiosService: null,
      directiosRenderer: null
    };
  },
  mounted() {
    // 透過 query 確認要瀏覽的地區為何
    // const { district } = this.$route.query;
    // console.log(district);
    // 取得餐廳假資料
    // this.fetchRestaurants(district);
    this.initMap();
    this.siteAuto();
    // 使用餐廳假資料建立地標
    // this.setMarker();
  },
  // beforeRouteUpdate(to, from, next) {
  //   const { district } = to.query;
  //   // 取得餐廳假資料
  //   this.fetchRestaurants(district);
  //   // 設定新的地圖中心
  //   this.resetCenter();
  //   this.setMarker();
  //   next();
  // },
  methods: {
    // 建立地圖
    initMap() {
      // 透過 Map 物件建構子建立新地圖 map 物件實例，並將地圖呈現在 id 為 map 的元素中
      this.map = new google.maps.Map(document.getElementById('map'), {
        // 設定地圖的中心點經緯度位置
        center: { lat: this.lat, lng: this.lng },
        // 設定地圖縮放比例 0-20
        zoom: 15,
        // 限制使用者能縮放地圖的最大比例
        maxZoom: 20,
        // 限制使用者能縮放地圖的最小比例
        minZoom: 3,
        // 設定是否呈現右下角街景小人
        streetViewControl: true,
        // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
        mapTypeControl: false
      });
      if (navigator.geolocation) {
        console.log('true');
      }
      navigator.geolocation.getCurrentPosition(position => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(this.currentPosition);
          this.map.setCenter(this.currentPosition);
          this.map.setZoom(16);
      })
    },
    siteAuto() {
      const options = this.options = {
        types: ['restaurant'],
        componentRestrictions: { country: 'tw' },
        bounds: {
          east: this.lng + 0.1,
          west: this.lng - 0.1,
          south: this.lat - 0.1,
          north: this.lat + 0.1
        },
        strictBounds: false
      }
      console.log('限制範圍:', this.options)
      const autocomplete = new google.maps.places.Autocomplete(
        this.$refs.searchInputRef, options);
      autocomplete.addListener('place_changed', () => {
        this.place = autocomplete.getPlace();
        console.log(this.place);
         // 確認回來的資料有經緯度
        if (this.place.geometry) {
          // 改變map的中心點
          const searchCenter = this.place.geometry.location;
          console.log(searchCenter);
          // panTo是平滑移動、setCenter是直接改變地圖中心
          this.map.panTo(searchCenter);
          // 在搜尋結果的地點上放置標記
          this.markers = new google.maps.Marker({
            position: searchCenter,
            map: this.map
          });
          // // info window
          const infowindow = new google.maps.InfoWindow({
            content: `
             <div id="content">
               <h3>${this.place.name}</h3>
               <p>評價:${this.place.rating}顆星</p>
               <p>${this.place.formatted_address}</p>
             </div>
           `,
            maxWidth: 200
          });
          infowindow.open(this.map, this.markers);
        }
        this.selectRestaurants = {
          location: this.place.geometry.location,
          placeId: this.place.place_id,
          name: this.place.name,
          address: this.place.formatted_address,
          phoneNumber: this.place.formatted_phone_number,
          rating: this.place.rating
        };
        console.log(this.selectRestaurants);
        this.markers.setPosition(this.selectRestaurants.location);
        if (!this.directiosService) {
          this.directiosService = new google.maps.DirectionsService();
        }
        if (!this.directiosRenderer) {
          this.directiosRenderer = new google.maps.DirectionsRenderer({
            map: this.map
          });
        }
        this.directiosRenderer.set('directions', null);
        this.directiosService.route({
          origin: new google.maps.LatLng(
            // this.currentPosition.lat,
            // this.currentPosition.lng
            this.lat,
            this.lng
          ),
          destination: {
            placeId: this.selectRestaurants.placeId
          },
          travelMode: 'WALKING'
        }, (response, status) => {
          if (status === 'OK') {
            this.directiosRenderer.setDirections(response);
          }
        })
      })
    }
    // fetchRestaurants(district = 'zhongli') {
    //   let dummyData = {};
    //   // 依照所選擇的地區使用對應的 dummy data
    //   if (district === 'zhongli') {
    //     dummyData = zhongli;
    //   } else if (district === 'taoyuan') {
    //     dummyData = taoyuan;
    //   } else {
    //     dummyData = pingzhen;
    //   }

    //   this.restaurants = dummyData.restaurants;
    //   console.log(this.restaurants);
    //   this.lat = dummyData.center.lat;
    //   this.lng = dummyData.center.lng;
    //   this.isLoading = false;
    // },
    // // 重設地圖中心點
    // resetCenter() {
    //   // set center
    //   this.map.panTo({ lat: this.lat, lng: this.lng });
    // },
    // // 清除所有地標
    // deleteMarkers() {
    //   this.markers.forEach(marker => marker.setMap(null));
    //   this.markers = [];
    // },
    // // 建立地標
    // setMarker() {
    //   // 將已存在的地標都先刪除
    //   this.deleteMarkers();
    //   // 建立一個新地標
    //   // eslint-disable-next-line no-unused-vars
    //   // 為每間餐廳都建立地標、訊息視窗、事件監聽
    //   this.restaurants.forEach(location => {
    //     const marker = new google.maps.Marker({
    //       // 設定為該餐廳的座標
    //       position: { lat: location.lat, lng: location.lng },
    //       map: this.map
    //     });
    //   // eslint-disable-next-line no-unused-vars
    //   // 將新建立的地標存起來
    //   this.markers.push(marker);
    //    // 透過 InfoWindow 物件建構子建立新訊息視窗
    //     const infowindow = new google.maps.InfoWindow({
    //       // 設定想要顯示的內容
    //       content: `
    //         <div id="content">
    //           <p id="firstHeading" class="firstHeading">${location.name}</p>
    //         </div>
    //       `,
    //       // 設定訊息視窗最大寬度
    //       maxWidth: 200
    //     });
    //     // 在地標上監聽點擊事件
    //     marker.addListener('click', () => {
    //       // 如果目前有開啟中的訊息視窗，先將其關閉
    //       if (this.infowindow) this.infowindow.close();
    //       // 指定在哪個地圖和地標上開啟訊息視窗
    //       infowindow.open(this.map, marker);
    //       // 存入目前開啟的訊息視窗
    //       this.infowindow = infowindow;
    //     });
    //   })
    // }
  }
};
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 500px;
}
.restaurant_nav{
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    padding-left: 0;
}
a{
  font-size: 25px;
  text-decoration: none;
}
a.active {
  border-bottom: 3px solid #007bff;
}
.search{
  margin: 10px 0;
}
#search-input{
  outline: none;
  padding: 5px 10px;
}
</style>
