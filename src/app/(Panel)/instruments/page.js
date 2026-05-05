'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function InstrumentsPage() {

  // ===== STATES =====
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [scaleMin, setScaleMin] = useState(1)
  const [scaleMax, setScaleMax] = useState(4)
  const [scaleLabels, setScaleLabels] = useState([])
  const [pairs, setPairs] = useState([
    { direct: '', inverted: '' }
  ])
  const [list, setList] = useState([])

  // ===== LOAD DATA =====
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: false })

    setList(data || [])
  }

  // ===== SCALE INPUTS =====
  function renderScaleInputs() {
    const total = Number(scaleMax) - Number(scaleMin) + 1

    if (total <= 0) return null

    return Array.from({ length: total }, (_, i) => {
      const value = Number(scaleMin) + i

      return (
        <input
          key={value}
          className="border p-2 w-full mb-2"
          placeholder={`Texto para ${value}`}
          value={scaleLabels[i] || ''}
          onChange={(e) => {
            const newLabels = [...scaleLabels]
            newLabels[i] = e.target.value
            setScaleLabels(newLabels)
          }}
        />
      )
    })
  }

  // ===== PAIRS =====
  function addPair() {
    setPairs([...pairs, { direct: '', inverted: '' }])
  }

  function updatePair(index, field, value) {
    const newPairs = [...pairs]
    newPairs[index][field] = value
    setPairs(newPairs)
  }

  function removePair(index) {
    const newPairs = pairs.filter((_, i) => i !== index)
    setPairs(newPairs.length ? newPairs : [{ direct: '', inverted: '' }])
  }

  // ===== SAVE =====
  async function saveInstrument() {

    if (!name.trim()) return alert('Nombre requerido')

    if (Number(scaleMin) >= Number(scaleMax)) {
      return alert('Escala inválida')
    }

    const totalLevels = Number(scaleMax) - Number(scaleMin) + 1

    if (scaleLabels.length !== totalLevels) {
      return alert('Completa todos los textos de la escala')
    }

    if (scaleLabels.some(label => !label || !label.trim())) {
      return alert('No dejes labels vacíos')
    }

    if (pairs.length === 0) {
      return alert('Agrega al menos un reactivo')
    }

    for (const p of pairs) {
      if (!p.direct.trim() || !p.inverted.trim()) {
        return alert('Todos los reactivos deben tener directo e invertido')
      }
    }

    // CREATE QUESTIONNAIRE
    const { data, error } = await supabase
      .from('questionnaires')
      .insert([{
        name,
        test_code: code,
        scale_min: Number(scaleMin),
        scale_max: Number(scaleMax),
        scale_labels: scaleLabels
      }])
      .select()

    if (error) return alert(error.message)

    const questionnaireId = data[0].id

    // CREATE QUESTIONS
    const rows = []
    let order = 1

    pairs.forEach((p) => {

      // Directo
      rows.push({
        questionnaire_id: questionnaireId,
        question_text: p.direct.trim(),
        is_reversed: false,
        order_number: order++,
        is_active: true
      })

      // Invertido
      rows.push({
        questionnaire_id: questionnaireId,
        question_text: p.inverted.trim(),
        is_reversed: true,
        order_number: order++,
        is_active: true
      })
    })

    const { error: qErr } = await supabase
      .from('questions')
      .insert(rows)

    if (qErr) return alert(qErr.message)

    alert('Instrumento creado')

    // RESET
    setName('')
    setCode('')
    setScaleMin(1)
    setScaleMax(4)
    setScaleLabels([])
    setPairs([{ direct: '', inverted: '' }])

    loadData()
  }

  // ===== DEACTIVATE =====
  async function deactivateInstrument(id) {
    await supabase
      .from('questionnaires')
      .update({ active: false })
      .eq('id', id)

    loadData()
  }

  // ===== UI =====
  return (
    <main className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Instrumentos
      </h1>

      <div className="bg-white border p-4 mb-6">

        <input
          className="border p-2 w-full mb-2"
          placeholder="Nombre del instrumento"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Código del test"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
        />

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            className="border p-2 w-full"
            placeholder="Escala mínima"
            value={scaleMin}
            onChange={(e)=>setScaleMin(e.target.value)}
          />

          <input
            type="number"
            className="border p-2 w-full"
            placeholder="Escala máxima"
            value={scaleMax}
            onChange={(e)=>setScaleMax(e.target.value)}
          />
        </div>

        {/* SCALE LABELS */}
        <div className="mb-3">
          <p className="text-sm font-medium mb-2">
            Texto de cada nivel
          </p>
          {renderScaleInputs()}
        </div>

        {/* REACTIVOS */}
        <div className="mb-4">
          <p className="font-medium mb-2">Reactivos</p>

          {pairs.map((pair, index) => (
            <div key={index} className="border p-3 mb-3 bg-gray-50">

              <input
                className="border p-2 w-full mb-2"
                placeholder="Reactivo directo"
                value={pair.direct}
                onChange={(e) => updatePair(index, 'direct', e.target.value)}
              />

              <input
                className="border p-2 w-full mb-2"
                placeholder="Reactivo invertido"
                value={pair.inverted}
                onChange={(e) => updatePair(index, 'inverted', e.target.value)}
              />

              <button
                onClick={() => removePair(index)}
                className="text-red-600 text-sm"
              >
                Eliminar
              </button>

            </div>
          ))}

          <button
            onClick={addPair}
            className="bg-gray-200 px-3 py-1"
          >
            + Agregar reactivo
          </button>
        </div>

        <button
          onClick={saveInstrument}
          className="bg-black text-white px-4 py-2 w-full"
        >
          Guardar Instrumento
        </button>

      </div>

      {/* LISTA */}
      <div>

        <h2 className="font-bold mb-3">
          Instrumentos creados
        </h2>

        {list.map(item => (
          <div key={item.id} className="border p-3 mb-3 bg-white">

            <div className="font-bold">
              {item.name}
            </div>

            <div className="text-sm text-gray-600">
              Código: {item.test_code || '-'}
            </div>

            <div className="text-sm text-gray-600">
              Escala: {item.scale_min} - {item.scale_max}
            </div>

            <div className="text-sm text-gray-600">
              {item.scale_labels?.join(' | ')}
            </div>

            <button
              onClick={() => deactivateInstrument(item.id)}
              className="text-red-600 text-sm mt-2"
            >
              Desactivar
            </button>

          </div>
        ))}

      </div>

    </main>
  )
}
