"use strict";(self["webpackChunkmap"]=self["webpackChunkmap"]||[]).push([[308],{165:function(t,e,s){s.r(e),s.d(e,{default:function(){return c}});var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"container"},[e("h2",{staticClass:"restaurant_location"},[t._v("桃園市熱門餐廳")]),e("div",{staticClass:"map-container"},[e("div",{staticClass:"search"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.searchInputRef,expression:"searchInputRef"}],ref:"searchInputRef",attrs:{id:"search-input",type:"text",placeholder:"請輸入餐廳名稱"},domProps:{value:t.searchInputRef},on:{input:function(e){e.target.composing||(t.searchInputRef=e.target.value)}}})]),e("div",{staticClass:"google-map",attrs:{id:"map"}})])])},o=[],n={name:"RestaurantsMap",data(){return{map:null,lat:24.955405221676468,lng:121.22558478085799,currentPosition:{},infowindow:null,restaurants:[],markers:[],isLoading:!0,selectRestaurants:{},options:{},searchInputRef:"",place:null,directiosService:null,directiosRenderer:null}},mounted(){this.initMap(),this.siteAuto()},methods:{initMap(){this.map=new google.maps.Map(document.getElementById("map"),{center:{lat:this.lat,lng:this.lng},zoom:15,maxZoom:20,minZoom:3,streetViewControl:!0,mapTypeControl:!1}),navigator.geolocation&&console.log("true"),navigator.geolocation.getCurrentPosition((t=>{this.currentPosition={lat:t.coords.latitude,lng:t.coords.longitude},console.log(this.currentPosition),this.map.setCenter(this.currentPosition),this.map.setZoom(16)}))},siteAuto(){const t=this.options={types:["restaurant"],componentRestrictions:{country:"tw"},bounds:{east:this.lng+.1,west:this.lng-.1,south:this.lat-.1,north:this.lat+.1},strictBounds:!1};console.log("限制範圍:",this.options);const e=new google.maps.places.Autocomplete(this.$refs.searchInputRef,t);e.addListener("place_changed",(()=>{if(this.place=e.getPlace(),console.log(this.place),this.place.geometry){const t=this.place.geometry.location;console.log(t),this.map.panTo(t),this.markers=new google.maps.Marker({position:t,map:this.map});const e=new google.maps.InfoWindow({content:`\n             <div id="content">\n               <h3>${this.place.name}</h3>\n               <p>評價:${this.place.rating}顆星</p>\n               <p>${this.place.formatted_address}</p>\n             </div>\n           `,maxWidth:200});e.open(this.map,this.markers)}this.selectRestaurants={location:this.place.geometry.location,placeId:this.place.place_id,name:this.place.name,address:this.place.formatted_address,phoneNumber:this.place.formatted_phone_number,rating:this.place.rating},console.log(this.selectRestaurants),this.markers.setPosition(this.selectRestaurants.location),this.directiosService||(this.directiosService=new google.maps.DirectionsService),this.directiosRenderer||(this.directiosRenderer=new google.maps.DirectionsRenderer({map:this.map})),this.directiosRenderer.set("directions",null),this.directiosService.route({origin:new google.maps.LatLng(this.lat,this.lng),destination:{placeId:this.selectRestaurants.placeId},travelMode:"WALKING"},((t,e)=>{"OK"===e&&this.directiosRenderer.setDirections(t)}))}))}}},a=n,r=s(1),l=(0,r.Z)(a,i,o,!1,null,"1d075d06",null),c=l.exports}}]);
//# sourceMappingURL=restaurants.706376dd.js.map