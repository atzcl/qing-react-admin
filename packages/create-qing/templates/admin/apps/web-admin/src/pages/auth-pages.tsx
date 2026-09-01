import { CheckOutlined } from '@ant-design/icons'
import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { App, Button, Checkbox, Divider, Input, Select, Space, Tooltip } from 'antd'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { z } from 'zod'

import { login, sendLoginCode } from '~/core/auth'

function AuthHeading({ description, title }: { description: string; title: string }) {
  return (
    <header className="auth-heading">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}

function AuthLink({ children, href }: { children: ReactNode; href: string }) {
  const router = useRouter()

  return (
    <button className="auth-link" onClick={() => void router.navigate({ href })} type="button">
      {children}
    </button>
  )
}

function AuthButtonLink({ children, href }: { children: ReactNode; href: string }) {
  const router = useRouter()

  return (
    <Button block onClick={() => void router.navigate({ href })} size="large">
      {children}
    </Button>
  )
}

const loginSchema = z.object({
  password: z.string().min(1, '请输入密码'),
  remember: z.boolean(),
  username: z.string().min(1, '请输入用户名'),
})

export const codeLoginSchema = z.object({
  code: z.string().length(6, '请输入6位验证码'),
  phoneNumber: z
    .string()
    .min(1, '请输入手机号码')
    .regex(/^\d{11}$/, '手机号码格式错误'),
})

export const forgetPasswordSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式错误'),
})

export const registerSchema = z
  .object({
    agreePolicy: z.boolean().refine(Boolean, '请阅读并同意隐私政策与条款'),
    confirmPassword: z.string().min(1, '请再次输入密码'),
    password: z.string().min(1, '请输入密码'),
    username: z.string().min(1, '请输入用户名'),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

function validationMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    const message = error.message
    return typeof message === 'string' ? message : undefined
  }
  return undefined
}

function AuthFieldErrors({ errors }: { errors: readonly unknown[] }) {
  const message = errors.map(validationMessage).find(Boolean)
  return message ? <p className="auth-field-error">{message}</p> : null
}

