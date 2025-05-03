// Servicio para la API de idiomas

const API_URL = 'http://localhost:8080/api/v1/languages';

export async function fetchLanguages(token) {
  const response = await fetch(API_URL, {
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

export async function createLanguage(token, languageData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(languageData)
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

export async function updateLanguage(token, id, languageData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(languageData)
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

export async function deleteLanguage(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return true;
}
