import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  split,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { onError } from "@apollo/client/link/error";
import { useUserStore } from "./store/userStore";
import { getMainDefinition } from "@apollo/client/utilities";

/**
 * The primary purpose of the `refreshToken` function is to make a GraphQL
 * mutation request to get a new access token when the current one is expired
 * or invalid.
 */
async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `,
    });
    const newAccessToken = data?.refreshToken;
    if (!newAccessToken) {
      throw new Error("New access token not received");
    }
    return `Bearer ${newAccessToken}`;
  } catch (error) {
    throw new Error("Error getting new access token");
  }
}

let retryCount = 0;
const maxRetry = 3;

/**
 * Setting up a WebSocket connection for GraphQL subscriptions. It ensures the
 * connection is authenticated using a token from localStorage and will try to
 * reconnect if the connection is lost
 */
const wsLink = new WebSocketLink(
  new SubscriptionClient("ws://localhost:3000/graphql", {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
);

/**
 * Allows the client to respond gracefully to authentication errors by trying to
 * refresh the access token and retrying the GraphQL operation. If it can't refresh
 * the token or encounters certain errors like "Refresh token not found", it can
 * perform other actions like logging the user out.
 */
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  for (const err of graphQLErrors!) {
    if (err.extensions.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
      retryCount++;
      return new Observable((observer) => {
        refreshToken(client)
          .then((token) => {
            console.log("token", token);
            operation.setContext((previousContext: any) => ({
              headers: {
                ...previousContext.headers,
                authorization: token,
              },
            }));
            const forward$ = forward(operation);
            forward$.subscribe(observer);
          })
          .catch((error) => observer.error(error));
      });
    }

    if (err.message === "Refresh token not found") {
      console.log("refresh token not found!");
      useUserStore.setState({
        id: undefined,
        fullname: "",
        email: "",
      });
    }
  }
});

/**
 * createUploadLink - to handle file uploads in GraphQL requests.
 * "include", tells the browser to include credentials (like cookies)
 * with the request.
 * This is an object defining additional headers to be sent along with
 * the GraphQL requests.
 * uploadLink can be used within an Apollo Client setup to intercept and
 * handle any GraphQL mutations that involve file uploads
 *
 */
const uploadLink = createUploadLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});

const link = split(
  // Split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  ApolloLink.from([errorLink, uploadLink])
);

export const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache({}),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  link: link,
});
