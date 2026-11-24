import AuthBrandPanel from './components/AuthBrandPanel'
import AuthFormCard from './components/AuthFormCard'
import AuthLayout from './components/AuthLayout'

function RegisterPage() {
  return (
    <AuthLayout
      brandPanel={<AuthBrandPanel mode="register" />}
      form={<AuthFormCard mode="register" />}
    />
  )
}

export default RegisterPage
