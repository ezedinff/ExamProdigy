
import { useEffect, useState } from 'react';
import { getUserAnswers, saveAnswers } from '../../lib/services';
import { Answer } from '../../lib/types';

const useAnswers = (session: any, examId: string) => {
    const [answers, setAnswers] = useState<Answer[]>([]);
    
    const addAnswer = async (answer: Answer) => {
        setAnswers([...answers, answer]);
        await saveAnswers(session, answer.answers, examId, answer.question_id);
    };


    useEffect(() => {
        const getAnswers = async (s: any, e: string) => {
            const answers = await getUserAnswers(s, e);
            if (typeof answers !== 'boolean') {
                setAnswers(answers);
            }
        };
        getAnswers(session, examId);
    }, [session, examId]);

    
    return { answers, addAnswer };
}

export default useAnswers;