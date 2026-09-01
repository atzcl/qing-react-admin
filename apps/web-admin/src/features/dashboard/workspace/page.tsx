import { Icon } from '@iconify/react'
import { useRouter } from '@tanstack/react-router'
import { Avatar, Card, Checkbox } from 'antd'
import { useState } from 'react'

import { DonutChart } from '~/components/charts'
import { getCurrentUser } from '~/core/auth'

const projects = [
  {
    color: '#18181b',
    content: '不要等待机会，而要创造机会。',
    group: '开源组',
    icon: 'carbon:logo-github',
    title: 'Github',
    url: 'https://github.com',
  },
  {
    color: '#1677ff',
    content: '现在的你决定将来的你。',
    group: '算法组',
    icon: 'logos:ant-design',
    title: 'Ant Design',
    url: 'https://ant.design',
  },
  {
    color: '#e18525',
    content: '没有什么才能比努力更重要。',
    group: '上班摸鱼',
    icon: 'ion:logo-html5',
    title: 'Html5',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML',
  },
  {
    color: '#bf0c2c',
    content: '热情和欲望可以突破一切难关。',
    group: 'UI',
    icon: 'ion:logo-angular',
    title: 'Angular',
    url: 'https://angular.io',
  },
  {
    color: '#00d8ff',
    content: '健康的身体是实现目标的基石。',
    group: '技术牛',
    icon: 'bx:bxl-react',
    title: 'React',
    url: 'https://react.dev',
  },
  {
    color: '#EBD94E',
    content: '路是走出来的，而不是空想出来的。',
    group: '架构组',
    icon: 'ion:logo-javascript',
    title: 'Js',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript',
  },
]

const initialTodos = [
  {
    completed: false,
    content: '审查最近提交到Git仓库的前端代码，确保代码质量和规范。',
    date: '2024-07-30 11:00:00',
    title: '审查前端代码提交',
  },
  {
    completed: true,
    content: '检查并优化系统性能，降低CPU使用率。',
    date: '2024-07-30 11:00:00',
    title: '系统性能优化',
  },
  {
    completed: false,
    content: '进行系统安全检查，确保没有安全漏洞或未授权的访问。',
    date: '2024-07-30 11:00:00',
    title: '安全检查',
  },
  {
    completed: false,
    content: '更新项目中的所有npm依赖包，确保使用最新版本。',
    date: '2024-07-30 11:00:00',
    title: '更新项目依赖',
  },
  {
    completed: false,
    content: '修复用户报告的页面UI显示问题，确保在不同浏览器中显示一致。',
    date: '2024-07-30 11:00:00',
    title: '修复UI显示问题',
  },
]

const quickNavigation = [
  { color: '#1fdaca', icon: 'ion:home-outline', title: '首页', url: '/' },
  { color: '#bf0c2c', icon: 'ion:grid-outline', title: '仪表盘', url: '/dashboard' },
  { color: '#e18525', icon: 'ion:layers-outline', title: '组件', url: '/demos/features/icons' },
  {
    color: '#3fb27f',
    icon: 'ion:settings-outline',
    title: '系统管理',
    url: '/demos/features/login-expired',
  },
  {
    color: '#4daf1bc9',
    icon: 'ion:key-outline',
    title: '权限管理',
    url: '/demos/access/page-control',
  },
  { color: '#00d8ff', icon: 'ion:bar-chart-outline', title: '图表', url: '/dashboard/analytics' },
]

const trends = [
  ['/app-icons/avatar-1.svg', '威廉', '在 开源组 创建了项目 React', '刚刚'],
  ['/app-icons/avatar-2.svg', '艾文', '关注了 威廉', '1个小时前'],
  ['/app-icons/avatar-3.svg', '克里斯', '发布了 个人动态', '1天前'],
  ['/app-icons/avatar-4.svg', '青枫', '发表文章 如何编写一个 Vite 插件', '2天前'],
  ['/app-icons/avatar-1.svg', '皮特', '回复了 杰克 的问题 如何进行项目优化？', '3天前'],
  ['/app-icons/avatar-2.svg', '杰克', '关闭了问题 如何运行项目', '1周前'],
  ['/app-icons/avatar-3.svg', '威廉', '发布了 个人动态', '1周前'],
  ['/app-icons/avatar-4.svg', '威廉', '推送了代码到 Github', '2021-04-01 20:00'],
  ['/app-icons/avatar-4.svg', '青枫', '发表文章 如何搭建 React 管理后台', '2021-03-01 20:00'],
] as const

export default function WorkspacePage() {
  const [todos, setTodos] = useState(initialTodos)
  const router = useRouter()
  const user = getCurrentUser()

  function navigate(url: string) {
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    const href = url === '/' || url === '/dashboard' ? '/dashboard/analytics' : url
    void router.navigate({ href })
  }

  return (
    <main className="page workspace-page">
      <section className="workspace-hero">
        <Avatar size={64} src={user?.avatar ?? '/favicon.svg'} />
        <div>
          <h1>早安, {user?.realName ?? '管理员'}, 开始您一天的工作吧！</h1>
          <p>今日晴，20℃ - 32℃！</p>
        </div>
      </section>

      <div className="workspace-grid">
        <div className="workspace-main-column">
          <Card title="项目" variant="borderless">
            <div className="project-grid">
              {projects.map((project) => {
                return (
                  <button
                    className="project-card"
                    key={project.title}
                    onClick={() => navigate(project.url)}
                    type="button"
                  >
                    <span className="project-card__icon" style={{ color: project.color }}>
                      <Icon icon={project.icon} />
                    </span>
                    <strong>{project.title}</strong>
                    <p>{project.content}</p>
                    <footer>
                      <span>{project.group}</span>
                      <time>2021-04-01</time>
                    </footer>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card title="最新动态" variant="borderless">
            <ul className="activity-feed">
              {trends.map(([avatar, author, content, date]) => (
                <li key={`${author}-${date}`}>
                  <Avatar size={36} src={avatar} />
                  <div>
                    <p>
                      <strong>{author}</strong> {content}
                    </p>
                    <time>{date}</time>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="workspace-side-column">
          <Card title="快捷导航" variant="borderless">
            <div className="quick-nav-grid">
              {quickNavigation.map(({ color, icon, title, url }) => (
                <button key={title} onClick={() => navigate(url)} type="button">
                  <Icon icon={icon} style={{ color }} />
                  <span>{title}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card title="待办事项" variant="borderless">
            <div className="todo-list">
              {todos.map((todo, index) => (
                <label
                  className={todo.completed ? 'todo-item is-complete' : 'todo-item'}
                  key={todo.title}
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={(event) =>
                      setTodos((items) =>
                        items.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, completed: event.target.checked } : item,
                        ),
                      )
                    }
                  />
                  <span className="todo-item__content">
                    <strong>{todo.title}</strong>
                    <small>{todo.content}</small>
                    <time>{todo.date}</time>
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card title="访问来源" variant="borderless">
            <DonutChart
              items={[
                { name: '搜索引擎', value: 37 },
                { name: '直接访问', value: 26 },
                { name: '邮件营销', value: 20 },
                { name: '联盟广告', value: 17 },
              ]}
            />
          </Card>
        </aside>
      </div>
    </main>
  )
}
