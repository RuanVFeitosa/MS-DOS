<template>
  <div class="admin-overlay" @click.self="close">
    <div class="admin-modal">
      <!-- Cabeçalho -->
      <div class="modal-header">
        <h2>🔐 Painel Administrativo</h2>
        <button @click="close" class="close-btn">✕</button>
      </div>

      <!-- Conteúdo -->
      <div class="modal-body">
        <!-- Formulário de Adição -->
        <div class="admin-form">
          <h3>📤 Adicionar Novo Documento</h3>
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
          <button @click="addDocument" class="admin-btn add">📤 Adicionar</button>
        </div>

        <!-- Lista de Documentos -->
        <div class="document-section">
          <h3>📚 Documentos Atuais</h3>
          <div class="document-list">
            <div v-for="doc in documents" :key="doc.id" class="doc-item">
              <div class="doc-info">
                <span class="doc-name">📄 {{ doc.name }}</span>
                <span class="doc-meta">
                  {{ doc.content.length }} bytes • 
                  {{ formatDate(doc.createdAt) }}
                </span>
              </div>
              <div class="doc-actions">
                <button @click="editDocument(doc)" class="admin-btn edit">✏️</button>
                <button @click="deleteDocument(doc.id)" class="admin-btn delete">🗑️</button>
              </div>
            </div>
            <div v-if="documents.length === 0" class="empty">
              Nenhum documento disponível
            </div>
          </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="quick-actions">
          <button @click="loadExample" class="admin-btn example">📚 Carregar Exemplo</button>
          <button @click="clearAll" class="admin-btn clear">🧹 Limpar Todos</button>
          <button @click="exportDocuments" class="admin-btn export">💾 Exportar</button>
          <button @click="importDocuments" class="admin-btn import">📂 Importar</button>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleImport" 
            accept=".json"
            style="display: none"
          />
        </div>
      </div>

      <!-- Rodapé -->
      <div class="modal-footer">
        <span class="doc-count">Total: {{ documents.length }} documento(s)</span>
        <button @click="close" class="admin-btn close-modal">Fechar Painel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminModal',
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
    close() {
      this.$emit('close')
    },
    addDocument() {
      if (this.newDoc.name.trim() && this.newDoc.content.trim()) {
        this.$emit('add-document', {
          name: this.newDoc.name.trim(),
          content: this.newDoc.content.trim()
        })
        this.newDoc = { name: '', content: '' }
      } else {
        alert('Preencha o nome e o conteúdo do documento!')
      }
    },
    deleteDocument(id) {
      if (confirm('Tem certeza que deseja excluir este documento?')) {
        this.$emit('delete-document', id)
      }
    },
    editDocument(doc) {
      const newContent = prompt(`Editando: ${doc.name}\n\nDigite o novo conteúdo:`, doc.content)
      if (newContent !== null && newContent.trim()) {
        this.$emit('update-document', doc.id, newContent.trim())
      }
    },
    loadExample() {
      this.newDoc = {
        name: 'LIVRO_DOS_MORTOS.TXT',
        content: 'Capítulo 1: Os primeiros sinais...\n\nOs mortos começaram a andar na noite de Samhain. O portal entre os mundos se abriu...'
      }
    },
    clearAll() {
      if (confirm('⚠️ Tem certeza que deseja remover TODOS os documentos? Esta ação não pode ser desfeita!')) {
        this.documents.forEach(doc => {
          this.$emit('delete-document', doc.id)
        })
      }
    },
    exportDocuments() {
      const data = JSON.stringify(this.documents, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rpg-documents-${new Date().toISOString().slice(0,10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    importDocuments() {
      this.$refs.fileInput.click()
    },
    handleImport(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          if (Array.isArray(imported)) {
            imported.forEach(doc => {
              this.$emit('add-document', {
                name: doc.name,
                content: doc.content
              })
            })
            alert(`✅ ${imported.length} documento(s) importado(s) com sucesso!`)
          } else {
            alert('❌ Formato inválido. O arquivo deve conter um array de documentos.')
          }
        } catch (err) {
          alert('❌ Erro ao importar: ' + err.message)
        }
      }
      reader.readAsText(file)
      this.$refs.fileInput.value = ''
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR')
    }
  }
}
</script>

