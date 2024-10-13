import Image from "next/image";

export const Loading = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-gray-50">
      <Image
        src="/logo.svg"
        alt="Boardy Logo"
        width={120}
        height={120}
        className="animate-pulse"
      />
      <h3 className="mt-4 text-lg font-semibold text-gray-700">
        Welcome to <span className="text-orange-500">Boardy</span>
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        "Capture Ideas & Stay Organized"
      </p>
    </div>
  );
};
