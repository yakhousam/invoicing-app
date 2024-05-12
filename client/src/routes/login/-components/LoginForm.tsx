import { Button, Container, TextField, Typography } from '@mui/material'
import React from 'react'

type LoginFormProps = {
  handleSubmit: ({
    username,
    password
  }: {
    username: string
    password: string
  }) => Promise<void>
}

const LoginForm = ({ handleSubmit }: LoginFormProps) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await handleSubmit({ username, password })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={handleUsernameChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign In
        </Button>
      </form>
    </Container>
  )
}

export default LoginForm
