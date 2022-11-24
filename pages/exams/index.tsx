import Link from "next/link";
import { Exam } from "../../lib/types";
import { Footer } from "../../src/components/Footer";
import Header from "../../src/components/Header";
import useExam from "../../src/hooks/useExam";

export default function Exams({ session }: any) {
  const { exams } = useExam();
  return (
    <>
      <Header title="Exams" user={session} showTimer={false} />
      <main className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-8 min-h-screen">
        {exams &&
          exams.map((exam: Exam) => <ExamCard key={exam.id} exam={exam} />)}
      </main>
      <Footer/>
    </>
  );
}

// ExamCard.tsx
// exam, has name, thumbnail, slug, provider
// import { Exam } from "../../types";

type ExamCardProps = {
  exam: Exam;
};

const ExamCardImage: React.FC<ExamCardProps> = ({ exam }) => {
  return (
    <div className="flex justify-center items-center h-64 rounded-md pt-8">
      <img
        className="w-3/4 object-cover rounded-md"
        src={exam.thumbnail}
        loading="lazy"
        alt={exam.name}
      />
    </div>
  );
};

const ExamCardInfo: React.FC<ExamCardProps> = ({ exam }) => {
  return (
    <div className="flex flex-col w-full p-4">
      <h1 className="text-xl font-bold text-gray-300">{exam.name}</h1>
        <p className="text-gray-400 text-sm text-clip">{exam?.description}</p>
    </div>
  );
};

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  return (
    <Link href={`/exams/${exam.slug}`}>
      <div className="flex flex-col max-w-sm mx-4 my-4 justify-center items-center  gap-4 rounded-lg border-2 border-gray-700 shadow-md hover:shadow-lg cursor-pointer hover:border-gray-400">
        <ExamCardImage exam={exam} />
        <ExamCardInfo exam={exam} />
      </div>
    </Link>
  );
};
