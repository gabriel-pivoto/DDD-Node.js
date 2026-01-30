import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachments'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit a answer', async () => {
    const answerId = new UniqueEntityID('answer-1')
    const newAnswer = makeAnswer(
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
        authorId: new UniqueEntityID('author-1'),
      },
      answerId,
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-1',
      content: 'Conte??do teste',
      title: 'Titulo teste',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Conte??do teste',
    })
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should not be able to edit a answer from another user', async () => {
    const answerId = new UniqueEntityID('answer-1')
    const newAnswer = makeAnswer(
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
        authorId: new UniqueEntityID('author-1'),
      },
      answerId,
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: 'author-2',
      content: 'Conte??do teste',
      title: 'Titulo teste',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2)
  })
})
