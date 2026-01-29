import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to create a answer', async () => {
    const { answer } = await sut.execute({
      content: 'Conteúdo da resposta',
      instructorId: '1',
      questionId: '1',
    })

    expect(answer.id).toBeTruthy()
    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    const createdAnswer = inMemoryAnswersRepository.items[0]!

    expect(createdAnswer.id).toEqual(answer.id)
  })
})
