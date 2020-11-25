import React, { useEffect, useRef } from "react";
import searchIcon from "miniIcon/searchIcon.png";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
// import mapStyles from "./mapStyles";

import "mycomponent.css";
import { Card } from "@material-ui/core";
import GridItem from "./components/Grid/GridItem.js";
import { getWeather, setMapPosition } from "./_reducers/weather_reducer";
import { useSelector, useDispatch } from "react-redux";

import spot from "./miniIcon/현재 위치로 설정.svg";
import weather from "./miniIcon/현재 날씨로 설정.svg";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
  margin: "0 auto",
};
const options = {
  // 0s: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
// const center = {
//   lat: 37.47979,
//   lng: 126.88394,
// };

function Mycomonent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
    libraries,
  });

  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  //전역 리덕스 디스패치 객체
  const globalDispatch = useDispatch();

  // 클릭하면 현재 위치 가져오기
  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);

    //현재 선택 위경도 정보를 전역 리덕스 정보로 갱신한다.
    globalDispatch(setMapPosition({ lat: lat, lng: lng }));

    //현재 선택 위경도 마커표시
    setMarkers((current) => [
      ...current,
      {
        lat: lat,
        lng: lng,
        time: new Date(),
      },
    ]);

    setMapPosition({ lat: lat, lng: lng });
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <Locate panTo={panTo} />
      <Search panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <p>
                {selected.lat} {selected.lng}
              </p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

// function Locate({ panTo }) {
//   return (
//     <button
//       className="locate"
//       onClick={() => {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             console.log(position.coords.latitude, position.coords.longitude);

const center = {
  lat: 37.566482,
  lng: 126.977859,
};

// function Locate({ panTo }) {
//   return (
//     <button
//       className="locate"
//       onClick={() => {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             console.log(position.coords.latitude, position.coords.longitude);

//             panTo({
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             });
//           },
//           () => null
//         );
//       }}
//     >
//       <img src="/compass.svg" alt="현재위치" />
//     </button>
//   );
// }

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => -3.745, lng: () => -38.523 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log(lat, lng); // 검색 위도, 경도
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div>
      <Combobox onSelect={handleSelect}>
        <Card
          // chart
          style={{
            display: "flex",
            // justifyContent: "left",
            // flexDirection: "row",
          }}
        >
          <img style={{ width: "50px" }} src={searchIcon} alt="검색창 아이콘" />
          <ComboboxInput
            className="search-bar"
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="코디를 알아보고 싶은 장소를 검색하거나 지도에 클릭한 후, 현재 날씨에 설정을 눌러주세요"
          ></ComboboxInput>
        </Card>
        <div style={{ height: "15px" }} />

        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }, index) => (
                <ComboboxOption key={index} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

function Locate({ panTo }) {
  //전역 리덕스 현재 위/경도 정보 조회
  const curreuntPosition = useSelector(
    (state) => state.weather.position,
    (currentdata, predata) => {
      console.log("위경도 정보 변경됨1==", currentdata);
    }
  );

  const dispatch = useDispatch();

  const getWeatherData = () => {
    console.log("test1-------------------", curreuntPosition);
    dispatch(getWeather(curreuntPosition));
  };

  return (
    <>
      <hr style={{ opacity: "0.2", width: "100%" }} />
      <div style={{ height: "5px" }}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // alignContent: "center",
          marginTop: "5px",
        }}
      >
        <div>
        <img
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                console.log(pos.coords.latitude, pos.coords.longitude);

                panTo({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });
              },
              () => null
            );
          }}
          src={spot}
          className="btn-hover"
          alt="현재 위치로 이동하기"
        />
        </div>

        <div
          className="btn01"
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                console.log(pos.coords.latitude, pos.coords.longitude);

                panTo({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });

                console.log("test2----------------------------------------");
              },
              () => null
            );
          }}
        >
          현재 위치로 이동하기
        </div>
        <a href="#clcikPosition">
          <img
            onClick={getWeatherData}
            src={weather}
            className="btn-hover"
            alt="현재 날씨로 코디 설정"
          />
        </a>
        <a href="#clcikPosition">
          <div className="btn01 btn02" onClick={getWeatherData}>
            현재 날씨로 코디 설정
          </div>
        </a>
      </div>

      {/* <div style={{ height: "5px" }}></div> */}

      <div
        id="clcikPosition"
        style={{
          height: "20px",
          // backgroundColor: "#ff0000",
          position: "relative",
          top: "500px",
        }}
      ></div>
    </>
  );
}
export default Mycomonent;
