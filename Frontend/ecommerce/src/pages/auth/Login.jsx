import React from 'react'
import ReuseableAuthenticationForm from '../ReuseableAuthenticatedForm.jsx'

function Login() {

  let inputFields = [
    {
      name:"email",
      type:"email",
      placeholder:"Enter Email"
    },
    {
      name:"password",
      type: "password",
      placeholder:"Enter Password"
    }
  ]

  return (
   <>

   
   
   <ReuseableAuthenticationForm fields={
    inputFields
   } handler={"login"}></ReuseableAuthenticationForm>
   </>
  )
}

export default Login