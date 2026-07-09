<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- Cabeçalho -->
      <div class="admin-header">
        <h1>🔐 Painel Administrativo</h1>
        <div class="admin-nav">
          <a href="/" class="back-link">← Voltar ao Terminal</a>
          <span class="admin-badge">👑 ADMIN</span>
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="admin-content">
        <!-- Formulário -->
        <div class="admin-card">
          <h2>📤 Adicionar Documento</h2>
          <div class="form-group">
            <label>Nome do Documento</label>
            <input 
              v-model="newDoc.name" 
              placeholder="Ex: MAPA_DO_TESOURO.TXT"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Conteúdo</label>
            <textarea 
              v-model="newDoc.content" 
              placeholder="Digite o conteúdo do documento..."
              rows="5"
              class="form-textarea"
            ></textarea>
          </div>
          <button @click="addDocument" class="btn-add">📤 Adicionar Documento</button>
        </div>

        <!-- Lista de Documentos -->
        <div class="admin-card">
          <div class="card-header">
            <h2>📚 Documentos ({{ documents.length }})</h2>
            <div class="card-actions">
              <button @click="loadExample" class="btn-example">📚 Exemplo</button>
              <button @click="clearAll" class="btn-danger">🧹 Limpar</button>
              <button @click="exportDocuments" class="btn-export">💾 Exportar</button>
              <button @click="importDocuments" class="btn-import">📂 Importar</button>
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleImport" 
                accept=".json"
                style="display: none"
              />
            </div>
          </div>

          <div class="document-grid">
            <div v-for="doc in documents" :key="doc.id" class="doc-card">
              <div class="doc-header">
                <span class="doc-name">📄 {{ doc.name }}</span>
                <span class="doc-size">{{ doc.content.length }} bytes</span>
              </div>
              <div class="doc-preview">{{ doc.content.slice(0, 100) }}{{ doc.content.length > 100 ? '...' : '' }}</div>
              <div class="doc-meta">
                <span>🕒 {{ formatDate(doc.createdAt) }}</span>
              </div>
              <div class="doc-actions">
                <button @click="editDocument(doc)" class="btn-edit">✏️ Editar</button>
                <button @click="deleteDocument(doc.id)" class="btn-delete">🗑️ Excluir</button>
              </div>
            </div>
            <div v-if="documents.length === 0" class="empty-state">
              <p>📭 Nenhum documento disponível</p>
              <p style="color: #666; font-size: 12px;">Adicione um documento usando o formulário acima</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Document {
  id: number
  name: string
  content: string
  createdAt: string
}

const documents = ref<Document[]>([])
const newDoc = ref({
  name: '',
  content: ''
})
const fileInput = ref<HTMLInputElement | null>(null)

const loadDocuments = () => {
  try {
    const saved = localStorage.getItem('rpg-documents')
    if (saved) {
      documents.value = JSON.parse(saved)
    } else {
      documents.value = []
    }
  } catch (e) {
    console.error('Erro ao carregar documentos:', e)
  }
}

const saveDocuments = () => {
  try {
    localStorage.setItem('rpg-documents', JSON.stringify(documents.value))
  } catch (e) {
    console.error('Erro ao salvar documentos:', e)
  }
}

const addDocument = () => {
  if (!newDoc.value.name.trim() || !newDoc.value.content.trim()) {
    alert('❌ Preencha o nome e o conteúdo do documento!')
    return
  }

  const existing = documents.value.find(d => 
    d.name.toUpperCase() === newDoc.value.name.trim().toUpperCase()
  )
  
  if (existing) {
    alert(`❌ O documento "${newDoc.value.name}" já existe!`)
    return
  }

  documents.value.push({
    id: Date.now(),
    name: newDoc.value.name.trim().toUpperCase(),
    content: newDoc.value.content.trim(),
    createdAt: new Date().toISOString()
  })

  saveDocuments()
  newDoc.value = { name: '', content: '' }
  alert(`✅ Documento adicionado com sucesso!`)
}

const editDocument = (doc: Document) => {
  const newContent = prompt(
    `Editando: ${doc.name}\n\nDigite o novo conteúdo:`,
    doc.content
  )
  
  if (newContent !== null && newContent.trim()) {
    doc.content = newContent.trim()
    saveDocuments()
    alert(`✅ Documento "${doc.name}" atualizado!`)
  }
}

const deleteDocument = (id: number) => {
  const doc = documents.value.find(d => d.id === id)
  if (doc && confirm(`Tem certeza que deseja excluir "${doc.name}"?`)) {
    documents.value = documents.value.filter(d => d.id !== id)
    saveDocuments()
    alert(`🗑️ Documento "${doc.name}" removido!`)
  }
}

const clearAll = () => {
  if (confirm('⚠️ Tem certeza que deseja remover TODOS os documentos?')) {
    documents.value = []
    saveDocuments()
    alert('🧹 Todos os documentos foram removidos!')
  }
}

