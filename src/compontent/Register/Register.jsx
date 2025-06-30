import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/freshcart-logo.svg';

export default function Register() {
  let [errorMasseg, setError] = useState(null);
  let baseUrl = 'https://ecommerce.routemisr.com';
  let Navg = useNavigate();

  let validYup = Yup.object({
    name: Yup.string().required('name required').min(3, 'name char 2').max(20, 'name cher 20'),
    email: Yup.string().required('email required').email('enter valid email'),
    password: Yup.string().required('password required')
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, 'password invalid'),
    rePassword: Yup.string().required('Re-password is required')
      .oneOf([Yup.ref('password')], 'Passwords do not match'),
    phone: Yup.string().required('phone required')
      .matches(/^(010|011|012|015)\d{8}$/, 'enter valid phone'),
  });

  let registerForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      rePassword: '',
    },
    onSubmit: RegisterApi,
    validationSchema: validYup,
  });

  async function RegisterApi(data) {
    await axios.post(`${baseUrl}/api/v1/auth/signup`, data)
      .then((res) => {
        if (res.data.message === 'success') {
          Navg('/Login');
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  return (
    <div className="flex flex-col items-center bg-[#3D5A3C] text-white p-10 min-h-screen sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="w-full sm:w-3/5 md:w-2/5 mb-6 flex justify-center">
        <img src={logo} alt="Flowbite Logo" className="w-full max-w-md" />
      </div>

      {errorMasseg && (
        <div className="p-4 mb-4 w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 mx-auto text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          {errorMasseg}
        </div>
      )}

      <form onSubmit={registerForm.handleSubmit} className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 mx-auto shadow-2xl shadow-white/80 p-8">
        {['name', 'email', 'password', 'rePassword', 'phone'].map((field) => (
          <div className="mb-5" key={field}>
            <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {field === 'rePassword' ? 'Confirm password' : `Your ${field}`}
            </label>
            <input
              type={field.includes('password') ? 'password' : field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              id={field}
              name={field}
              value={registerForm.values[field]}
              onChange={registerForm.handleChange}
              onBlur={registerForm.handleBlur}
              placeholder={
                field === 'password'
                  ? 'Enter your password .... example Abc@123'
                  : field === 'rePassword'
                  ? 'Re-enter your password'
                  : field === 'phone'
                  ? 'Enter your phone number'
                  : `Enter your ${field}`
              }
              className="text-black bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {registerForm.touched[field] && registerForm.errors[field] && (
              <p className="text-red-800">{registerForm.errors[field]}</p>
            )}
          </div>
        ))}

        <button
          disabled={!(registerForm.isValid && registerForm.dirty)}
          type="submit"
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-opacity-25"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
