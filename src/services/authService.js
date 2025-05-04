// Servicio para la API de autenticación

const API_URL = 'http://localhost:8080/api/v1/auth';

export async function login(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}
