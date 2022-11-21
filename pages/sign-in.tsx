import { Auth, Card, Typography, Space } from '@supabase/ui'
import supabase from '../lib/supabaseClient';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';


const SignInPage = ({session}: any) => {
  const router = useRouter()
  const [authView, setAuthView] = useState<any>('sign_in')

  useEffect(() => {

    if (session) {
      router.push('/exams');
    }


    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') setAuthView('update_password')
        if (event === 'USER_UPDATED')
          setTimeout(() => setAuthView('sign_in'), 1000)
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        fetch('/api/auth', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json())
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [session])

  return (
    <div style={{ maxWidth: '420px', margin: '96px auto' }} className="dark:bg-gray-900">
      <Card className='w-full  dark:bg-gray-900'>
      <Space direction="vertical" size={8} className=" dark:bg-gray-900">
          <div>
            <Typography.Title level={3}>
              Welcome to Exam Prep
            </Typography.Title>
          </div>
          <Auth
                supabaseClient={supabase}
                providers={['google', 'facebook']}
                view={authView}
                socialLayout="horizontal"
                socialButtonSize="xlarge"
            />
        </Space>
      </Card>
    </div>
  )
}

export default SignInPage;