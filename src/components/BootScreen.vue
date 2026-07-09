<template>
  <div class="boot-screen" tabindex="0" @click="handleFirstInteraction" @keydown="handleFirstInteraction">
    <div class="boot-content">
      <pre class="ascii-logo">{{ asciiArt }}</pre>
      <div class="boot-messages">
        <div v-for="(msg, index) in visibleMessages" :key="index" class="boot-msg">
          {{ msg }}
        </div>
      </div>
      <div class="boot-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
      <div class="boot-footer">
        <span v-if="progress < 100" class="blink">█ Inicializando...</span>
        <span v-else-if="!readyToContinue" class="blink" style="color: #00ff00;">✅ Sistema pronto! Pressione qualquer tecla para continuar...</span>
        <span v-else class="blink" style="color: #00ff00;">▶️ Pressione qualquer tecla para acessar o terminal...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { audio } from '../services/audio'

const emit = defineEmits(['boot-complete'])

const progress = ref(0)
const messages = [
  'Inicializando sistema MS-DOS 6.22...',
  'Carregando drivers de disco...',
  'Verificando memória RAM... 640K OK',
  'Carregando interfaces de documentos...',
  'Conectando ao servidor...',
  'Preparando terminal...'
]
const visibleMessages = ref<string[]>([])
const readyToContinue = ref(false)
const firstInteraction = ref(false) // controle para tocar áudio uma vez
let progressInterval: number | null = null
let msgIndex = 0

const asciiArt = `≈∞≈∞≈≈                                              
                                            ≠∞        ≈π                                            
                                         ≈ ≈            ≈                                           
                                          ≈              ∞                                          
                                         ∞                ∞                                         
                ∞√≠≠≠≠≈≠≠≈∞√≈≠≈∞∞√∞≈≈≈≈∞≈√∞               ≈≠∞∞∞√∞√√√∞≈≈≈≠≠≠≠≈∞√√√∞π                 
                                          ∞              ∞                       ≈                  
                 ∞  ∞                      √            ≈                       ≈                   
                     ≈                     ≈∞≈√        √∞                      √                    
                      ∞                        π ∞ √√                         √                     
                      ∞√ ∞              ∞                  ∞                 π                      
                        ∞ ∞                                                 √                       
                         ≈ ≈                                 √∞                                     
                        ∞ ≈         ∞         ∞   √  ∞        √√                                    
                         ∞ √       ∞√      ≈      √     ∞      π∞     ≈                             
                          ≈ √     ≈∞         ∞        ∞         π    ∞ ≈∞∞                          
                         √ ≠√≈∞π√≈π              √π              π  √∞≈∞≈                           
                        ≈≈       ∞≠√    ≈       √  π             ∞∞    ≈   ≠                        
                       ≠            ∞         ππ    √π√        π≈             ≈                     
                     ∞∞              √  ≈        √            ≈√             ≈ ≈                    
                    ≈ ≠              ∞≈          π√           ≈              ∞∞ =                   
                    ∞ ≠               ∞      ∞                ∞              ≈≈ ≠                   
                      ∞              ∞     ∞   ∞  ≈ ∞         ∞∞             ≈ ∞                    
                     ≈ ≈            ≈            ∞             √∞             ∞                     
                         ∞        ∞π ≠                        ∞ ∞√∞        ≈ ≈                      
                            ∞≈∞∞∞ ∞ ∞ ≠∞                     π ≈ ∞   ∞∞∞≈  ≈                        
                             ≈       √∞=√                  ≈∞√∞                                     
                                      ∞ √∞                ≈∞ √                                      
                                       ≈ ∞∞              ∞√ ≈                                       
                                        ≈ ≈             ≈≈ ≈                                        
                                           ∞            ∞ ≈                                         
                                                         ∞                                          
                                              ∞                                                     
                                               π    ∞                                               
                                                ≈  ∞                                                
                                                 π∞                                                 
                                                ∞                                                   
                                                 ∞∞`

const boot = () => {
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 1
      if (progress.value % 14 === 0 && msgIndex < messages.length) {
        visibleMessages.value.push(messages[msgIndex] ?? '')
        msgIndex++
      }
    } else {
      if (progressInterval) clearInterval(progressInterval)
      // Não toca áudio aqui, será tocado na primeira interação
      readyToContinue.value = true
    }
  }, 35)
}

// Primeira interação do usuário (clique ou tecla)
const handleFirstInteraction = () => {
  if (!firstInteraction.value) {
    firstInteraction.value = true
    // Resume o AudioContext e toca os sons
    audio.resume()
    audio.playBoot()
    setTimeout(() => {
      audio.playSuccess()
      setTimeout(() => {
        audio.playReady()
      }, 500)
    }, 300)
  }
}

// Aguarda qualquer tecla para continuar (após o boot completo)
const handleKeyPress = (event: KeyboardEvent) => {
  if (readyToContinue.value) {
    emit('boot-complete')
  }
}

const handleClick = () => {
  if (readyToContinue.value) {
    emit('boot-complete')
  }
}

onMounted(() => {
  boot()
  // Adiciona eventos para capturar teclas e cliques
  window.addEventListener('keydown', handleKeyPress)
  window.addEventListener('click', handleClick)
  // Foca no elemento para capturar eventos de tecla
  const el = document.querySelector('.boot-screen') as HTMLElement
  if (el) el.focus()
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
  window.removeEventListener('keydown', handleKeyPress)
  window.removeEventListener('click', handleClick)
})
</script>

<style scoped>
.boot-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  overflow: hidden;
  outline: none;
  cursor: default;
}

.boot-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

.ascii-logo {
  font-size: clamp(0.35rem, 0.7vw, 1.1rem);
  line-height: 1.0;
  color: #00ff00;
  text-align: center;
  margin: 0;
  padding: 0;
  white-space: pre;
  font-family: 'Courier New', monospace;
  max-width: 100%;
  max-height: 55vh;
  overflow: hidden;
  text-shadow: 0 0 10px rgba(255, 204, 0, 0.15);
}

.boot-messages {
  min-height: 100px;
  text-align: center;
  padding: 8px 20px;
  margin: 8px 0;
  font-size: clamp(0.8rem, 1.1vw, 1.1rem);
  color: #00ff00;
}

.boot-msg {
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.boot-progress {
  width: 55%;
  max-width: 450px;
  margin: 8px auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 18px;
  background: #000;
  border: 1px solid #00ff00;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #00ff00;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.progress-text {
  font-size: 13px;
  min-width: 40px;
  text-align: right;
  color: #00ff00;
}

.boot-footer {
  margin-top: 8px;
  font-size: clamp(0.8rem, 1.1vw, 1.1rem);
}

.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Responsividade */
@media (max-width: 768px) {
  .ascii-logo {
    font-size: clamp(0.25rem, 0.5vw, 0.6rem);
  }
  .boot-messages {
    min-height: 70px;
    font-size: 0.75rem;
  }
  .boot-progress {
    width: 70%;
  }
}

@media (max-width: 480px) {
  .ascii-logo {
    font-size: clamp(0.15rem, 0.4vw, 0.4rem);
  }
  .boot-messages {
    min-height: 50px;
    font-size: 0.65rem;
  }
  .boot-progress {
    width: 80%;
  }
}
</style>