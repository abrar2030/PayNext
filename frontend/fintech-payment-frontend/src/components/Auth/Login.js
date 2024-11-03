import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@material-ui/core';
import AuthService from '../../services/AuthService';
import { useHistory } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    AuthService.login(username, password).then(() => {
      history.push('/dashboard');
    }).catch(error => {
      alert('Invalid credentials');
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Login</Typography>
      <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
    </Container>
  );
}

export default Login;
