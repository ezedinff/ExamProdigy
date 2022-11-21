import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Explanation from "../../src/components/Explanation";
import Header from "../../src/components/Header";
import QuestionCard from "../../src/components/Question";
import useExam from "../../src/hooks/useExam";
import useQuestion from "../../src/hooks/useQuestion";

export default function Exam({ session }: any) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examTitle, setExamTitle] = useState("");
  const [answers, setAnswers] = useState<any[][]>([]);

  const { exam } = router.query;

  const { questions } = useQuestion(exam as string);
  const { exams } = useExam();

  useEffect(() => {
    if (exams) {
      const exam = exams.find((exam) => exam.slug === router.query.exam);
      setExamTitle(exam?.name || "");
    }
  }, [exams]);

  useEffect(() => {

      if (answers.length === 0) {
        const answers = localStorage.getItem("answers");
        if (answers) {
          setAnswers(JSON.parse(answers));
        }
      }

      const currentQuestion = localStorage.getItem("currentQuestion");
      if (currentQuestion) {
        setCurrentQuestion(parseInt(currentQuestion));
      }


  }, []);

  const handleNext = (
    e: React.FormEvent<EventTarget>,
    ans: string | string[]
  ) => {
    e.preventDefault();
    console.log(ans);
    const newAnswers = [...answers];
    if (newAnswers[currentQuestion]) {
      newAnswers[currentQuestion] = [ans];
    } else {
      newAnswers.push([ans]);
    }
    setAnswers(newAnswers);
    setCurrentQuestion(currentQuestion + 1);
    localStorage.setItem("answers", JSON.stringify(newAnswers));
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

  return (
    <>
      <Header title={examTitle} user={session} showTimer={false} />
      <main className="flex flex-col md:flex-row px-4 md:px-10 my-4 md:pt-24 md:gap-32">
        {questions && questions.length > 0 && (
          <>
            <div className="flex flex-1 flex-grow-1 flex-col md:justify-center md:self-start my-4">
              <QuestionCard
                key={questions[currentQuestion].id}
                totalQuestions={questions.length}
                index={currentQuestion}
                question={questions[currentQuestion]}
                nextCallback={handleNext}
                previousCallback={handlePrevious} answers={answers[currentQuestion] ? (answers[currentQuestion].length > 0 ? answers[currentQuestion][0] : []) : []}
              />
            </div>

            <div className="flex flex-co md:justify-center md:self-start my-4 flex-shrink-0 md:w-1/3">
              <Explanation
                explanations={questions[currentQuestion].explanation || []}
                resources={questions[currentQuestion].resources || []}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}
