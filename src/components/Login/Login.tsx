import { LoginUserMutation } from "@/gql/graphql";
import { LOGIN_USER } from "../../graphql/mutations/Login";
import { GraphQLErrorExtensions } from "graphql";
import { useMutation } from "@apollo/client";
import { useGeneralStore } from "../../store/generalStore";
import { useUserStore } from "../../store/userStore";
import { useForm } from "@mantine/form";
import classes from "./Login.module.css";
import React from "react";
import {
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Text,
  Anchor,
  Button,
} from "@mantine/core";

interface LoginProps {
  toggleForm: () => void;
}

export default function Login({ toggleForm }: LoginProps): React.ReactElement {
  const [loginUser, { data, loading }] =
    useMutation<LoginUserMutation>(LOGIN_USER);

  const setUser = useUserStore((state) => state.setUser);
  const setIsLoginOpen = useGeneralStore((state) => state.toggleLoginModal);

  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});

  const [invalidCredentials, setInvalidCredentials] = React.useState("");

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) => (value.includes("@") ? null : "Invalid email"),
      password: (value: string) =>
        value.trim().length >= 3
          ? null
          : "Password must be at least 3 characters",
    },
  });

  const handleLogin = async () => {
    await loginUser({
      variables: {
        email: form.values.email,
        password: form.values.password,
      },
      onCompleted: (data) => {
        setErrors({});
        if (data?.login.user) {
          setUser({
            id: data?.login.user.id,
            email: data?.login.user.email,
            fullname: data?.login.user.fullname,
            avatarUrl: data?.login.user.avatarUrl,
          });
          setIsLoginOpen();
        }
      },
    }).catch((err) => {
      setErrors(err.graphQLErrors[0].extensions);
      if (err.graphQLErrors[0].extensions?.invalidCredentials)
        setInvalidCredentials(
          err.graphQLErrors[0].extensions.invalidCredentials
        );
      // User is still need to login
      useGeneralStore.setState({ isLoginModalOpen: true });
    });
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back to RazenMate!
        </Title>
        <form
          onSubmit={form.onSubmit(() => {
            handleLogin();
          })}
        >
          <TextInput
            autoComplete="off"
            label="Email"
            placeholder="Enter your email"
            size="md"
            mt={"md"}
            {...form.getInputProps("email")}
            error={form.errors.email || (errors?.email as string)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt={"md"}
            size="md"
            {...form.getInputProps("password")}
            error={form.errors.password || (errors?.password as string)}
          />
          <Text mt={"xl"} ta={"center"} c={"red"}>
            {invalidCredentials}
          </Text>
          <Text ta="center" mt="xl">
            Not registered yet? {""}
            <Anchor<"a"> href="#" fw={700} onClick={toggleForm}>
              Register here
            </Anchor>
          </Text>
          <Button
            type="submit"
            disabled={loading}
            mt={"xl"}
            size="md"
            fullWidth
          >
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}
