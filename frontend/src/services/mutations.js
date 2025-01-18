import { gql } from '@apollo/client';

export const ADD_TODO = gql`
  mutation AddToDo($title: String!, $description: String, $time: DateTime) {
    createToDoMutation(title: $title, description: $description, time: $time) {
      todo {
        id
        title
        description
        time
      }
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteToDo($id: ID!) {
    deleteToDoMutation(id: $id) {
      success
      message
    }
  }
`;

export const EDIT_TODO = gql`
  mutation EditToDo(
    $id: ID!
    $title: String
    $description: String
    $time: DateTime
  ) {
    updateToDoMutation(
      id: $id
      title: $title
      description: $description
      time: $time
    ) {
      todo {
        id
        title
        description
        time
      }
    }
  }
`;

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($todoId: Int!, $image: String!) {
    uploadImage(todoId: $todoId, image: $image) {
      success
      message
      todo {
        id
        image
      }
    }
  }
`;