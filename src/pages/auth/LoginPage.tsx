import AuthBrandPanel from './components/AuthBrandPanel'
import AuthFormCard from './components/AuthFormCard'
import AuthLayout from './components/AuthLayout'

function LoginPage() {
  return (
    <AuthLayout
      brandPanel={<AuthBrandPanel mode="login" />}
      form={<AuthFormCard mode="login" />}
    />
  )
}

export default LoginPage
