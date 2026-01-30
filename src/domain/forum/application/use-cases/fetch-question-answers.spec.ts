import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachments'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch question answers', async () => {
    const answerId = new UniqueEntityID('answer-1')
    await inMemoryAnswersRepository.create(
      makeAnswer(
        {
          attachments: new AnswerAttachmentList([
            makeAnswerAttachment({
              answerId,
              attachmentId: new UniqueEntityID('1'),
            }),
            makeAnswerAttachment({
              answerId,
              attachmentId: new UniqueEntityID('2'),
            }),
          ]),
          questionId: new UniqueEntityID('question-1'),
        },
        answerId,
      ),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    })

    const { answers } = result.value

    expect(answers).toHaveLength(3)
    expect(answers[0]?.attachments.currentItems).toHaveLength(2)
    expect(answers[0]?.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 20; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const answerId = new UniqueEntityID('answer-21')
    const answerId2 = new UniqueEntityID('answer-22')

    await inMemoryAnswersRepository.create(
      makeAnswer(
        {
          attachments: new AnswerAttachmentList([
            makeAnswerAttachment({
              answerId,
              attachmentId: new UniqueEntityID('1'),
            }),
          ]),
          questionId: new UniqueEntityID('question-1'),
        },
        answerId,
      ),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer(
        {
          attachments: new AnswerAttachmentList([
            makeAnswerAttachment({
              answerId: answerId2,
              attachmentId: new UniqueEntityID('2'),
            }),
          ]),
          questionId: new UniqueEntityID('question-1'),
        },
        answerId2,
      ),
    )

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    })

    const { answers } = result.value

    expect(answers).toHaveLength(2)
    expect(answers[0]?.attachments.currentItems).toHaveLength(1)
    expect(answers[1]?.attachments.currentItems).toHaveLength(1)
  })
})
