import { REGISTER_USER } from "../../graphql/mutations/Register";
import { useGeneralStore } from "../../store/generalStore";
import { useUserStore } from "../../store/userStore";
import { useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";
import { GraphQLErrorExtensions } from "graphql";
import React from "react";
import classes from "./Register.module.css";
import {
  Button,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Text,
  Anchor,
} from "@mantine/core";

interface RegisterProps {
  toggleForm: () => void;
}

function Register({ toggleForm }: RegisterProps): React.ReactElement {
  const form = useForm({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      fullname: (value: string) =>
        value.trim().length >= 3
          ? null
          : "Username must be at least 3 characters",
      email: (value: string) => (value.includes("@") ? null : "Invalid email"),
      password: (value: string) =>
        value.trim().length >= 3
          ? null
          : "Password must be at least 3 characters",
      confirmPassword: (value: string, values) =>
        value.trim().length >= 3 && value === values.password
          ? null
          : "Passwords do not match",
    },
  });

  const setUser = useUserStore((state) => state.setUser);
  const setIsLoginOpen = useGeneralStore((state) => state.toggleLoginModal);

  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const handleRegister = async () => {
    setErrors({});

    await registerUser({
      variables: {
        email: form.values.email,
        password: form.values.password,
        fullname: form.values.fullname,
        confirmPassword: form.values.confirmPassword,
      },
      onCompleted: (data) => {
        setErrors({});
        if (data?.register.user) {
          setUser({
            id: data?.register.user.id,
            email: data?.register.user.email,
            fullname: data?.register.user.fullname,
          });
          setIsLoginOpen(); // Hidden the modal
        }
      },
    }).catch((err) => {
      console.log(err.graphQLErrors, "ERROR");
      setErrors(err.graphQLErrors[0].extensions);
      // Show login modal, so user can keep trying to login
      useGeneralStore.setState({ isLoginModalOpen: true });
    });
  };
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Sign up with RazenMate!
        </Title>
        <form
          onSubmit={form.onSubmit(() => {
            handleRegister();
          })}
        >
          <TextInput
            label="Fullname"
            placeholder="Enter your full name"
            size="md"
            {...form.getInputProps("fullname")}
            error={form.errors.fullname || (errors?.fullname as string)}
          />
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
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            mt={"md"}
            size="md"
            {...form.getInputProps("confirmPassword")}
            error={
              form.errors.confirmPassword || (errors?.confirmPassword as string)
            }
          />
          <Text ta="center" mt="xl">
            Already have an account?{" "}
            <Anchor<"a"> href="#" fw={700} onClick={toggleForm}>
              Login here
            </Anchor>
          </Text>

          <Button
            type="submit"
            disabled={loading}
            mt={"xl"}
            size="md"
            fullWidth
          >
            Register
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default Register;
