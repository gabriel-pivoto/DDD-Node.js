import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>
export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      answerId: new UniqueEntityID(answerId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)
    return right({
      answerComment,
    })
  }
}
