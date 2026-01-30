import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachments'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answerId = new UniqueEntityID('answer-1')
    const answer = makeAnswer(
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
      },
      answerId,
    )

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comentário teste',
    })

    if (result.value instanceof Error) {
      throw result.value
    }

    const { answerComment } = result.value

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(1)

    const comment = inMemoryAnswerCommentsRepository.items[0]

    expect(comment).toBeDefined()
    expect(comment!.content).toEqual('Comentário teste')
    expect(answerComment.content).toEqual('Comentário teste')
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
})
