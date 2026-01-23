import { expect, test } from "vitest"
import { Answer } from "../entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { AnswerQuestionUseCase } from "./answer-question"

class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }
}

test("create an answer", async () => {
  const answersRepository = new InMemoryAnswersRepository()
  const answerQuestion = new AnswerQuestionUseCase(answersRepository)

  const answer = await answerQuestion.execute({
    questionId: "1",
    instructorId: "1",
    content: "Nova resposta",
  })

  expect(answer.content).toEqual("Nova resposta")
  expect(answersRepository.items[0]).toEqual(answer)
})
