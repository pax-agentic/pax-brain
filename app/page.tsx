import { readdir, readFile, stat } from 'node:fs/promises'
import Image from 'next/image'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  Brain,
  Buildings,
  ClockClockwise,
  Code,
  Cloud,
  Database,
  Globe,
  Kanban,
  Lightning,
  HardDrives,
  WhatsappLogo,
  GitBranch,
  CheckCircle,
  CircleDashed,
  Clock,
  TestTube,
  Rocket,
  Robot,
  FileText,
  Wrench,
} from '@phosphor-icons/react/dist/ssr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { auth } from '@/lib/auth'
import { LogoutButton } from '@/components/logout-button'

async function getProjects() {
  try {
    const entries = await readdir('/data/workspace/projects', { withFileTypes: true })
    return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()
  } catch {
    return [] as string[]
  }
}

const tools = [
  { name: 'GitHub (gh)', desc: 'Issues, PRs, projects, automation', icon: GitBranch },
  { name: 'Coolify API', desc: 'Provision and deploy web apps', icon: Cloud },
  { name: 'WhatsApp Gateway', desc: 'Primary operator channel', icon: WhatsappLogo },
  { name: 'Cron Jobs', desc: 'Heartbeat + scheduled workflows', icon: ClockClockwise },
  { name: 'Workspace FS', desc: 'Persistent memory + project context', icon: Database },
  { name: 'OpenClaw Runtime', desc: 'Tool orchestration and session control', icon: Robot },
]

const heartbeatRules = [
  'Every issue must be added to Pax Board.',
  'Read project PROFILE.md before starting any work.',
  'Run lint + build before opening a PR.',
  'After PR, always communicate preview URL.',
]

const infra = [
  'Host: projects-1 (188.245.99.243)',
  'Domain: onniworks.com (+ wildcard subdomains)',
  'Preview URLs: https://{pr_number}.pr1.onniworks.com',
  'Deploy pipeline: GitHub → Coolify GitHub App → Nixpacks',
]

type BrainFile = {
  name: string
  path: string
  exists: boolean
  sizeBytes: number
  preview: string
}

const BRAIN_FILE_PATHS = [
  '/data/workspace/HEARTBEAT.md',
  '/data/workspace/TOOLS.md',
  '/data/workspace/AGENTS.md',
  '/data/workspace/SOUL.md',
  '/data/workspace/USER.md',
  '/data/workspace/MEMORY.md',
  '/data/workspace/IDENTITY.md',
]

const PREVIEW_LINE_LIMIT = 10

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function getBrainFiles(): Promise<BrainFile[]> {
  const files = await Promise.all(
    BRAIN_FILE_PATHS.map(async (path) => {
      const name = path.split('/').pop() || path
      try {
        const [fileStat, raw] = await Promise.all([stat(path), readFile(path, 'utf8')])
        const lines = raw.split('\n').slice(0, PREVIEW_LINE_LIMIT).join('\n').trim()
        return {
          name,
          path,
          exists: true,
          sizeBytes: fileStat.size,
          preview: lines || '(empty file)',
        }
      } catch {
        return {
          name,
          path,
          exists: false,
          sizeBytes: 0,
          preview: '(missing)',
        }
      }
    })
  )

  return files
}

type SkillEntry = {
  name: string
  scope: 'runtime' | 'workspace'
  path: string
}

