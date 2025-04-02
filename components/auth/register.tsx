"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { RegisterSchema } from "@/helpers/schemas";
import { RegisterFormType } from "@/helpers/types";
import { register } from "@/services/authService";
import { createAuthLocalStorage, createTokenLocalStorage } from "@/utils/localStorageUtils";
import { addToast, Button, Input } from "@heroui/react";
import { AxiosError } from "axios";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Register = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const initialValues: RegisterFormType = {
    first_name:'',
    last_name:'',
    username:'',
    phone:'',
    email:'',
    company_name:'',
    password:''
  };

  // const handleRegister = useCallback(
  //   async (values: RegisterFormType) => {
  //     // `values` contains name, email & password. You can use provider to register user

  //     await createAuthCookie();
  //     router.replace("/");
  //   },
  //   [router]
  // );

  const handleRegister = useCallback(async (values: RegisterFormType) => {
    try {
      let response = await register(values);
      console.log('response', response);
  
      createAuthLocalStorage(response.data);
      createAuthCookie(response.token)
      createTokenLocalStorage(response.token);
      router.push('/login');
    } catch (err: unknown) {
      console.log('Register error:', err);
  
      if (err instanceof AxiosError) {
        const status = err.response?.status;
  
        switch (status) {
          case 400:
            addToast({
              title: 'Bad Request',
              description: 'Please check your input and try again.',
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
  }, [addToast, setError, router]); 
  

  return (
    <>
      <div className='text-center text-[25px] font-bold mb-6'>Register</div>

      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}>
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            <div className='flex flex-col w-1/2 gap-4 mb-4'>
              <Input
                variant='bordered'
                label='First Name'
                value={values.first_name}
                isInvalid={!!errors.first_name && !!touched.first_name}
                errorMessage={errors.first_name}
                onChange={handleChange("first_name")}
                maxLength={40}
              />
              <Input
                variant='bordered'
                label='Last Name'
                value={values.last_name}
                isInvalid={!!errors.last_name && !!touched.last_name}
                errorMessage={errors.last_name}
                onChange={handleChange("last_name")}
                maxLength={40}
              />
              <Input
                variant='bordered'
                label='Username'
                type='text'
                value={values.username}
                isInvalid={!!errors.username && !!touched.username}
                errorMessage={errors.username}
                // onChange={handleChange("username")}
                maxLength={30}
                minLength={5}
                onChange={(e) => {
                  const value = e.target.value;
                  // Regex to allow alphabets and underscore only
                  const regex = /^[a-zA-Z0-9]*$/;
                  
                  // If the value matches the regex, update the form
                  if (regex.test(value)) {
                    handleChange("username")(e);
                  }
                }}
              />
              <Input
                variant='bordered'
                label='Phone'
                type='number'
                value={values.phone}
                isInvalid={!!errors.phone && !!touched.phone}
                errorMessage={errors.phone}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    handleChange("phone")(e);
                  }
                }}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
              />
              <Input
                variant='bordered'
                label='Email'
                type='email'
                value={values.email}
                isInvalid={
                  !!errors.email && !!touched.email
                }
                errorMessage={errors.email}
                onChange={handleChange("email")}
                maxLength={40}
              />
              <Input
                variant='bordered'
                label='Company Name'
                type='text'
                value={values.company_name}
                isInvalid={
                  !!errors.company_name && !!touched.company_name
                }
                errorMessage={errors.company_name}
                onChange={handleChange("company_name")}
                maxLength={40}
              />
              <Input
                variant='bordered'
                label='Password'
                type='password'
                value={values.password}
                isInvalid={
                  !!errors.password && !!touched.password
                }
                errorMessage={errors.password}
                onChange={handleChange("password")}
                maxLength={40}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant='flat'
              color='primary'
              className="w-full py-3 mt-4">
              Register
            </Button>
          </>
        )}
      </Formik>

      <div className='font-light text-slate-400 mt-4 text-sm'>
        Already have an account ?{" "}
        <Link href='/login' className='font-bold'>
          Login here
        </Link>
      </div>
    </>
  );
};
