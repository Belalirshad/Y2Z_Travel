import React, { useState } from "react";
import ItineraryList from "./Card";

const Dashboard = () => {
  const [mapUrl, setMapUrl] = useState(
    "https://www.google.com/maps/embed?..." // Default map URL
  );

  const handleLocationClick = (coordinates) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${coordinates}&output=embed`;
    setMapUrl(googleMapsUrl);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/2 overflow-y-auto p-4 bg-white">
        <h1 className="text-left text-2xl mb-7" style={{ color: "#FF0080" }}>
          Y2Z Travel
        </h1>
        <h1 className="text-4xl font-bold text-left mb-3">Itinerary</h1>
        <h2 className="text-left text-gray-500 mb-6">Day</h2>

        <ItineraryList onLocationClick={handleLocationClick} />
      </div>

      {/* Right Side: Map */}
      <div className="hidden lg:block lg:w-1/2">
        <iframe
          src={mapUrl}
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Dashboard;