export function LoginPage({ redirect }: { redirect?: string }) {
  const { message } = App.useApp()
  const router = useRouter()
  const [serverError, setServerError] = useState('')
  const [captchaValue, setCaptchaValue] = useState(0)
  const form = useForm({
    defaultValues: { password: '123456', remember: false, username: 'super' },
    onSubmit: async ({ value }) => {
      setServerError('')
      if (captchaValue < 100) {
        setServerError('请先完成验证')
        return
      }
      const input = loginSchema.parse(value)
      const result = login(input)
      if (!result.success) {
        setServerError(result.message)
        setCaptchaValue(0)
        return
      }
      await router.invalidate()
      await router.navigate({ href: redirect || result.user.homePath })
      await message.success('登录成功，欢迎回来')
    },
    validators: { onSubmit: loginSchema },
  })

  return (
    <div className="auth-form-card">
      <AuthHeading description="请输入您的账户信息以开始管理您的项目" title="欢迎回来 👋🏻" />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <Select
          className="auth-account-select"
          onChange={(username) => {
            form.setFieldValue('username', username)
            form.setFieldValue('password', '123456')
            setCaptchaValue(0)
          }}
          options={[
            { label: 'Super', value: 'super' },
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ]}
          placeholder="快速选择账号"
          size="large"
          value={form.state.values.username}
        />
        <form.Field name="username">
          {(field) => (
            <Input
              autoComplete="username"
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="请输入用户名"
              size="large"
              value={field.state.value}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <Input.Password
              autoComplete="current-password"
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="密码"
              size="large"
              value={field.state.value}
            />
          )}
        </form.Field>
        <div className={captchaValue >= 100 ? 'slider-captcha is-success' : 'slider-captcha'}>
          <div className="slider-captcha__progress" style={{ width: `${captchaValue}%` }} />
          <input
            aria-label="滑动验证"
            max={100}
            min={0}
            onChange={(event) => setCaptchaValue(Number(event.target.value))}
            onMouseUp={() => setCaptchaValue((value) => (value >= 96 ? 100 : 0))}
            onTouchEnd={() => setCaptchaValue((value) => (value >= 96 ? 100 : 0))}
            type="range"
            value={captchaValue}
          />
          <span
            className="slider-captcha__action"
            style={{ left: `calc(${captchaValue}% - ${captchaValue === 100 ? 40 : 0}px)` }}
          >
            {captchaValue >= 100 ? <CheckOutlined /> : '»'}
          </span>
          <span>{captchaValue >= 100 ? '验证成功' : '请按住滑块拖动'}</span>
        </div>
        {serverError ? <p className="auth-error">{serverError}</p> : null}
        <div className="auth-form-options">
          <form.Field name="remember">
            {(field) => (
              <Checkbox
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
              >
                记住账号
              </Checkbox>
            )}
          </form.Field>
          <AuthLink href="/auth/forget-password">忘记密码?</AuthLink>
        </div>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button block htmlType="submit" loading={isSubmitting} size="large" type="primary">
              登录
            </Button>
          )}
        </form.Subscribe>
      </form>
      <div className="auth-secondary-actions">
        <Button onClick={() => void router.navigate({ href: '/auth/code-login' })} size="large">
          手机号登录
        </Button>
        <Button onClick={() => void router.navigate({ href: '/auth/qrcode-login' })} size="large">
          扫码登录
        </Button>
      </div>
      <Divider plain>其他登录方式</Divider>
      <Space className="social-login" size={6}>
        {[
          ['微信登录', '/auth-icons/wechat.svg'],
          ['QQ 登录', '/auth-icons/qqchat.svg'],
          ['GitHub 登录', '/auth-icons/github.svg'],
          ['Google 登录', '/auth-icons/google.svg'],
        ].map(([label, src]) => (
          <Tooltip key={label} title={label}>
            <Button
              aria-label={label}
              icon={<img alt="" height={18} src={src} width={18} />}
              type="text"
            />
          </Tooltip>
        ))}
      </Space>
      <p className="auth-switch">
        还没有账号? <AuthLink href="/auth/register">创建账号</AuthLink>
      </p>
    </div>
  )
}

