import {
  CloudSun,
  Thermometer,
  Wind,
} from "lucide-react";

function WeatherWidget() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-xl font-bold">
            Weather
          </h2>

          <p className="text-gray-500 mt-1">
            Gaborone
          </p>

        </div>

        <CloudSun
          size={42}
          className="text-yellow-500"
        />

      </div>

      <div className="mt-8">

        <h1 className="text-5xl font-bold">
          24°C
        </h1>

        <p className="text-gray-500 mt-2">
          Sunny
        </p>

      </div>

      <div className="flex justify-between mt-8">

        <div className="text-center">

          <Thermometer
            className="mx-auto text-red-500"
          />

          <p className="text-sm mt-2">
            Feels 26°
          </p>

        </div>

        <div className="text-center">

          <Wind
            className="mx-auto text-blue-500"
          />

          <p className="text-sm mt-2">
            18 km/h
          </p>

        </div>

      </div>

    </div>
  );
}

export default WeatherWidget;