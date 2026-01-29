import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

interface CommentOnQuestionUseCaseResponse {
  questionComment: QuestionComment
}
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    content,
    questionId,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      content,
      questionId: new UniqueEntityID(questionId),
    })

    await this.questionCommentsRepository.create(questionComment)
    return {
      questionComment,
    }
  }
}
