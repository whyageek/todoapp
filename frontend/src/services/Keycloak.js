import Keycloak from 'keycloak-js';

console.log('Keycloak instance created'); // for keycloak error

const keycloak = new Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'todo-realm',
  clientId: 'todo-client',
});

export default keycloak;
