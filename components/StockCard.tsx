export default function StockCard({ data }: { data: any }) {
  return (
    <div className="border rounded p-4 bg-green-50">
      <h3 className="font-semibold">{data.symbol} Stock</h3>
      <p>Price: {data.price}$</p>
      <p>Change: {data.change}</p>
    </div>
  );
}
