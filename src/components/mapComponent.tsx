"use client";
import { LatLngTuple, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Range, RangeKeyDict } from "react-date-range";
import { Station, Crime } from "@/app/types";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const LayerGroup = dynamic(
  () => import("react-leaflet").then((mod) => mod.LayerGroup),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const DateRangePicker = dynamic(
  () => import("react-date-range").then((mod) => mod.DateRangePicker),
  { ssr: false }
);

const newYorkCoordinates: LatLngTuple = [40.7128, -74.006];

interface MapComponentProps {
  crimes: Crime[];
  stations: Station[];
}

type BoroughsState = {
  BRONX: boolean;
  BROOKLYN: boolean;
  MANHATTAN: boolean;
  QUEENS: boolean;
  STATEN_ISLAND: boolean;
};

type Borough = keyof BoroughsState | "ALL";

const MapComponent = ({ crimes, stations }: MapComponentProps) => {
  const [leafletReady, setLeafletReady] = useState(false);
  const [LInstance, setLInstance] = useState<typeof import("leaflet") | null>(
    null
  );

  const [showCrimes, setShowCrimes] = useState<boolean>(false);
  const [showCrimeMenu, setShowCrimeMenu] = useState<boolean>(false);
  const [showStations, setShowStations] = useState<boolean>(false);
  const [filteredCrimes, setFilteredCrimes] = useState<Crime[]>(crimes);
  const [boroughs, setBoroughs] = useState<BoroughsState>({
    BRONX: false,
    BROOKLYN: false,
    MANHATTAN: false,
    QUEENS: false,
    STATEN_ISLAND: false,
  });
  const [selectedDateRange, setSelectedDateRange] = useState<Range>({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });
  const [offenseLevel, setOffenseLevel] = useState<string>("");

  const [mapKey, setMapKey] = useState(0);
  const [crimeIcon, setCrimeIcon] = useState<Icon | undefined>(undefined);
  const [bicycleIcon, setBicycleIcon] = useState<Icon | undefined>(undefined);
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((LModule) => {
        setLInstance(LModule);
        setLeafletReady(true);

        const crimeIconInstance = LModule.icon({
          iconUrl: "/images/enquete-criminelle.png",
          iconSize: [9, 9],
          iconAnchor: [9, 9],
          popupAnchor: [-3, -9],
        });
        setCrimeIcon(crimeIconInstance);

        const bicycleIconInstance = LModule.icon({
          iconUrl: "/images/bicycle.png",
          iconSize: [9, 9],
          iconAnchor: [9, 9],
          popupAnchor: [-3, -9],
        });
        setBicycleIcon(bicycleIconInstance);
      });
    }
  }, []);

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, [crimes, showCrimes, offenseLevel, selectedDateRange, boroughs]);

  if (!leafletReady || !LInstance) {
    return <div>Loading...</div>;
  }

  const handleToggleCrimeMenu = () => {
    setShowCrimeMenu((prevState) => !prevState);
  };

  const handleToggleCrimes = () => {
    setShowCrimes((prevState) => !prevState);
  };

  const handleToggleStations = () => {
    setShowStations((prevState) => !prevState);
  };

  const handleFilterByOffenseLevel = (level: string) => {
    setOffenseLevel(level);
    applyFilters(level, boroughs, selectedDateRange);
  };

  const handleFilterByDate = (ranges: RangeKeyDict) => {
    const selectedRange = ranges.selection as Range;
    setSelectedDateRange(selectedRange);
    applyFilters(offenseLevel, boroughs, selectedRange);
  };

  const handleToggleBorough = (borough: Borough) => {
    if (borough === "ALL") {
      setBoroughs({
        BRONX: true,
        BROOKLYN: true,
        MANHATTAN: true,
        QUEENS: true,
        STATEN_ISLAND: true,
      });
    } else {
      setBoroughs((prevBoroughs) => {
        const newBoroughs = {
          ...prevBoroughs,
          [borough]: !prevBoroughs[borough],
        };
        if (Object.values(newBoroughs).every((val) => !val)) {
          return {
            ...newBoroughs,
            BRONX: false,
            BROOKLYN: false,
            MANHATTAN: false,
            QUEENS: false,
            STATEN_ISLAND: false,
          };
        }
        applyFilters(offenseLevel, newBoroughs, selectedDateRange);
        return newBoroughs;
      });
    }
    applyFilters(offenseLevel, boroughs, selectedDateRange);
  };

  const applyFilters = (
    level: string,
    boroughs: BoroughsState,
    dateRange: Range
  ) => {
    const { startDate, endDate } = dateRange;

    const filtered = crimes.filter((crime) => {
      const matchesOffenseLevel = level
        ? crime.offenseLevel.toLowerCase() === level.toLowerCase()
        : true;

      const matchesBorough = Object.keys(boroughs).some(
        (borough) =>
          boroughs[borough as keyof BoroughsState] &&
          crime.boroughName?.toLowerCase() === borough.toLowerCase()
      );

      const matchesDate =
        startDate && endDate
          ? new Date(crime.incidentDate) >= startDate &&
            new Date(crime.incidentDate) <= endDate
          : true;

      return matchesOffenseLevel && matchesBorough && matchesDate;
    });

    setFilteredCrimes(filtered);
  };

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <div className="absolute flex flex-col top-20 left-5 bg-white p-4 shadow-lg rounded-lg z-[999]">
        <button
          onClick={handleToggleCrimeMenu}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Gérer Crimes
        </button>

        {showCrimeMenu && (
          <>
            <select
              value={offenseLevel}
              onChange={(e) => handleFilterByOffenseLevel(e.target.value)}
              className="p-2 border rounded-lg mb-4 mt-4 w-full"
            >
              <option value="">Sélectionner un niveau d&apos;infraction</option>
              <option value="Felony">Felony</option>
              <option value="Misdemeanor">Misdemeanor</option>
              <option value="Violation">Violation</option>
            </select>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleToggleBorough("ALL")}
                className={`flex-grow ${
                  Object.values(boroughs).every((val) => val)
                    ? "bg-green-500"
                    : "bg-gray-500"
                } text-white p-2 rounded-lg`}
              >
                ALL
              </button>
              {[
                "BRONX",
                "BROOKLYN",
                "MANHATTAN",
                "QUEENS",
                "STATEN_ISLAND",
              ].map((borough) => (
                <button
                  key={borough}
                  onClick={() =>
                    handleToggleBorough(borough as keyof BoroughsState)
                  }
                  className={`flex-grow ${
                    boroughs[borough as keyof BoroughsState]
                      ? "bg-green-500"
                      : "bg-gray-500"
                  } text-white p-2 rounded-lg`}
                >
                  {borough.replace("_", " ")}
                </button>
              ))}
            </div>
            <button
              onClick={handleToggleCrimes}
              className="bg-blue-500 text-white p-2 rounded-lg mb-4 w-full"
            >
              Afficher Crimes
            </button>

            <div className="w-full">
              <DateRangePicker
                ranges={[selectedDateRange]}
                onChange={handleFilterByDate}
                moveRangeOnFirstSelection={false}
                months={1}
                direction="vertical"
                className="w-full"
              />
            </div>
          </>
        )}
      </div>

      <div className="absolute flex flex-col bottom-14 left-5 bg-white p-4 shadow-lg rounded-lg z-[999]">
        <button
          onClick={handleToggleStations}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Afficher Stations de vélos
        </button>
      </div>
      <h2 className="text-3xl font-bold text-center text-blue-600 mt-6 mb-6">Carte des Crimes et Stations</h2>
      <MapContainer
        key={mapKey}
        center={newYorkCoordinates}
        zoom={12}
        style={{ height: "90%", width: "80%", margin: "auto" }}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        zoomControl={false}
        maxZoom={18}
        minZoom={12}
        maxBounds={[
          [40.4774, -74.2591],
          [40.9176, -73.7004],
        ]}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LayerGroup>
          {showCrimes &&
            filteredCrimes.map((crime) => (
              <Marker
                icon={crimeIcon}
                key={crime.id}
                position={[crime.latitude, crime.longitude]}
              >
                <Popup>
                  <div>
                    <strong>Borough:</strong> {crime.boroughName} <br />
                    <strong>Offense:</strong> {crime.offenseDescription} <br />
                    <strong>Report Date:</strong>{" "}
                    {new Date(crime.reportDate).toLocaleDateString()} <br />
                    <strong>Incident Time:</strong> {crime.incidentTime}
                  </div>
                </Popup>
              </Marker>
            ))}
        </LayerGroup>

        <LayerGroup>
          {showStations &&
            stations.map((station) => (
              <Marker
                icon={bicycleIcon}
                key={station.id}
                position={[station.latitude, station.longitude]}
              >
                <Popup>
                  <div>
                    <strong>{station.name}</strong>
                    <br />
                    Free Bikes: {station.freeBikes}
                    <br />
                    Empty Slots: {station.emptySlots}
                  </div>
                </Popup>
              </Marker>
            ))}
        </LayerGroup>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
