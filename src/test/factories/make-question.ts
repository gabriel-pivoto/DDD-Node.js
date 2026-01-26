import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(override: Partial<QuestionProps> = {}) {
  const newQuestion = Question.create({
    authorId: new UniqueEntityID(),
    content: 'Example content',
    slug: Slug.create('example-question'),
    title: 'Example Question',
    ...override,
  })

  return newQuestion
}
