export default function WeatherCard({ data }: { data: any }) {
  return (
    <div className="border rounded p-4 bg-blue-50">
      <h3 className="font-semibold">Weather in {data.city}</h3>
      <p>🌡 {data.temperature}</p>
      <p>☀️ {data.condition}</p>
    </div>
  );
}
