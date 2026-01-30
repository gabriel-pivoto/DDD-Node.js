import { UseCaseError } from '@/core/errors/user-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}
