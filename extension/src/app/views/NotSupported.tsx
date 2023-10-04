export function NotSupportedView() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center px-12 text-center">
      <div className="mb-4 text-2xl font-semibold text-slate-500">
        Not supported
      </div>

      <div className="mb-4">
        To use LegalAssist
        <br />
        please visit one of the supported portals
      </div>
    </div>
  );
}