<style scoped>
/* Overlay - fundo escuro */
.admin-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Modal - janela principal */
.admin-modal {
  background: #1a1a1a;
  border: 2px solid #ff6600;
  border-radius: 12px;
  max-width: 800px;
  width: 95%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 60px rgba(255, 102, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Cabeçalho */
.modal-header {
  background: #111111;
  padding: 16px 24px;
  border-bottom: 2px solid #ff6600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
}

.modal-header h2 {
  color: #ff6600;
  font-size: 18px;
  font-family: 'Courier New', monospace;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #ff6600;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  transition: all 0.3s;
}

.close-btn:hover {
  color: #ff4444;
  transform: rotate(90deg);
}

/* Corpo */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* Formulário */
.admin-form {
  background: #0a0a0a;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #2a2a2a;
}

.admin-form h3 {
  color: #00ff00;
  font-size: 14px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.admin-input,
.admin-textarea {
  width: 100%;
  padding: 10px 12px;
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
  box-shadow: 0 0 15px rgba(255, 102, 0, 0.2);
}

.admin-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Botões */
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
  transform: scale(1.02);
}

.admin-btn.add {
  border-color: #00ff00;
  color: #00ff00;
  width: 100%;
  padding: 10px;
  font-weight: bold;
}

.admin-btn.add:hover {
  background: #00ff00;
  color: #000;
}

.admin-btn.edit {
  border-color: #00ccff;
  color: #00ccff;
  padding: 4px 8px;
  font-size: 12px;
}

.admin-btn.edit:hover {
  background: #00ccff;
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
  border-color: #ff8800;
  color: #ff8800;
}

.admin-btn.example:hover {
  background: #ff8800;
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

.admin-btn.export {
  border-color: #00ff88;
  color: #00ff88;
}

.admin-btn.export:hover {
  background: #00ff88;
  color: #000;
}

.admin-btn.import {
  border-color: #88ff00;
  color: #88ff00;
}

.admin-btn.import:hover {
  background: #88ff00;
  color: #000;
}

.admin-btn.close-modal {
  border-color: #666;
  color: #666;
  padding: 8px 24px;
}

.admin-btn.close-modal:hover {
  background: #666;
  color: #fff;
}

/* Lista de Documentos */
.document-section {
  margin: 20px 0;
}

.document-section h3 {
  color: #ff6600;
  font-size: 14px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.document-list {
  max-height: 250px;
  overflow-y: auto;
  background: #0a0a0a;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
}

.doc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #1a1a1a;
  transition: background 0.2s;
}

.doc-item:hover {
  background: #111111;
}

.doc-item:last-child {
  border-bottom: none;
}

.doc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-name {
  color: #00ff00;
  font-size: 14px;
  font-weight: bold;
}

.doc-meta {
  color: #006600;
  font-size: 11px;
}

.doc-actions {
  display: flex;
  gap: 6px;
}

.empty {
  color: #004400;
  text-align: center;
  padding: 30px;
  font-style: italic;
}

/* Ações Rápidas */
.quick-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #1a1a1a;
}

/* Rodapé */
.modal-footer {
  background: #111111;
  padding: 12px 24px;
  border-top: 2px solid #ff6600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 12px 12px;
}

.doc-count {
  color: #006600;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

/* Scrollbar personalizada */
.modal-body::-webkit-scrollbar,
.document-list::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track,
.document-list::-webkit-scrollbar-track {
  background: #000000;
}

.modal-body::-webkit-scrollbar-thumb,
.document-list::-webkit-scrollbar-thumb {
  background: #ff6600;
  border-radius: 3px;
}
</style>