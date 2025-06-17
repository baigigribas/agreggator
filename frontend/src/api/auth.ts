interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export async function registerUser({ name, email, password }: RegisterParams) {
  const res = await fetch('http://localhost:3001/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  console.log("Sent registration request:", { name, email, password });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function loginUser({ email, password }: LoginParams) {
  const res = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  console.log("Sent login request:", { name, email, password });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function getAllUsers() {
  const res = await fetch('http://localhost:3001/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUserById(id: number) {
  const res = await fetch(`http://localhost:3001/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateUser(id: number, data: { name: string; email: string; avatar?: string }) {
  const res = await fetch(`http://localhost:3001/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`http://localhost:3001/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}