import { useEffect, useState } from "react";
import { mdToHtml } from "../../lib/mdToHtml";

type ExplanationProps = {
  explanations: string[];
  resources: string[];
  showExplanation: boolean;
};

const Explanation: React.FC<ExplanationProps> = ({
  explanations,
  resources,
  showExplanation,
}) => {
  const [tab, setTab] = useState("explanation");
  const [contents, setContents] = useState<string[]>([]);

  useEffect(() => {
    if (explanations.length > 0) {
      const temps: string[] = []
      explanations.forEach( async (explanation) => {
        const t = await mdToHtml(explanation);
        temps.push(t);
      });
      setContents(temps);
    } else {
      setContents([]);
    }
  }, [explanations]);


  return (
    <div className="flex flex-col flex-1 flex-grow-1 justify-center w-full justify-self-center px-4">
      <div className="flex flex-row justify-center items-center">
        <button
          className={`${
            tab === "explanation"
              ? "bg-gray-300 text-gray-700"
              : "bg-gray-700 text-white"
          } flex-1 py-2 px-4 rounded-l`}
          onClick={() => setTab("explanation")}
        >
          Explanation
        </button>
        <button
          className={`${
            tab === "resources"
              ? "bg-gray-300 text-gray-700"
              : "bg-gray-700 text-white"
          } flex-1 py-2 px-4 rounded-r`}
          onClick={() => setTab("resources")}
        >
          Resources
        </button>
      </div>
        {
          showExplanation && (
            <div className="flex flex-col w-full p-4 md:px-2 justify-center rounded-md shadow-md">
            {tab === "explanation" ? (
              <div className="flex flex-col">
                {
                  contents.map((content, index) => (
                    <div key={content} className="text-gray-400 text-md" dangerouslySetInnerHTML={{ __html: content }}></div>
                  ))
                }
              </div>
            ) : (
              <div className="flex flex-col">
                {resources.map((resource) => (
                  <a
                    key={resource}
                    href={resource}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 text-lg"
                  >
                    {resource}
                  </a>
                ))}
              </div>
            )}
          </div>
          )
        }
    </div>
  );
};

export default Explanation;
