import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { Answer } from "../../lib/types";
import Explanation from "../../src/components/Explanation";
import { Footer } from "../../src/components/Footer";
import Header from "../../src/components/Header";
import QuestionCard from "../../src/components/Question";
import useAnswers from "../../src/hooks/useAnswers";
import useExam from "../../src/hooks/useExam";
import {
  useGetNextQuestion,
  useGetTotalQuestions,
} from "../../src/hooks/useQuestion";

export default function Exam({ session }: any) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examTitle, setExamTitle] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const { answers, addAnswer } = useAnswers(
    session,
    router.query.exam as string
  );

  const { exam } = router.query;
  const { exams } = useExam();
  const { nextQuestion, nextQuestionLoading, nextQuestionError } =
    useGetNextQuestion(exam as string, currentQuestion);
  const { totalQuestions } = useGetTotalQuestions(exam as string);

  useEffect(() => {
    if (exams) {
      const exam = exams.find((exam) => exam.slug === router.query.exam);
      setExamTitle(exam?.name || "");
    }
  }, [exams]);

  useEffect(() => {
    // if (answers.length === 0) {
    //   const answers = localStorage.getItem("answers");
    //   if (answers) {
    //     setAnswers(JSON.parse(answers));
    //   }
    // }

    const currentQuestion = localStorage.getItem("currentQuestion");
    if (currentQuestion) {
      setCurrentQuestion(parseInt(currentQuestion));
    }
  }, []);

  const handleNext = (e: React.FormEvent<EventTarget>, ans: string[]) => {
    e.preventDefault();
    console.log(ans);
    if (nextQuestion) {
      const answer: Answer = {
        user_id: session.user.id,
        question_id: nextQuestion.id,
        exam_id: exam as string,
        answers: ans,
      };
      addAnswer(answer);
    }
    setCurrentQuestion(currentQuestion + 1);
    localStorage.setItem("currentQuestion", (currentQuestion + 1).toString());
  };

  const handlePrevious = (
    e: React.FormEvent<EventTarget>,
    ans: string | string[]
  ) => {
    e.preventDefault();
    console.log(ans);
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleShowExplanation = () => {
    setShowExplanation(true);
  };

  return (
    <>
      <Header title={examTitle} user={session} showTimer={false} />
      <main className="flex flex-col md:flex-row px-4 md:px-10 my-4 md:pt-24 md:gap-32 min-h-screen">
        {nextQuestionLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <div className="loader"></div>
          </div>
        ) : nextQuestionError ? (
          <div className="flex justify-center items-center w-full h-full">
            <h1 className="text-2xl font-bold text-gray-600 border-1 border-teal-500 p-4 rounded-md">
              Go back and open the exam again
            </h1>
          </div>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            {nextQuestion && totalQuestions && (
              <>
                <div className="flex flex-1 flex-grow-1 flex-col md:justify-center md:self-start my-4">
                  <QuestionCard
                    key={nextQuestion.id}
                    totalQuestions={totalQuestions}
                    showExplanation={handleShowExplanation}
                    index={currentQuestion}
                    question={nextQuestion}
                    nextCallback={handleNext}
                    previousCallback={handlePrevious}
                    answers={
                      answers.find((ans) => ans.question_id === nextQuestion.id)
                        ?.answers || []
                    }
                  />
                </div>

                <div className="flex flex-co md:justify-center md:self-start my-4 flex-shrink-0 md:w-1/3">
                  <Explanation
                    showExplanation={showExplanation}
                    explanations={nextQuestion.explanation || []}
                    resources={nextQuestion.resources || []}
                  />
                </div>
              </>
            )}
          </Suspense>
        )}
      </main>
      <Footer />
    </>
  );
}

const LoadingComponent = () => {
  // create spinner
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};
