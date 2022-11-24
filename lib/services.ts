import supabase from "./supabaseClient";
import { Answer } from "./types";

export const saveAnswers = async (
  session: any,
  answers: string[],
  examId: string,
  question_id: string
): Promise<boolean> => {
  const { data, error } = await supabase.from("user_answers").insert([
    {
      user_id: session.user.id,
      exam_id: examId,
      question_id,
      answers: answers.join("_|_"),
    },
  ]);
  if (error) {
    return false;
  }
  if (data) {
    return true;
  }
  return false;
};

export const getUserAnswers = async (session: any, examId: string): Promise<Answer[] | boolean> => {
  const { data, error } = await supabase
    .from("user_answers")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("exam_id", examId);
  if (error) {
    return false;
  }
  if (data && data.length > 0) {
    return data.map((answer) => {
        return {
            id: answer.id,
            exam_id: answer.exam_id,
            question_id: answer.question_id,
            user_id: answer.user_id,
            answers: answer.answers.split("_|_")
        };
    });
  }
    return false;
};
