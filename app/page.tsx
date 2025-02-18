
export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold">
        Available Wallets:
      </h1>
      <div className="flex flex-col">
        {Array.from({ length: 10 }).map((_, i) => (
          <button key={i} className="btn btn-primary m-2">
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
}
