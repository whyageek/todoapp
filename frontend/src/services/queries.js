import { gql } from '@apollo/client';

export const GET_ALL_TODOS = gql`
  query GetAllTodos {
    allTodos {
      id
      title
      description
      time
    }
  }
`;