async function getSkills(): Promise<SkillEntry[]> {
  const buckets: SkillEntry[] = []

  try {
    const runtime = await readdir('/opt/openclaw/app/skills', { withFileTypes: true })
    for (const entry of runtime) {
      if (!entry.isDirectory()) continue
      buckets.push({
        name: entry.name,
        scope: 'runtime',
        path: `/opt/openclaw/app/skills/${entry.name}`,
      })
    }
  } catch {
    // no-op
  }

  try {
    const workspace = await readdir('/data/workspace/pax-brain/.agents/skills', { withFileTypes: true })
    for (const entry of workspace) {
      if (!entry.isDirectory()) continue
      buckets.push({
        name: entry.name,
        scope: 'workspace',
        path: `/data/workspace/pax-brain/.agents/skills/${entry.name}`,
      })
    }
  } catch {
    // no-op
  }

  return buckets.sort((a, b) => a.name.localeCompare(b.name))
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/login')
  }

  const [projects, brainFiles, skills] = await Promise.all([getProjects(), getBrainFiles(), getSkills()])

  return (
    <main className='min-h-screen bg-slate-950 text-slate-100'>
      <div className='mx-auto max-w-7xl px-6 py-10 lg:px-10'>
        <div className='mb-8 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>Pax Brain</h1>
            <p className='text-slate-300 mt-2'>Living dashboard of Pax’s operating system and execution stack.</p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-2 py-1'>
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || session.user.email || 'User'}
                  width={24}
                  height={24}
                  className='rounded-full'
                />
              ) : (
                <div className='h-6 w-6 rounded-full bg-white/20' />
              )}
              <div className='text-xs leading-tight'>
                <div className='font-medium'>{session.user.name || 'Signed in user'}</div>
                <div className='text-slate-400'>{session.user.email}</div>
              </div>
            </div>
            <Badge variant='secondary'>Google OAuth</Badge>
            <LogoutButton />
          </div>
        </div>

        <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <Card><CardHeader><CardTitle className='flex items-center gap-2'><Brain size={18} />Identity</CardTitle></CardHeader><CardContent className='text-sm text-slate-300'>Pax · proactive execution partner ⚙️</CardContent></Card>
          <Card><CardHeader><CardTitle className='flex items-center gap-2'><Robot size={18} />Model</CardTitle></CardHeader><CardContent className='text-sm text-slate-300'>openai-codex/gpt-5.3-codex</CardContent></Card>
          <Card><CardHeader><CardTitle className='flex items-center gap-2'><HardDrives size={18} />Container</CardTitle></CardHeader><CardContent className='text-sm text-slate-300'>host: 7d0bc0115917 · Linux</CardContent></Card>
          <Card><CardHeader><CardTitle className='flex items-center gap-2'><Buildings size={18} />Server</CardTitle></CardHeader><CardContent className='text-sm text-slate-300'>projects-1 / Coolify fleet</CardContent></Card>
        </section>

        <section className='mt-8 grid gap-6 lg:grid-cols-5'>
          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Kanban size={18} />Workflow</CardTitle>
              <CardDescription>Operational board flow from intake to shipped outcomes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-3 md:grid-cols-5'>
                {[
                  { label: 'Ideas', Icon: CircleDashed },
                  { label: 'Ready', Icon: Clock },
                  { label: 'In Progress', Icon: Lightning },
                  { label: 'In Review', Icon: TestTube },
                  { label: 'Done', Icon: CheckCircle },
                ].map(({ label, Icon }) => (
                  <div key={label} className='rounded-xl border border-white/10 bg-slate-900/60 p-3 text-center'>
                    <div className='mx-auto mb-2 w-fit text-cyan-300'><Icon size={18} weight='duotone' /></div>
                    <div className='text-sm font-medium'>{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Globe size={18} />Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2 text-sm text-slate-300'>
                {infra.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className='mt-8 grid gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Code size={18} />Tools & Integrations</CardTitle>
              <CardDescription>Execution surface available to Pax.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-3 sm:grid-cols-2'>
                {tools.map((tool) => (
                  <div key={tool.name} className='rounded-xl border border-white/10 bg-slate-900/60 p-3'>
                    <div className='mb-1 flex items-center gap-2 font-medium'><tool.icon size={16} weight='duotone' /> {tool.name}</div>
                    <p className='text-xs text-slate-300'>{tool.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Rocket size={18} />Projects</CardTitle>
              <CardDescription>Auto-read from /data/workspace/projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {projects.length === 0 ? (
                  <p className='text-sm text-slate-300'>No projects found.</p>
                ) : (
                  projects.map((name) => <Badge key={name} variant='muted' className='mr-2 mb-2'>{name}</Badge>)
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className='mt-8'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><ClockClockwise size={18} />HEARTBEAT Rules</CardTitle>
              <CardDescription>Critical operating constraints (summarized).</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='grid gap-2 text-sm text-slate-300 md:grid-cols-2'>
                {heartbeatRules.map((rule) => <li key={rule}>• {rule}</li>)}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className='mt-8'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><FileText size={18} />Brain Files</CardTitle>
              <CardDescription>Live view of core system files that define behavior, constraints, and memory.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 lg:grid-cols-2'>
                {brainFiles.map((file) => (
                  <div key={file.path} className='rounded-xl border border-white/10 bg-slate-900/60 p-3'>
                    <div className='mb-2 flex items-center justify-between gap-2'>
                      <div className='font-medium'>{file.name}</div>
                      <Badge variant={file.exists ? 'secondary' : 'destructive'}>
                        {file.exists ? formatBytes(file.sizeBytes) : 'missing'}
                      </Badge>
                    </div>
                    <div className='mb-2 text-[11px] text-slate-400 break-all'>{file.path}</div>
                    <pre className='max-h-48 overflow-auto rounded-md border border-white/10 bg-black/30 p-2 text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap'>
                      {file.preview}
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className='mt-8'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'><Wrench size={18} />Skills</CardTitle>
              <CardDescription>Discovered skill directories available to Pax at runtime and in this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <p className='text-sm text-slate-300'>No skills discovered.</p>
              ) : (
                <div className='grid gap-3 lg:grid-cols-2'>
                  {skills.map((skill) => (
                    <div key={`${skill.scope}-${skill.path}`} className='rounded-xl border border-white/10 bg-slate-900/60 p-3'>
                      <div className='mb-1 flex items-center gap-2'>
                        <div className='font-medium'>{skill.name}</div>
                        <Badge variant={skill.scope === 'runtime' ? 'secondary' : 'muted'}>{skill.scope}</Badge>
                      </div>
                      <div className='text-xs text-slate-400 break-all'>{skill.path}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
