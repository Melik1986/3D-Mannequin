import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">3D Mannequin Demo</h1>
      <p className="mb-8 text-xl">Select a model to view:</p>
      <Link 
        href="/models/SLIM_FIT" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Slim Fit Model
      </Link>
    </main>
  )
}
