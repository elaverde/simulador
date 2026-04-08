import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function fmt(value) {
  return '$ ' + parseFloat(value || 0).toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function generarPDF(credito, chartImages) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 14

  // ── Encabezado ──────────────────────────────────────────────────────────────
  doc.setFillColor(25, 118, 210)
  doc.rect(0, 0, pageW, 26, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Simulación de Crédito', margin, 17)

  // ── Resumen ──────────────────────────────────────────────────────────────────
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumen del Préstamo', margin, 36)

  doc.setDrawColor(200, 200, 200)
  doc.line(margin, 38, pageW - margin, 38)

  const cuotaMensual = credito.simulacion?.[1]?.cuota ?? 0
  const tasaMensualPct = (credito.tasa.mensual * 100).toFixed(4)
  const ahorro = credito.interesTotalSinAbonos - credito.interesTotal

  const colA = margin
  const colB = colA + 72
  const colC = pageW / 2 + 6
  const colD = colC + 52

  const filas = [
    [['Monto del préstamo', fmt(credito.monto)], ['Cuota mensual', fmt(cuotaMensual)]],
    [['Plazo', `${credito.plazo} meses`], ['Total a pagar', fmt(credito.valorFuturo)]],
    [[`Tasa ${credito.periodo}`, `${credito.tasa.anual}%`], ['Total intereses (con abonos)', fmt(credito.interesTotal)]],
    [['Tasa mensual efectiva', `${tasaMensualPct}%`], ['Ahorro con abonos extra', fmt(ahorro > 0 ? ahorro : 0)]],
  ]

  let y = 46
  filas.forEach(([izq, der]) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(izq[0], colA, y)
    doc.text(der[0], colC, y)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(30, 30, 30)
    doc.text(izq[1], colB, y, { align: 'right' })
    doc.text(der[1], colD, y, { align: 'right' })
    y += 10
  })

  // ── Gráficas ─────────────────────────────────────────────────────────────────
  const chartY = y + 4
  const chartH = 58
  const chartW = (pageW - margin * 2 - 6) / 2

  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'bold')
  doc.text('Evolución Interés / Abonos', colA, chartY - 1)
  doc.text('Composición de la Deuda', colA + chartW + 6, chartY - 1)

  if (chartImages?.line) {
    doc.addImage(chartImages.line, 'PNG', colA, chartY + 2, chartW, chartH)
  }
  if (chartImages?.bar) {
    doc.addImage(chartImages.bar, 'PNG', colA + chartW + 6, chartY + 2, chartW, chartH)
  }

  // ── Tabla de amortización (página 2) ─────────────────────────────────────────
  doc.addPage()

  doc.setFillColor(25, 118, 210)
  doc.rect(0, 0, pageW, 18, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Tabla de Amortización', margin, 12)

  autoTable(doc, {
    startY: 24,
    head: [['#', 'Cuota', 'Principal', 'Interés', 'Abono Capital', 'Saldo']],
    body: credito.simulacion.slice(1).map((item) => [
      item.periodo,
      fmt(item.cuota),
      fmt(item.principal),
      fmt(item.interes),
      fmt(item.abono || 0),
      fmt(item.saldo),
    ]),
    headStyles: {
      fillColor: [25, 118, 210],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'right',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
    },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    styles: { fontSize: 8, cellPadding: 2.5 },
    margin: { left: margin, right: margin },
  })

  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Página ${i} de ${pageCount}  ·  Generado el ${new Date().toLocaleDateString('es-ES')}`,
      pageW - margin,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'right' }
    )
  }

  doc.save('simulacion-credito.pdf')
}
