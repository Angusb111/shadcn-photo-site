// components/Loader.tsx
export function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="needle-wrapper">
        <img
          src="/images/diamond.svg"
          alt="Loading..."
          className="diamond-thing"
        />
      </div>
    </div>
  );
}