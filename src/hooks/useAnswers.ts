
import { useEffect, useState } from 'react';
import { getUserAnswers, saveAnswers } from '../../lib/services';
import { Answer } from '../../lib/types';

const useAnswers = (session: any, examId: string) => {
    const [answers, setAnswers] = useState<Answer[]>([]);
    
    const addAnswer = async (answer: Answer) => {
        const answersAreSame = (a: string[], b: string[]) => {
            if (a.length !== b.length) return false;
            return a.every((v, i) => v === b[i]);
        };
        
        const index = answers.findIndex((a) => a.question_id === answer.question_id && answersAreSame(a.answers, answer.answers));

        if (index === -1) {
            setAnswers([...answers, answer]);
            await saveAnswers(session, answer.answers, examId, answer.question_id);
        }
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