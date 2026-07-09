<template>
  <div class="admin-panel">
    <h3>🔐 Painel de Administração</h3>
    
    <div class="admin-form">
      <input 
        v-model="newDoc.name" 
        placeholder="Nome do documento (ex: MAPA.TXT)"
        class="admin-input"
      />
      <textarea 
        v-model="newDoc.content" 
        placeholder="Conteúdo do documento..."
        rows="4"
        class="admin-textarea"
      ></textarea>
      <button @click="addDocument" class="admin-btn add">📤 Adicionar Documento</button>
    </div>

    <div class="document-list">
      <h4>Documentos Atuais:</h4>
      <div v-for="doc in documents" :key="doc.id" class="doc-item">
        <span class="doc-name">📄 {{ doc.name }}</span>
        <span class="doc-size">{{ doc.content.length }} bytes</span>
        <button @click="deleteDocument(doc.id)" class="admin-btn delete">🗑️</button>
      </div>
      <div v-if="documents.length === 0" class="empty">
        Nenhum documento disponível
      </div>
    </div>

    <div class="admin-actions">
      <button @click="loadExample" class="admin-btn example">📚 Carregar Exemplo</button>
      <button @click="clearAll" class="admin-btn clear">🧹 Limpar Todos</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  props: {
    documents: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      newDoc: {
        name: '',
        content: ''
      }
    }
  },
  methods: {
    addDocument() {
      if (this.newDoc.name.trim() && this.newDoc.content.trim()) {
        this.$emit('add-document', {
          name: this.newDoc.name.trim(),
          content: this.newDoc.content.trim()
        })
        this.newDoc = { name: '', content: '' }
      }
    },
    deleteDocument(id) {
      if (confirm('Tem certeza que deseja excluir este documento?')) {
        this.$emit('delete-document', id)
      }
    },
    loadExample() {
      this.newDoc = {
        name: 'LIVRO_DOS_MORTOS.TXT',
        content: 'Capítulo 1: Os primeiros sinais...\n\nOs mortos começaram a andar na noite de Samhain...'
      }
    },
    clearAll() {
      if (confirm('Tem certeza que deseja remover TODOS os documentos?')) {
        this.documents.forEach(doc => {
          this.$emit('delete-document', doc.id)
        })
      }
    }
  }
}
</script>

<style scoped>
.admin-panel {
  padding: 20px;
  background: #0a0a0a;
  border-top: 2px solid #ff6600;
}

.admin-panel h3 {
  color: #ff6600;
  margin-bottom: 15px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.admin-panel h4 {
  color: #ff6600;
  margin: 15px 0 10px 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.admin-form {
  margin-bottom: 20px;
}

.admin-input,
.admin-textarea {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 10px;
  background: #000000;
  border: 1px solid #ff6600;
  color: #ff6600;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.admin-input:focus,
.admin-textarea:focus {
  outline: none;
  border-color: #ff8800;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.2);
}

.admin-textarea {
  resize: vertical;
  min-height: 80px;
}

.admin-btn {
  padding: 8px 16px;
  border: 1px solid #ff6600;
  background: transparent;
  color: #ff6600;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  margin-right: 8px;
}

.admin-btn:hover {
  background: #ff6600;
  color: #000;
}

.admin-btn.add {
  border-color: #00ff00;
  color: #00ff00;
}

.admin-btn.add:hover {
  background: #00ff00;
  color: #000;
}

.admin-btn.delete {
  border-color: #ff4444;
  color: #ff4444;
  padding: 4px 8px;
  font-size: 12px;
}

.admin-btn.delete:hover {
  background: #ff4444;
  color: #000;
}

.admin-btn.example {
  border-color: #00ccff;
  color: #00ccff;
}

.admin-btn.example:hover {
  background: #00ccff;
  color: #000;
}

.admin-btn.clear {
  border-color: #ff4444;
  color: #ff4444;
}

.admin-btn.clear:hover {
  background: #ff4444;
  color: #000;
}

.document-list {
  margin: 15px 0;
  max-height: 200px;
  overflow-y: auto;
}

.doc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid #1a1a1a;
  color: #00ff00;
  font-size: 14px;
}

.doc-item:hover {
  background: #0a0a0a;
}

.doc-name {
  flex: 1;
}

.doc-size {
  color: #006600;
  font-size: 12px;
  margin-right: 10px;
}

.empty {
  color: #004400;
  text-align: center;
  padding: 15px;
  font-style: italic;
}

.admin-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
}
</style>