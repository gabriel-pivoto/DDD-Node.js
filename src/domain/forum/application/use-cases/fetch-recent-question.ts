import { Either, right } from '@/core/either'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  never,
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}
