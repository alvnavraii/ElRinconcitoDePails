// Servicio para la API de traducciones de categorías

const API_URL = 'http://localhost:8080/api/v1/categories/translations';

export async function fetchCategoryTranslations(token, categoryId) {
  const response = await fetch(`${API_URL}/category/${categoryId}`, {
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

export async function createCategoryTranslation(token, translationData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(translationData)
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

export async function updateCategoryTranslation(token, categoryId, languageId, translationData) {
  const response = await fetch(`${API_URL}/category/${categoryId}/language/${languageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(translationData)
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

export async function deleteCategoryTranslation(token, categoryId, languageId) {
  const response = await fetch(`${API_URL}/category/${categoryId}/language/${languageId}`, {
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
