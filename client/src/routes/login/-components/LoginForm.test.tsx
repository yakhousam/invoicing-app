import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

function LoginForm() {
  return (
    <form>
      <label>
        Username
        <input type="text" name="username" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}

test('LoginForm', () => {
  const { getByRole, getByLabelText } = render(<LoginForm />)
  const username = getByLabelText('Username')
  const password = getByLabelText('Password')
  const submit = getByRole('button', { name: 'Submit' })

  expect(username).toHaveAttribute('type', 'text')
  expect(password).toHaveAttribute('type', 'password')
  expect(submit).toHaveAttribute('type', 'submit')
})
