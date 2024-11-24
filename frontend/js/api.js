async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
    'x-access-token': token, // Adiciona o token no header
  };

  const response = await fetch(url, { ...options, headers });

  // Verifica se um novo token foi enviado pelo backend
  const newToken = response.headers.get('x-new-access-token');
  if (newToken) {
    localStorage.setItem('accessToken', newToken); // Atualiza o token
  }

  if (response.status === 401) {
    console.error('Usuário não autorizado. Redirecionando para o login.');
    window.location.href = '/login'; // Redireciona para o login
  }

  return response;
}