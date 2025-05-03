// Servicio para la API de categorías

const API_URL = 'http://localhost:8080/api/v1/categories';

export async function fetchCategories(token) {
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

export async function createCategory(token, categoryData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(categoryData)
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

export async function updateCategory(token, id, categoryData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(categoryData)
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

export async function deleteCategory(token, id) {
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
