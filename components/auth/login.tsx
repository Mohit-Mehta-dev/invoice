"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { login } from "@/services/authService";
import { createAuthLocalStorage, createTokenLocalStorage } from "@/utils/localStorageUtils";
import { Button, Input, addToast } from "@heroui/react";
import { AxiosError } from "axios";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const initialValues: LoginFormType = {
    email: "admin@rtg.com",
    password: "admin",
  };

  const handleLogin = useCallback(async (values: LoginFormType) => {
    try {
      let response = await login(values.email, values.password);
      console.log('response', response);
  
      createAuthLocalStorage(response.data);
      createAuthCookie(response.token)
      createTokenLocalStorage(response.token);
      router.push('/');
    } catch (err: unknown) {
      console.log('Login error:', err);
  
      if (err instanceof AxiosError) {
        const status = err.response?.status;
  
        switch (status) {
          case 400:
            addToast({
              title: err.response?.data.message,
              // description: 'Please check your input and try again.',
              color: 'danger',
            });
            break;
          case 401:
            addToast({
              title: 'Unauthorized',
              description: 'Invalid credentials. Please try again.',
              color: 'danger',
            });
            break;
          case 500:
            addToast({
              title: 'Server Error',
              description: 'An error occurred on the server. Please try again later.',
              color: 'danger',
            });
            break;
          default:
            addToast({
              title: 'Error',
              description: 'An unexpected error occurred. Please try again.',
              color: 'danger',
            });
            break;
        }
      } else {
        addToast({
          title: 'Unexpected Error',
          description: 'An unexpected error occurred. Please try again.',
          color: 'danger',
        });
      }
  
      setError('Login failed. Please try again.');
    }
  }, [addToast, setError]); 
  
  return (
    <>
      <div className='text-center text-[25px] font-bold mb-6'>Login</div>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit} className='flex flex-col items-center w-full'>
            <div className='flex flex-col w-1/2 gap-4 mb-4'>
              <Input
                variant='bordered'
                label='Email / Username'
                type='text'
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
                maxLength={40}
                minLength={5}
              />
              <Input
                variant='bordered'
                label='Password'
                type='password'
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
                maxLength={25}
                minLength={6}
              />
            </div>

            <Button
              // onPress={() => handleSubmit()}
              type="submit"
              variant='flat'
              color='primary'>
              Login
            </Button>
          </form>
        )}
      </Formik>

      <div className='font-light text-slate-400 mt-4 text-sm'>
        Don&apos;t have an account ?{" "}
        <Link href='/register' className='font-bold'>
          Register here
        </Link>
      </div>
    </>
  );
};
