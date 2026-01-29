import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteAnswerCommentUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Answer Comment not found.')
    }

    if (authorId !== answerComment.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    await this.answerCommentsRepository.delete(answerComment)

    return {}
  }
}
