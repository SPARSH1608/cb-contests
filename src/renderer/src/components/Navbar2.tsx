import { Link } from "react-router-dom";

export default function NavBar(): JSX.Element {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="text-lg font-bold">My Electron App</div>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/contests/6" className="hover:underline">Contest 6</Link>
        <Link to="/contests/6/attempt/3" className="hover:underline">Attempt 2</Link>
      </div>
    </nav>
  );
}
