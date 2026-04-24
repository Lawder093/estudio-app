'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ApplyTestPage() {
  const [participants, setParticipants] = useState([])
  const [questionnaires, setQuestionnaires] = useState([])
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})

  const [participantId, setParticipantId] = useState('')
  const [questionnaireId, setQuestionnaireId] = useState('')
  const [testType, setTestType] = useState('pre')

  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    const { data: p } = await supabase
      .from('participants')
      .select('id, full_name, code')
      .order('full_name')

    const { data: q } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: false })

    setParticipants(p || [])
    setQuestionnaires(q || [])
  }

  async function loadQuestions(id) {
    setQuestionnaireId(id)

    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('questionnaire_id', id)
      .order('order_number')

    setQuestions(data || [])
    setAnswers({})
  }

  function setScore(questionId, value) {
    setAnswers({
      ...answers,
      [questionId]: value
    })
  }

  async function saveTest() {
    if (!participantId || !questionnaireId) {
      return alert('Faltan datos')
    }

    const { data: existing } = await supabase
      .from('responses')
      .select('id')
      .eq('participant_id', participantId)
      .eq('questionnaire_id', questionnaireId)
      .eq('test_type', testType)

    if (existing.length > 0) {
      return alert('Ese test ya fue aplicado')
    }

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('responses')
      .insert([
        {
          participant_id: participantId,
          questionnaire_id: questionnaireId,
          test_type: testType,
          evaluator_email: user?.email || ''
        }
      ])
      .select()

    if (error) return alert(error.message)

    const responseId = data[0].id

    const rows = Object.entries(answers).map(
      ([questionId, score]) => ({
        response_id: responseId,
        question_id: Number(questionId),
        score: Number(score)
      })
    )

    await supabase
      .from('response_answers')
      .insert(rows)

    alert('Test guardado correctamente')

    setQuestions([])
    setAnswers({})
    setParticipantId('')
    setQuestionnaireId('')
    setTestType('pre')
  }

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">
        Aplicar Test
      </h1>

      <div className="grid gap-3 mb-6">

        <select
          className="border p-2"
          value={participantId}
          onChange={(e)=>setParticipantId(e.target.value)}
        >
          <option value="">Selecciona participante</option>

          {participants.map(item => (
            <option key={item.id} value={item.id}>
              {item.code} - {item.full_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          value={questionnaireId}
          onChange={(e)=>loadQuestions(e.target.value)}
        >
          <option value="">Selecciona instrumento</option>

          {questionnaires.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          value={testType}
          onChange={(e)=>setTestType(e.target.value)}
        >
          <option value="pre">Pre-test</option>
          <option value="post">Post-test</option>
        </select>

      </div>

      {questions.map(q => (
        <div key={q.id} className="border p-4 mb-3 bg-white">
          <p className="mb-3 font-medium">
            {q.order_number}. {q.question_text}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

            {[1,2,3,4].map(value => (
              <button
                key={value}
                onClick={() => setScore(q.id, value)}
                className={`border p-2 ${
                  answers[q.id] == value
                    ? 'bg-black text-white'
                    : 'bg-white'
                }`}
              >
                {value}
              </button>
            ))}

          </div>
        </div>
      ))}

      {questions.length > 0 && (
        <button
          onClick={saveTest}
          className="bg-black text-white px-6 py-3 mt-4"
        >
          Guardar Test
        </button>
      )}
    </main>
  )
} 