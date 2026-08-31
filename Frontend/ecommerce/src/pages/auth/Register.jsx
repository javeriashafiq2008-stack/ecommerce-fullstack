import React from 'react'
import  ReuseableAuthenticationForm  from '../ReuseableAuthenticatedForm'

function Register() {

  let inputFields = [

    {
      name:"name",
      type:"text",
      placeholder : "Enter Name"
    },
    {
      name:"email",
      type:"email",
      placeholder : "Enter Email"
    },
    {
      name:"password",
      type:"password",
      placeholder : "Enter Password"
    },
    {
      name:"confirmPassword",
      type:"password",
      placeholder : "Confirm Password"
    }
  ]


  return (
    <>
    
    <ReuseableAuthenticationForm fields={inputFields} handler={"register"}></ReuseableAuthenticationForm>
    
    </>
  )
}

export default Register