import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

// Estilo por defecto acorde al tema oscuro de la aplicación
ChartJS.defaults.color = '#c3c2b7'
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.08)'
ChartJS.defaults.font.family = "'Roboto', sans-serif"
