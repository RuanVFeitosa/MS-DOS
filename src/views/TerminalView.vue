<template>
  <div class="terminal-page">
    <div class="terminal-wrapper">
      <div class="terminal-container">
        <!-- Cabeçalho -->
        <div class="terminal-header">
          <span class="terminal-title">MS-DOS 6.13</span>
          <div class="terminal-controls">
          </div>
        </div>

        <!-- Tela -->
        <div class="terminal-screen" ref="terminalScreen">
          <div v-for="(line, index) in terminalLines" :key="index" :class="['line', line.type]">
            {{ line.text }}
          </div>
          <div v-if="currentCommand" class="line command-current">
            C:\> {{ currentCommand }}
          </div>
        </div>

        <!-- Linha de Comando -->
        <div class="command-line-container">
          <div class="command-line">
            <span class="prompt">C:\></span>
            <input
              ref="commandInput"
              type="text"
              v-model="command"
              @keydown="onKeyDown"
              @keyup="onKeyUp"
              @input="onInput"
              @keyup.enter="executeCommand"
              placeholder="Digite um comando..."
              class="command-input"
              autofocus
            />
          </div>
        </div>

        <!-- Status Bar -->
        <div class="status-bar">
          <span>🕒 {{ currentTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { audio } from '../services/audio'

// Tipos
interface Document {
  id: number
  name: string
  content: string
  createdAt: string
}

interface TerminalLine {
  type: 'system' | 'command' | 'info' | 'error' | 'content'
  text: string
}

// Estado
const documents = ref<Document[]>([])
const terminalLines = ref<TerminalLine[]>([
  { type: 'system', text: 'MS-DOS 6.13' },
  { type: 'system', text: 'Digite HELP para lista de comandos' },
  { type: 'system', text: '---' }
])
const currentCommand = ref('')
const command = ref('')
const currentTime = ref('')
const terminalScreen = ref<HTMLDivElement | null>(null)
const commandInput = ref<HTMLInputElement | null>(null)

// Funções
const scrollToBottom = () => {
  nextTick(() => {
    if (terminalScreen.value) {
      terminalScreen.value.scrollTop = terminalScreen.value.scrollHeight
    }
  })
}

// --- ÁUDIO ---
const onKeyDown = (event: KeyboardEvent) => {
  // Toca som para teclas imprimíveis (exceto Enter que é tratado separadamente)
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
    audio.playKeyPress()
  }
}

const onKeyUp = (event: KeyboardEvent) => {
  // Não faz nada especial, mas mantido para consistência
}

// --- FORÇAR MAIÚSCULAS ---
const onInput = () => {
  // Converte para maiúsculas e atualiza o modelo
  const upper = command.value.toUpperCase()
  if (command.value !== upper) {
    command.value = upper
  }
}

// --- EXECUTAR COMANDO ---
const executeCommand = () => {
  const cmd = command.value.trim()
  if (!cmd) return

  // Toca som de Enter
  audio.playEnter()

  const cmdUpper = cmd // já está em maiúsculas
  const args = cmdUpper.split(' ')
  const mainCmd = args[0]

  terminalLines.value.push({ type: 'command', text: `C:\\> ${cmd}` })
  command.value = ''

  switch(mainCmd) {
    case 'HELP':
      terminalLines.value.push(
        { type: 'info', text: 'Comandos disponíveis:' },
        { type: 'info', text: '  HELP     - Mostra esta ajuda' },
        { type: 'info', text: '  DIR      - Lista documentos disponíveis' },
        { type: 'info', text: '  TYPE     - Visualiza um documento' },
        { type: 'info', text: '  CLS      - Limpa a tela' },
        { type: 'info', text: '  DATE     - Mostra data atual' },
        { type: 'info', text: '  TIME     - Mostra hora atual' },
        { type: 'info', text: '  VER      - Mostra versão do sistema' },
        { type: 'info', text: '  USER   - Mostra usuário atual' }
      )
      break
    case 'DIR':
      if (documents.value.length === 0) {
        terminalLines.value.push({ type: 'info', text: 'Nenhum documento encontrado.' })
      } else {
        terminalLines.value.push({ type: 'info', text: 'Documentos disponíveis:' })
        documents.value.forEach(doc => {
          const size = doc.content ? doc.content.length : 0
          terminalLines.value.push({ type: 'info', text: `  ${doc.name.padEnd(20)} ${size} bytes` })
        })
        terminalLines.value.push({ type: 'info', text: `${documents.value.length} documento(s)` })
      }
      break
    case 'TYPE':
      if (args.length > 1) {
        const docName = args.slice(1).join(' ')
        const doc = documents.value.find(d => d.name.toUpperCase() === docName.toUpperCase())
        if (doc) {
          terminalLines.value.push({ type: 'system', text: `--- ${doc.name} ---` })
          terminalLines.value.push({ type: 'content', text: doc.content })
          terminalLines.value.push({ type: 'system', text: '---' })
        } else {
          terminalLines.value.push({ type: 'error', text: `Documento não encontrado: ${docName}` })
          audio.playError() // Som de erro
        }
      } else {
        terminalLines.value.push({ type: 'error', text: 'Erro: Especifique o nome do documento' })
        audio.playError()
      }
      break
    case 'CLS':
      terminalLines.value = []
      break
    case 'DATE':
      terminalLines.value.push({ type: 'info', text: `Data atual: ${new Date().toLocaleDateString()}` })
      break
    case 'TIME':
      terminalLines.value.push({ type: 'info', text: `Hora atual: ${new Date().toLocaleTimeString()}` })
      break
    case 'VER':
      terminalLines.value.push({ type: 'info', text: 'MS-DOS 6.13' })
      break
    case 'USER':
      terminalLines.value.push({ type: 'info', text: 'Usuário: 1306' })
      break
    default:
      audio.playError() // Som de erro
      terminalLines.value.push({ type: 'error', text: `Comando não reconhecido: ${mainCmd}` })
  }

  scrollToBottom()
}

// --- CARREGAR DOCUMENTOS ---
const loadDocuments = () => {
  try {
    const saved = localStorage.getItem('rpg-documents')
    if (saved) {
      documents.value = JSON.parse(saved)
    } else {
      documents.value = [
        {
          id: 1,
          name: 'MAPA_DO_REINO.TXT',
          content: 'O Reino de Eldoria se estende por 500 léguas ao norte da Floresta Sombria. O Monte do Dragão se ergue no centro do reino, guardando segredos ancestrais.',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'PROFECIA.TXT',
          content: 'Quando as três luas se alinharem sobre o Monte do Dragão, o herói despertará e os cristais elementais brilharão novamente.',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'CARTA_DO_REI.TXT',
          content: 'Nobre aventureiro,\n\nPrecisamos de sua ajuda. O reino está em perigo e somente você pode nos salvar. Venha ao castelo imediatamente.',
          createdAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('rpg-documents', JSON.stringify(documents.value))
    }
  } catch (e) {
    console.error('Erro ao carregar documentos:', e)
  }
}

// --- RELÓGIO ---
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString()
}

// --- LIFECYCLE ---
onMounted(() => {
  loadDocuments()
  updateTime()
  setInterval(updateTime, 1000)
  nextTick(() => {
    commandInput.value?.focus()
  })
})
</script>

<style scoped>
.terminal-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0a0a0a;
  padding: 20px;
}

.terminal-wrapper {
  width: 100%;
  max-width: 900px;
}

.terminal-container {
  background: #1a1a1a;
  border: 3px solid #00ff00;
  border-radius: 8px;
  padding: 0;
  width: 100%;
  box-shadow: 0 0 50px rgba(0, 255, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.terminal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.1) 2px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
  z-index: 10;
  border-radius: 8px;
}

.terminal-header {
  background: #111111;
  padding: 10px 20px;
  border-bottom: 2px solid #00ff00;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.terminal-title {
  color: #00ff00;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.terminal-screen {
  background: #000000;
  padding: 20px;
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
  font-size: 15px;
  line-height: 1.8;
  font-family: 'Courier New', monospace;
  scrollbar-width: thin;
  scrollbar-color: #00ff00 #000000;
}

.terminal-screen::-webkit-scrollbar {
  width: 8px;
}

.terminal-screen::-webkit-scrollbar-track {
  background: #000000;
}

.terminal-screen::-webkit-scrollbar-thumb {
  background: #00ff00;
  border-radius: 4px;
}

.line {
  padding: 2px 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.line.system {
  color: #008800;
}

.line.command {
  color: #00ff00;
  font-weight: bold;
}

.line.command-current {
  color: #00ff00;
  font-weight: bold;
  animation: blink 1s step-end infinite;
}

.line.info {
  color: #00ccff;
}

.line.error {
  color: #ff4444;
}

.line.content {
  color: #ffffff;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.command-line-container {
  padding: 0 20px 15px 20px;
  background: #000000;
}

.command-line {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #000000;
  padding: 8px 12px;
  border: 1px solid #003300;
  border-radius: 4px;
}

.prompt {
  color: #00ff00;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

.command-input {
  background: transparent;
  border: none;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 15px;
  outline: none;
  flex: 1;
  caret-color: #00ff00;
  text-transform: uppercase; /* Força visual maiúsculo */
}

.command-input::placeholder {
  color: #004400;
  text-transform: none; /* Placeholder em minúsculo */
}

.status-bar {
  background: #111111;
  padding: 6px 20px;
  border-top: 1px solid #003300;
  display: flex;
  justify-content: flex-end;
  color: #006600;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}
</style>