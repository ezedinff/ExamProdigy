export type Question = {
    id: string;
    question: string;
    answers: string[];
    options: string[];
    explanation?: string[];
    resources?: string[];
    tags: string[];
}

export type Exam = {
    id: string;
    name: string;
    slug: string;
    provider: string;
    thumbnail: string;
    description: string;
}

export type Answer = {
  id?: string;
  question_id: string;
  exam_id: string;
  user_id: string;
  answers: string[];
}


/*
quiz database schema

{
  "questions": [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "options": [
        "Paris",
        "London",
        "Berlin",
        "Madrid"
      ],
      "answer": "Paris"
      "explanation": "Paris is the capital of France",
      "tags": []
    },
  ],
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "",
    }
  ],
  "results": [
    {
      "id": 1,
      "user_id": 1,
      "last_question": 1,
      "answers": [
        {
          "question_id": 1,
          "answer": "Paris",
          "time_taken": 10,
          "correct": true,
        }
      ],
    }
  ]
}
*/