import { Slug } from '@/domain/entities/value-objects/slug'

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('This is a slug')
  expect(slug.value).toBe('this-is-a-slug')
})
