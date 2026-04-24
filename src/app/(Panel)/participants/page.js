'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ParticipantsPage() {
  const emptyForm = {
    full_name: '',
    age: '',
    sex: '',
    school: '',
    community: '',
    school_group: '',
    tutor_name: '',
    assigned_group: 'control'
  }

  const [form, setForm] = useState(emptyForm)
  const [participants, setParticipants] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadParticipants()
  }, [])

  async function loadParticipants() {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('id', { ascending: false })

    if (!error) setParticipants(data)
  }

  function generateCode() {
    const group = form.assigned_group === 'control' ? 'GC' : 'GV'
    const age = String(form.age).padStart(2, '0')
    const initial = form.full_name.charAt(0).toUpperCase()
    const random = Math.floor(Math.random() * 900 + 100)

    return `${group}${age}${initial}${random}`
  }

  async function saveParticipant(e) {
    e.preventDefault()

    const code = generateCode()

    const { error } = await supabase
      .from('participants')
      .insert([
        {
          ...form,
          code,
          age: Number(form.age)
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('Guardado correctamente')
    setForm(emptyForm)
    loadParticipants()
  }

  const filtered = participants.filter((item) =>
    item.full_name.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Participantes
      </h1>

      <form
        onSubmit={saveParticipant}
        className="grid md:grid-cols-2 gap-3 mb-8"
      >
        <input
          className="border p-2"
          placeholder="Nombre completo"
          value={form.full_name}
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Edad"
          value={form.age}
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
        />

        <select
          className="border p-2"
          value={form.sex}
          onChange={(e) =>
            setForm({ ...form, sex: e.target.value })
          }
        >
          <option value="">Sexo</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>

        <input
          className="border p-2"
          placeholder="Escuela"
          value={form.school}
          onChange={(e) =>
            setForm({ ...form, school: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Comunidad"
          value={form.community}
          onChange={(e) =>
            setForm({ ...form, community: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Grupo escolar"
          value={form.school_group}
          onChange={(e) =>
            setForm({ ...form, school_group: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Tutor"
          value={form.tutor_name}
          onChange={(e) =>
            setForm({ ...form, tutor_name: e.target.value })
          }
        />

        <select
          className="border p-2"
          value={form.assigned_group}
          onChange={(e) =>
            setForm({
              ...form,
              assigned_group: e.target.value
            })
          }
        >
          <option value="control">Control</option>
          <option value="variable">Variable</option>
        </select>

        <button className="bg-black text-white p-2 md:col-span-2">
          Guardar participante
        </button>
      </form>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Buscar nombre o código"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-auto border">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Código</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Edad</th>
              <th className="p-2">Grupo</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.code}</td>
                <td className="p-2">{item.full_name}</td>
                <td className="p-2">{item.age}</td>
                <td className="p-2">{item.assigned_group}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}