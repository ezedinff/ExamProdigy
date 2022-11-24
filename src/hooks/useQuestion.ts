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


const nextQuestionQuery = (examId: string, skip: number) => gql`
    query Questions {
        questions(skip: ${skip}, first: 1, where: {exam: {slug: "${examId}"}}) {
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


const getTotalQuestionsQuery = (examId: string) => gql`
    query Questions {
        questionsConnection(where: {exam: {slug: "${examId}"}}) {
            aggregate {
                count
            }
        }
    }
`;

const useGetTotalQuestions = (examId: string) => {
    const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
    const [totalQuestionsError, setTotalQuestionsError] = useState<Error | null>(null);
    const [totalQuestionsLoading, setTotalQuestionsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getTotalQuestions = async (examId: string) => {
            try {
                const {questionsConnection} = await hygraphClient.request(getTotalQuestionsQuery(examId));
                setTotalQuestions(questionsConnection.aggregate.count);
            } catch (error) {
                setTotalQuestionsError(error as Error);
            } finally {
                setTotalQuestionsLoading(false);
            }
        };

        getTotalQuestions(examId);
    }, [examId]);

    return {totalQuestions, totalQuestionsError, totalQuestionsLoading};
};


const useGetNextQuestion = (examId: string, currentQuestion: number) => {
    const [nextQuestion, setNextQuestion] = useState<Question | null>(null);
    const [nextQuestionError, setNextQuestionError] = useState<Error | null>(null);
    const [nextQuestionLoading, setNextQuestionLoading] = useState<boolean>(true);

    useEffect(() => {
        const getNextQuestion = async (examId: string, skip: number) => {
            try {
                const {questions} = await hygraphClient.request(nextQuestionQuery(examId, skip));
                setNextQuestion(questions[0]);
            } catch (error) {
                setNextQuestionError(error as Error);
            } finally {
                setNextQuestionLoading(false);
            }
        };

        getNextQuestion(examId, currentQuestion);
    }, [examId, currentQuestion]);

    return {nextQuestion, nextQuestionError, nextQuestionLoading};
}


export {
    useQuestions,
    useGetTotalQuestions,
    useGetNextQuestion
}