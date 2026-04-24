'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function InstrumentsPage() {
  const [name, setName] = useState('')
  const [items, setItems] = useState('')
  const [list, setList] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data } = await supabase
      .from('questionnaires')
      .select('*')
      .order('id', { ascending: false })

    setList(data || [])
  }

  async function saveInstrument() {
    const { data, error } = await supabase
      .from('questionnaires')
      .insert([{ name }])
      .select()

    if (error) return alert(error.message)

    const questionnaireId = data[0].id

    const lines = items
      .split('\n')
      .filter(Boolean)

    const rows = lines.map((text, index) => ({
      questionnaire_id: questionnaireId,
      question_text: text,
      order_number: index + 1
    }))

    await supabase.from('questions').insert(rows)

    alert('Instrumento creado')
    setName('')
    setItems('')
    loadData()
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">
        Instrumentos
      </h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Nombre del instrumento"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <textarea
        className="border p-2 w-full h-48 mb-3"
        placeholder="Una pregunta por línea"
        value={items}
        onChange={(e)=>setItems(e.target.value)}
      />

      <button
        onClick={saveInstrument}
        className="bg-black text-white px-4 py-2"
      >
        Guardar
      </button>

      <hr className="my-6" />

      {list.map(item => (
        <div key={item.id} className="border p-3 mb-2 bg-white">
          {item.name}
        </div>
      ))}
    </main>
  )
}