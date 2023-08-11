import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('callback fn is called with right parameters when blog is created', async () => {
  const user = userEvent.setup()
  const addBlog = jest.fn()

  const { container } = render(<BlogForm addBlog={addBlog} />)

  const inputTitle = container.querySelector('#title')
  await user.type(inputTitle, 'test title')

  const inputAuthor = container.querySelector('#author')
  await user.type(inputAuthor, 'test author')

  const inputUrl = container.querySelector('#url')
  await user.type(inputUrl, 'test url')

  const createButton = container.querySelector('#createBtn')
  await user.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('test title')
  expect(addBlog.mock.calls[0][0].author).toBe('test author')
  expect(addBlog.mock.calls[0][0].url).toBe('test url')
})
