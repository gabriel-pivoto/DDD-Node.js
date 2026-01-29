import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      throw new Error('Question Comment not found.')
    }

    if (authorId !== questionComment.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    await this.questionCommentsRepository.delete(questionComment)

    return {}
  }
}
