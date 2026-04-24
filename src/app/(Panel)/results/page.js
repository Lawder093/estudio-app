'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Papa from 'papaparse'

export default function ResultsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [])

  async function loadResults() {
    setLoading(true)

    const { data: responses } = await supabase
      .from('responses')
      .select(`
        id,
        test_type,
        created_at,
        participants (
          code,
          full_name
        ),
        questionnaires (
          name
        )
      `)
      .order('id', { ascending: false })

    const finalRows = []

    for (const item of responses || []) {
      const { data: answers } = await supabase
        .from('response_answers')
        .select(`
          score,
          questions (
            order_number
          )
        `)
        .eq('response_id', item.id)

      const row = {
        codigo: item.participants?.code || '',
        nombre: item.participants?.full_name || '',
        instrumento: item.questionnaires?.name || '',
        tipo_test: item.test_type,
        fecha: item.created_at
      }

      answers?.forEach((a) => {
        row[`pregunta_${a.questions.order_number}`] = a.score
      })

      finalRows.push(row)
    }

    setRows(finalRows)
    setLoading(false)
  }

  function exportCSV() {
    const csv = Papa.unparse(rows)

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'resultados.csv'
    link.click()
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">
        Resultados
      </h1>

      <button
        onClick={exportCSV}
        className="bg-black text-white px-4 py-2 mb-6"
      >
        Exportar CSV
      </button>

      {loading && <p>Cargando...</p>}

      {!loading && (
        <div className="overflow-auto border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                {rows[0] &&
                  Object.keys(rows[0]).map((key) => (
                    <th key={key} className="p-2">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t">
                  {Object.values(row).map((val, x) => (
                    <td key={x} className="p-2">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </main>
  )
}