import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ContestPage() {
  const { contestId } = useParams(); // Replaces `router.query.id`
  const [currentContestId, setCurrentContestId] = useState<string | null>(null);

  useEffect(() => {
    if (contestId) {
      setCurrentContestId(contestId);
    }
  }, [contestId]);

  if (!currentContestId) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Contest Page</h1>
      <p>Contest ID: {currentContestId}</p>
      <Link to={`/contests/${currentContestId}/attempt/1`} className="text-blue-500 underline">
        Go to Attempt 1
      </Link>
    </div>
  );
}
