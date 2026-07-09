<template>
  <div class="terminal-screen" ref="terminalScreen">
    <div v-for="(line, index) in lines" :key="index" :class="['line', line.type]">
      {{ line.text }}
    </div>
    <div v-if="currentCommand" class="line command-current">
      C:\> {{ currentCommand }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TerminalScreen',
  props: {
    lines: {
      type: Array,
      default: () => []
    },
    currentCommand: {
      type: String,
      default: ''
    }
  },
  methods: {
    scrollToBottom() {
      const el = this.$refs.terminalScreen
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    }
  },
  watch: {
    lines: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped>
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
</style>