const loadExample = () => {
  newDoc.value = {
    name: 'LIVRO_DOS_MORTOS.TXT',
    content: `Capítulo 1: Os primeiros sinais

Os mortos começaram a andar na noite de Samhain. O portal entre os mundos se abriu quando a lua sangrenta pairou sobre o Monte dos Corvos.

Os sábios dizem que apenas o Herói das Cinco Luas poderá fechar o portal antes que o exército dos mortos-vivos invada o reino de Eldoria.

Para isso, será necessário encontrar os cinco cristais elementais espalhados pelos confins do mundo conhecido.`
  }
}

const exportDocuments = () => {
  if (documents.value.length === 0) {
    alert('📭 Não há documentos para exportar!')
    return
  }

  const data = JSON.stringify(documents.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rpg-documents-${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  alert('💾 Documentos exportados com sucesso!')
}

const importDocuments = () => {
  fileInput.value?.click()
}

const handleImport = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      
      if (!Array.isArray(imported)) {
        alert('❌ Formato inválido. O arquivo deve conter um array de documentos.')
        return
      }

      let count = 0
      imported.forEach((doc: any) => {
        if (doc.name && doc.content) {
          const existing = documents.value.find(d => 
            d.name.toUpperCase() === doc.name.toUpperCase()
          )
          if (!existing) {
            documents.value.push({
              id: Date.now() + count,
              name: doc.name.toUpperCase(),
              content: doc.content,
              createdAt: new Date().toISOString()
            })
            count++
          }
        }
      })

      if (count > 0) {
        saveDocuments()
        alert(`✅ ${count} documento(s) importado(s) com sucesso!`)
      } else {
        alert('📭 Nenhum novo documento foi importado.')
      }
    } catch (err) {
      alert('❌ Erro ao importar: ' + (err as Error).message)
    }
  }
  reader.readAsText(file)
  input.value = ''
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR')
}

onMounted(loadDocuments)
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 30px;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  background: #1a1a1a;
  border: 2px solid #ff6600;
  border-radius: 8px;
  padding: 20px 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.admin-header h1 {
  color: #ff6600;
  font-size: 24px;
  font-family: 'Courier New', monospace;
  margin: 0;
}

.admin-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.back-link {
  color: #00ff00;
  text-decoration: none;
  font-size: 14px;
  padding: 6px 16px;
  border: 1px solid #00ff00;
  border-radius: 4px;
  transition: all 0.3s;
}

.back-link:hover {
  background: #00ff00;
  color: #000;
}

.admin-badge {
  color: #ff6600;
  font-size: 12px;
  padding: 4px 16px;
  border: 1px solid #ff6600;
  border-radius: 4px;
}

.admin-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
}

.admin-card h2 {
  color: #ff6600;
  font-size: 18px;
  margin: 0 0 20px 0;
  font-family: 'Courier New', monospace;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  color: #ff6600;
  font-size: 13px;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  background: #000000;
  border: 1px solid #ff6600;
  color: #ff6600;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #ff8800;
  box-shadow: 0 0 20px rgba(255, 102, 0, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.btn-add {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add:hover {
  background: #00ff00;
  color: #000;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.card-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-example,
.btn-export,
.btn-import,
.btn-danger {
  padding: 6px 14px;
  border: 1px solid #ff6600;
  background: transparent;
  color: #ff6600;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-example:hover {
  background: #ff8800;
  color: #000;
  border-color: #ff8800;
}

.btn-export {
  border-color: #00ff88;
  color: #00ff88;
}

.btn-export:hover {
  background: #00ff88;
  color: #000;
}

.btn-import {
  border-color: #88ff00;
  color: #88ff00;
}

.btn-import:hover {
  background: #88ff00;
  color: #000;
}

.btn-danger {
  border-color: #ff4444;
  color: #ff4444;
}

.btn-danger:hover {
  background: #ff4444;
  color: #000;
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.doc-card {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 16px;
  transition: all 0.3s;
}

.doc-card:hover {
  border-color: #ff6600;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 102, 0, 0.1);
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.doc-name {
  color: #00ff00;
  font-weight: bold;
  font-size: 14px;
  word-break: break-all;
}

.doc-size {
  color: #006600;
  font-size: 12px;
}

.doc-preview {
  color: #aaa;
  font-size: 13px;
  margin-bottom: 10px;
  line-height: 1.5;
  min-height: 40px;
  background: #000;
  padding: 8px;
  border-radius: 4px;
  border-left: 2px solid #ff6600;
  white-space: pre-wrap;
  word-break: break-word;
}

.doc-meta {
  color: #666;
  font-size: 11px;
  margin-bottom: 12px;
}

.doc-actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 6px;
  border: 1px solid #ff6600;
  background: transparent;
  color: #ff6600;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-edit:hover {
  background: #ff6600;
  color: #000;
}

.btn-delete {
  border-color: #ff4444;
  color: #ff4444;
}

.btn-delete:hover {
  background: #ff4444;
  color: #000;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: #004400;
  padding: 40px;
}
</style>