export function CodeLoginPage() {
  const { message } = App.useApp()
  const [countdown, setCountdown] = useState(0)
  const [sending, setSending] = useState(false)
  const form = useForm({
    defaultValues: { code: '', phoneNumber: '' },
    onSubmit: ({ value }) => {
      codeLoginSchema.parse(value)
    },
    validators: { onSubmit: codeLoginSchema },
  })

  useEffect(() => {
    if (countdown <= 0) return undefined
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  async function sendCode() {
    const parsed = codeLoginSchema.shape.phoneNumber.safeParse(form.state.values.phoneNumber)
    if (!parsed.success) {
      await message.error(parsed.error.issues[0]?.message ?? '手机号码格式错误')
      return
    }
    setSending(true)
    message.open({ content: '正在发送验证码', duration: 0, key: 'sending-code', type: 'loading' })
    await new Promise((resolve) => window.setTimeout(resolve, 3000))
    sendLoginCode({ phone: parsed.data })
    setSending(false)
    setCountdown(60)
    await message.success({ content: `验证码已发送至${parsed.data}`, key: 'sending-code' })
  }

  return (
    <div className="auth-form-card">
      <AuthHeading description="请输入您的手机号码以开始管理您的项目" title="欢迎回来 📲" />
      <form
        className="auth-standalone-form"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="phoneNumber" validators={{ onBlur: codeLoginSchema.shape.phoneNumber }}>
          {(field) => (
            <div>
              <Input
                autoComplete="tel"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="手机号码"
                size="large"
                value={field.state.value}
              />
              <AuthFieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <form.Field name="code" validators={{ onBlur: codeLoginSchema.shape.code }}>
          {(field) => (
            <div>
              <div className="auth-pin-row">
                <Input.OTP
                  length={6}
                  onChange={field.handleChange}
                  size="large"
                  value={field.state.value}
                />
                <Button
                  disabled={countdown > 0 || sending}
                  loading={sending}
                  onClick={() => void sendCode()}
                  size="large"
                >
                  {countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码'}
                </Button>
              </div>
              <AuthFieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button block htmlType="submit" loading={isSubmitting} size="large" type="primary">
              登录
            </Button>
          )}
        </form.Subscribe>
        <AuthButtonLink href="/auth/login">返回</AuthButtonLink>
      </form>
    </div>
  )
}

export function QrCodeLoginPage() {
  return (
    <div className="auth-form-card">
      <AuthHeading description="请用手机扫描二维码登录" title="欢迎回来 📱" />
      <div className="auth-qrcode">
        <QRCodeSVG
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          marginSize={4}
          size={220}
          value="https://admin.example.com"
        />
        <p>扫码后点击 '确认'，即可完成登录</p>
      </div>
      <AuthButtonLink href="/auth/login">返回</AuthButtonLink>
    </div>
  )
}

export function ForgetPasswordPage() {
  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: ({ value }) => {
      forgetPasswordSchema.parse(value)
    },
    validators: { onSubmit: forgetPasswordSchema },
  })

  return (
    <div className="auth-form-card">
      <AuthHeading
        description="输入您的电子邮件，我们将向您发送重置密码的连接"
        title="忘记密码? 🤦🏻‍♂️"
      />
      <form
        className="auth-standalone-form"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="email" validators={{ onBlur: forgetPasswordSchema.shape.email }}>
          {(field) => (
            <div>
              <Input
                autoComplete="email"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="example@example.com"
                size="large"
                value={field.state.value}
              />
              <AuthFieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <Button block htmlType="submit" size="large" type="primary">
          发送重置链接
        </Button>
        <AuthButtonLink href="/auth/login">返回</AuthButtonLink>
      </form>
    </div>
  )
}

export function RegisterPage() {
  const form = useForm({
    defaultValues: { agreePolicy: false, confirmPassword: '', password: '', username: '' },
    onSubmit: ({ value }) => {
      registerSchema.parse(value)
    },
    validators: { onSubmit: registerSchema },
  })

  return (
    <div className="auth-form-card">
      <AuthHeading description="让您的应用程序管理变得简单而有趣" title="创建一个账号 🚀" />
      <form
        className="auth-standalone-form"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.Field name="username" validators={{ onBlur: registerSchema.shape.username }}>
          {(field) => (
            <div>
              <Input
                autoComplete="username"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="请输入用户名"
                size="large"
                value={field.state.value}
              />
              <AuthFieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <form.Field name="password" validators={{ onBlur: registerSchema.shape.password }}>
          {(field) => (
            <div className="auth-password-field">
              <Input.Password
                autoComplete="new-password"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="密码"
                size="large"
                value={field.state.value}
              />
              <small>使用 8 个或更多字符，混合字母、数字和符号</small>
              <AuthFieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => (
            <div>
              <Input.Password
                autoComplete="new-password"
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="确认密码"
                size="large"
                value={field.state.value}
              />
              <AuthFieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <form.Field name="agreePolicy">
          {(field) => (
            <div>
              <Checkbox
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
              >
                我同意 <a href="#privacy">隐私政策</a> &amp; <a href="#terms">条款</a>
              </Checkbox>
              <AuthFieldErrors errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>
        <Button block htmlType="submit" size="large" type="primary">
          注册
        </Button>
      </form>
      <p className="auth-switch">
        已经有账号了? <AuthLink href="/auth/login">去登录</AuthLink>
      </p>
    </div>
  )
}
