/**
 * About: problem, architecture, tech stack.
 */
import Layout, { SectionHeader, Card } from '../components/Layout'

const STACK = [
  'React',
  'Vite',
  'Tailwind CSS',
  'FastAPI',
  'Pandas',
  'Google Gemini',
  'LocalStorage',
]

export default function AboutPage() {
  return (
    <Layout maxWidth="max-w-3xl">
      <SectionHeader
        title="About DrugCheck"
        subtitle="AI-powered drug interaction warning system"
      />
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Problem</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Patients often take multiple medicines. Some combinations can be dangerous. We help users quickly check
          whether their drugs interact and explain the risk in simple language — with optional image upload and
          a medical chatbot for guidance.
        </p>
      </Card>
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Architecture</h3>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li>• <strong className="text-slate-800 dark:text-slate-200">Frontend:</strong> React SPA with Tailwind; dark mode, responsive layout, voice input, chat widget.</li>
          <li>• <strong className="text-slate-800 dark:text-slate-200">Backend:</strong> FastAPI with CSV-based interaction data; POST /check, /check-from-image, /chat.</li>
          <li>• <strong className="text-slate-800 dark:text-slate-200">AI:</strong> Google Gemini for image drug extraction and patient-friendly explanations.</li>
          <li>• <strong className="text-slate-800 dark:text-slate-200">Data:</strong> Drug interaction pairs (drug1, drug2, severity, description) loaded at startup.</li>
        </ul>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Tech stack</h3>
        <div className="flex flex-wrap gap-2">
          {STACK.map((name) => (
            <span
              key={name}
              className="rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-medium text-sky-800 dark:bg-sky-900/50 dark:text-sky-300"
            >
              {name}
            </span>
          ))}
        </div>
      </Card>
    </Layout>
  )
}
