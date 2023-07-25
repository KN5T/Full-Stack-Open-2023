import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  beforeEach(() => {
    blog = {
      title: 'this is a test blog',
      author: 'unknwon',
      url: 'https://fullstackopen.com/osa5/react_sovellusten_testaaminen#tehtavat-5-13-5-16',
      likes: 2,
      user: {
        name: 'Konsta J'
      }
    }
  })


  test('renders title', () => {
    render(<Blog blog={blog} />)
    const element = screen.getByText('this is a test blog', { exact: false })

    expect(element).toBeDefined()
  })

  test('when view button is cliked component renders url, likes and user', async () => {
    const user = userEvent.setup()
    render(<Blog blog={blog} />)

    const button = screen.getByText('view')

    await user.click(button)

    screen.getByText('likes', { exact: false })
    screen.getByText('https://fullstackopen.com/osa5/react_sovellusten_testaaminen#tehtavat-5-13-5-16')
    screen.getByText('Konsta J')

  })

  test('like button calls eventHandler 2 times when button is clicked 2 times', async () => {
    const user = userEvent.setup()
    const updateBlog = jest.fn()

    const { container } = render(<Blog blog={blog} updateBlog={updateBlog} />)

    const viewBtn = screen.getByText('view')
    await user.click(viewBtn)

    const likeBtn = container.querySelector('#likeButton')
    await user.click(likeBtn)
    await user.click(likeBtn)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
