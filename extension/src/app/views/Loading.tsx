import { ScaleLoader } from "react-spinners";

export function LoadingView() {
  return (
    <div className="flex h-screen w-screen items-center justify-center px-12">
      <ScaleLoader color="#1e40af" />
    </div>
  );
}
