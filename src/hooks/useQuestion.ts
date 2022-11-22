import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import hygraphClient from "../../lib/hygraphClient";
import { Question } from "../../lib/types";

const questionsQuery = (examId: string) => gql`
    query Questions {
        questions(last: 500, where: {exam: {slug: "${examId}"}}) {
            answers
            createdAt
            explanation
            id
            options
            publishedAt
            question
            resources
            topics
            updatedAt
        }
    }
`;

const useQuestions = (exam: string) => {
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [examError, setExamError] = useState<Error | null>(null);
    const [examLoading, setExamLoading] = useState<boolean>(true);

    useEffect(() => {
        const getQuestions = async (examId: string) => {
            try {
                const {questions} = await hygraphClient.request(questionsQuery(examId));
                setQuestions(questions);
            } catch (error) {
                setExamError(error as Error);
            } finally {
                setExamLoading(false);
            }
        };

        getQuestions(exam);
    }, [exam]);

    return {questions, examError, examLoading};
};


export default useQuestions;