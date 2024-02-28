import { getJwtToken } from '@/apis/auth.js';

export async function request(
  url,
  { body, method = 'GET', headers, auth = true },
) {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && { Authentication: `Bearer ${getJwtToken()}` }),
      ...headers,
    },
    ...(body && JSON.stringify(body)),
  });
  return await res.json();
}
