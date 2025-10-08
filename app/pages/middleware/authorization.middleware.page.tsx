import { useNavigate } from "react-router";

export default function AuthorizationMiddlewarePage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-6 text-center">
        <div className="text-red-500 text-6xl font-bold">⚠️</div>
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-600">
          You are not authorized to view this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
