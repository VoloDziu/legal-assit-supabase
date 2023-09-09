import { ScaleLoader } from "react-spinners";

export function LoadingView() {
  return (
    <div className="h-screen w-screen flex items-center justify-center px-12">
      <ScaleLoader color="#1e40af" />
    </div>
  );
}
