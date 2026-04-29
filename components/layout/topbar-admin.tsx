export default function TopBarAdmin() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <header className="h-12 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-2 md:px-8 sticky top-0 z-20">
      {" "}
      <div className="hidden sm:flex items-center text-sm text-slate-500">
        {" "}
        <span className="font-medium">Hari ini:</span>{" "}
        <span className="ml-2 bg-slate-100 px-3 py-1 rounded text-slate-700 font-bold capitalize">
          {" "}
          {formattedDate}{" "}
        </span>{" "}
      </div>{" "}
      <div className="flex justify-items-end sm:flex sm:items-center gap-4">
        {" "}
        <a
          href="/"
          className="text-sm font-bold cursor-pointer text-purple-600 hover:bg-purple-100 bg-purple-50 px-4 py-1 rounded-lg transition-colors"
        >
          {" "}
          Lihat Web Publik &rarr;{" "}
        </a>{" "}
      </div>{" "}
    </header>
  );
}
