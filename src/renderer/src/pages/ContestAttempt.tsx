import { useParams, useNavigate } from "react-router-dom";
import useCurrentContestAttempt from "../hooks/contestAttempts/useCurrentAttempt";
import useSession2 from "../hooks/useSession2";
import useContestById from "../hooks/contests/useContestById";
import useContentById from "../hooks/useContentById";
import QuizView from "../components/QuizView";
import useSolutionStubByProblemId from "../hooks/useSolutionStubByProblemId";
import Split from "react-split";
import ProblemStatementPane from "../components/ProblemStatementPane";
import ProblemEditorPane from "../components/ProblemEditorPane";
import useSubmitContestAttempt from "../hooks/contentAttempts/useSubmitContestAttempt";
import Button from "../components/Button";
import { useTimer } from "react-timer-hook";
import Timer from "../components/Timer";
import { parseISO } from "date-fns";
import { useEffect } from "react";
import ProblemLoader from "../components/ProblemLoader";

export default function ContestAttemptPage() {
  const { contestId, contentId } = useParams(); // Replaces `router.query`
  const navigate = useNavigate(); // Replaces `router.push()`

  const { status: sessionStatus } = useSession2();
  console.log("SessionStatus", sessionStatus);
console.log("contentId", contentId);
console.log("contestId", contestId);
  const contestByIdQuery = useContestById(
    contestId || "",
    {
      include: ["l~contents"],
      sort: "+model_contents.order",
    },
    { enabled: !!contestId } 
  );
console.log("contestByIdQuery", contestByIdQuery);

  const currentAttemptQuery = contestId
    ? useCurrentContestAttempt(contestId, {
        enabled: sessionStatus === "AUTHENTICATED",
      })
    : { isLoading: true, isIdle: true, isError: false, data: null };

  const contentByIdQuery = contentId
    ? useContentById(
        contentId,
        {
          include: ["l~problem", "l~quiz", "l~createdBy", "l~contentTags"],
          contest_id: contestId,
        },
        { enabled: true }
      )
    : { isLoading: true, isIdle: true, isError: false, data: null };

  const solutionStubQuery = useSolutionStubByProblemId(
    contentByIdQuery?.data?.problem?.id as number,
    {
      enabled: !!contentByIdQuery?.data?.problem?.id,
    }
  );

  const contestAttemptMutation = useSubmitContestAttempt(
    currentAttemptQuery.data?.id as string
  );

  useEffect(() => {
    if (contestAttemptMutation.isSuccess) {
      navigate(`/contests/${contestId}`);
    }
  }, [contestAttemptMutation]);

  if (
    contestByIdQuery.isLoading ||
    contestByIdQuery.isIdle ||
    contestByIdQuery.isError ||
    currentAttemptQuery.isLoading ||
    currentAttemptQuery.isIdle ||
    currentAttemptQuery.isError
  ) {
    return <ProblemLoader fullscreen={true} />;
  }

  if (sessionStatus === "UNAUTHENTICATED" || currentAttemptQuery.data === null) {
    navigate(`/contests/${contestId}`);
    return null;
  }

  const contest = contestByIdQuery.data;
  const content = contentByIdQuery.data;

  return (
    <div>
      <div className="bg-dark-1 p-5 border-b border-dark-0">
        <div className="flex justify-between">
          <h1 className="text-white font-bold text-2xl">{contest?.name || "Contest"}</h1>
          <div className="flex items-center">
            <div className="text-primary mr-3">
              <Timer
                endTime={parseISO(currentAttemptQuery.data?.["end-time"] as string)}
                onTimerEnd={() =>
                  contestAttemptMutation.mutate(currentAttemptQuery.data?.id as string)
                }
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                contestAttemptMutation.mutate(currentAttemptQuery.data?.id as string)
              }
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-[90px] h-[calc(100vh-75px)] overflow-scroll">
          {contest?.contents?.map((content, index) => (
            <button
              key={content.id}
              className={`h-[45px] text-white text-xl block m-auto ${
                contentId == content.id ? "text-primary" : ""
              }`}
              onClick={() => navigate(`/contests/${contestId}/attempt/${content.id}`)}
            >
              &lt;/&gt; {index + 1}
            </button>
          ))}
        </div>
        <div className="h-[calc(100vh-75px)] w-[calc(100vw-90px)] bg-dark-3">
          {"isFetching" in contentByIdQuery && (contentByIdQuery.isLoading || contentByIdQuery.isFetching) ? (
            <ProblemLoader fullscreen={true} />
          ) : content && content.type === "quiz" ? (
            <QuizView
              quizId={content.quiz?.id as string}
              contentId={contentId || ""}
              contestId={contestId || ""}
            />
          ) : content && content.type === "problem" && solutionStubQuery.data ? (
            <Split minSize={450} className="split h-full w-full" id="problem-split">
              <ProblemStatementPane data={content} fullScreen={true} />
              <div style={{ width: "calc(50% - 5px)", height: "100%" }}>
                <ProblemEditorPane
                  key={content.id}
                  content={content}
                  solutionStub={solutionStubQuery.data}
                  fullScreen={true}
                  contest={contest || undefined}
                />
              </div>
            </Split>
          ) : null}
        </div>
      </div>
    </div>
  );
}
