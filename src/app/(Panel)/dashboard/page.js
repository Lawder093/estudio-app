import Link from 'next/link'

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-100">
      
   
      <section className="p-8">
        <h1 className="text-3xl font-bold mb-4">
          Bienvenido
        </h1>

        <p className="mb-6">
          Sistema de captura de evaluación.
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          <Link
            href="/participants"
            className="border bg-white p-6 shadow"
          >
            Participantes
          </Link>

          <Link
            href="/apply-test"
            className="border bg-white p-6 shadow"
          >
            Aplicar Test
          </Link>

          <Link
            href="/results"
            className="border bg-white p-6 shadow"
          >
            Resultados
          </Link>

        </div>
      </section>
    </main>
  )
}