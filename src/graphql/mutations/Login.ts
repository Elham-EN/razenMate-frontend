import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(loginInp: { email: $email, password: $password }) {
      user {
        email
        fullname
        id
      }
    }
  }
`;
