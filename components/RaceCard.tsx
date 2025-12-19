export default function RaceCard({ data }: { data: any }) {
  return (
    <div className="border rounded p-4 bg-gray-100">
      <h3 className="font-semibold">{data.race}</h3>
      <p>Winner: {data.winner}</p>
      <p>Team: {data.team}</p>
    </div>
  );
}
