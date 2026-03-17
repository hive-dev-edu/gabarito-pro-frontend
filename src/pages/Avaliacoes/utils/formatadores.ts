export function formatarData(dataIso?: string) {
  if (!dataIso) return '-'

  const data = new Date(dataIso)

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(data)
}

export function formatarDataParaInput(dataIso?: string) {
  if (!dataIso) return ''

  const data = new Date(dataIso)

  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

export function normalizarData(data: string) {
  return `${data}T12:00:00`
}