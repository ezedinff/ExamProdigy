import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import hygraphClient from "../../lib/hygraphClient";
import { Exam } from "../../lib/types";

const examsQuery = gql`
    query Exams {
        exams {
            id
            name
            slug
            thumbnail
            provider
            description
        }
    }
`;


const useExam = () => {
    const [exams, setExams] = useState<Exam[] | null>(null);
    const [examError, setExamError] = useState<Error | null>(null);
    const [examLoading, setExamLoading] = useState<boolean>(true);

    useEffect(() => {
        const getExams = async () => {
            try {
                const {exams} = await hygraphClient.request(examsQuery);
                setExams(exams);
            } catch (error) {
                setExamError(error as Error);
            } finally {
                setExamLoading(false);
            }
        };

        getExams();
    }, []);

    return {exams, examError, examLoading};
}

export default useExam;