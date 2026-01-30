import { UseCaseError } from '@/core/errors/user-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}
