function required(key: string, value: string | undefined): string {
  if (!value) throw new Error(`Variável obrigatória ausente: ${key}`);
  return value;
}
export const env = {
  apiUrl: required('VITE_API_URL', import.meta.env.VITE_API_URL),
  keycloakUrl: required('VITE_KEYCLOAK_URL', import.meta.env.VITE_KEYCLOAK_URL),
  realm: required('VITE_KEYCLOAK_REALM', import.meta.env.VITE_KEYCLOAK_REALM),
  clientId: required('VITE_KEYCLOAK_CLIENT_ID', import.meta.env.VITE_KEYCLOAK_CLIENT_ID),
};
