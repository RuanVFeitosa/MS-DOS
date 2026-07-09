<template>
  <div class="command-line-container">
    <div class="command-line">
      <span class="prompt">C:\></span>
      <input
        ref="input"
        type="text"
        v-model="command"
        @keyup.enter="sendCommand"
        :disabled="disabled"
        placeholder="Digite um comando..."
        class="command-input"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommandLine',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['command'],
  data() {
    return {
      command: ''
    }
  },
  methods: {
    sendCommand() {
      if (this.command.trim() && !this.disabled) {
        this.$emit('command', this.command)
        this.command = ''
      }
    },
    focus() {
      this.$refs.input?.focus()
    }
  },
  mounted() {
    this.focus()
    document.addEventListener('click', () => this.focus())
  }
}
</script>

<style scoped>
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
}

.command-input:disabled {
  color: #004400;
  cursor: not-allowed;
}

.command-input::placeholder {
  color: #004400;
}
</style>