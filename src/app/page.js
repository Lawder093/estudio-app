'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Sesión iniciada')
    }
  }

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Sistema de Evaluación
      </h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Correo"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Entrar
      </button>
    </main>
  )
}