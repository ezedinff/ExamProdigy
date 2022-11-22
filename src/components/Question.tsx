import React, { useEffect } from "react";
import { useState } from "react";
import { Question } from "../../lib/types";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


type QuestionOptionProps = {
  isMultiple: boolean;
  option: string;
  index: number;
  selected: boolean;
  onSelect: (ans: string) => void;
};

const QuestionOption: React.FC<QuestionOptionProps> = React.memo(
  ({ option, index, selected, onSelect, isMultiple }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
      onSelect(option);
    };

    return (
      <li
        className={
          "flex space-x-2 p-2 border-2 text-gray-300 border-gray-300 rounded-md cursor-pointer my-2 " +
          (selected ? "border-teal-500" : "")
        }
        onClick={handleClick}
      >
        <input
          className="hidden"
          type={isMultiple ? "checkbox" : "radio"}
          name="option"
          id={`option-${index}`}
          checked={selected}
          onChange={handleClick}
          ref={inputRef}
        />
        <span
          className={
            "inline-block w-6 h-6 text-center rounded-md " +
            (selected ? "bg-teal-500 text-white bold" : "")
          }
        >
          {alphabet[index]}
        </span>
        <label className="ml-2" htmlFor={`option-${index}`}>
          {option}
        </label>
      </li>
    );
  }
);

QuestionOption.displayName = "QuestionOption";

interface QuestionProps {
  index: number;
  question: Question;
  totalQuestions: number;
  answers: string[];
  previousCallback: (
    e: React.FormEvent<EventTarget>,
    ans: string[]
  ) => void;
  nextCallback: (
    e: React.FormEvent<EventTarget>,
    ans: string[]
  ) => void;
  showExplanation: () => void;
}

const QuestionCard: React.FC<QuestionProps> = ({
  index,
  question,
  answers,
  totalQuestions,
  previousCallback,
  nextCallback,
  showExplanation,
}) => {
  const [selectedAns, setSelectedAns] = useState<string[]>([]);

  const handleSelect = (ans: string) => {
    if (question.answers.length === 1) {
      setSelectedAns([ans]);
    } else {
      if (selectedAns.includes(ans)) {
        setSelectedAns(selectedAns.filter((a) => a !== ans));
      } else {
        if (selectedAns.length < question.answers.length) {
          setSelectedAns([...selectedAns, ans]);
        }
      }
    }
  };

  const showAnswers = () => {
    showExplanation();
    setSelectedAns(question.answers.map(ans => ans.trim()));
  };

  useEffect(() => {
    setSelectedAns([]);
  }, [index]);

  useEffect(() => {
    if ( selectedAns.length === 0 && answers.length > 0) {
      console.log(answers);
      setSelectedAns(answers);
    }
  }, [selectedAns, answers]);

  return (
    <div className="flex flex-col p-4 md:px-8 md:w-full md:mx-8 self-start justify-center border-dashed border-2 border-gray-300 rounded-md shadow-md">
      <div className="flex justify-between">
        <button
          className="border-2 border-teal-500 text-white font-bold py-2 px-4 rounded disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={index === 0}
          onClick={(e) => previousCallback(e, selectedAns)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex justify-self-end gap-4 md:gap-8 items-center">
          <h1 className="text-gray-400 font-bold hidden md:block">{`About ${totalQuestions - index} questions to go`}</h1>
          <h1 className="text-gray-400 font-bold md:hidden">{`${index + 1} of ${totalQuestions}`}</h1>
          <button
            className="border border-gray-400 text-gray-400 text-sm py-1 px-2 rounded ml-auto hover:border-teal-500 hover:text-teal-500 animate-pulse"
            onClick={() => showAnswers()}
          >
            Show
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center pt-8 flex-wrap text-gray-300">
        <span className="text-2xl font-bold px-2">{index + 1}.</span>
        <h2 className="text-xl ">{question.question}</h2>
      </div>
      <ul className="list-none md:px-4 my-4">
        {question.options.map(op => op.trim()).map((option, index) => (
          <QuestionOption
            key={index}
            option={option}
            index={index}
            isMultiple={question.answers.length > 1}
            onSelect={handleSelect}
            selected={selectedAns.includes(option)}
          />
        ))}
      </ul>
      <div className="flex flex-row justify-end w-full">
        <button
          className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-500"
          disabled={selectedAns.length === 0 || totalQuestions === index + 1}
          onClick={(e) => nextCallback(e, selectedAns)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

QuestionCard.displayName = "QuestionCard";

export default QuestionCard;
