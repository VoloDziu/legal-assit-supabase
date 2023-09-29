export function Layout() {
  return (
    <div className="w-[600px] h-[400px] flex flex-col">
      <div className="flex-shrink-0 items-stretch bg-muted p-2">
        Here is header
      </div>
      <div className="flex-grow items-stretch"></div>
    </div>
  );
}
