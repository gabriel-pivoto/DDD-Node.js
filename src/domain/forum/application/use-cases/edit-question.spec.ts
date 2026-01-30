import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { makeQuestion } from '@/test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: 'author-1',
      content: 'Conteúdo teste',
      questionId: newQuestion.id.toValue(),
      title: 'Pergunta teste',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: 'Conteúdo teste',
      title: 'Pergunta teste',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      content: 'Conteúdo teste',
      questionId: newQuestion.id.toValue(),
      title: 'Pergunta teste',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
