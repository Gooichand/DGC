// Portfolio AI Assistant Widget
document.addEventListener('DOMContentLoaded', () => {
  // Backend endpoints default to this origin; api-config.js may point them at a
  // separate host (e.g. the Vercel deployment).
  const apiUrl = (path) => (window.UNKNOWN_API_BASE || '') + path;

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'chat-widget-container';
  
  // Widget HTML structure
  widgetContainer.innerHTML = `
    <div id="chat-window">
      <div id="chat-header">
        <h3><i class="fas fa-robot"></i> DGC Assistant</h3>
        <button id="chat-close-btn" aria-label="Close chat"><i class="fas fa-times"></i></button>
      </div>
      
      <div id="chat-messages">
        <div class="chat-message assistant">
          Hello! I'm the AI assistant for Gopichand Dandimeni. I can answer questions about his cybersecurity experience, projects, skills, and contact info. How can I help you today?
        </div>
      </div>
      
      <div id="chat-input-area">
        <!-- Standard Chat Form -->
        <form id="chat-form">
          <input type="text" id="chat-input" class="chat-input" placeholder="Ask about Gopichand..." aria-label="Ask the assistant about Gopichand" autocomplete="off">
          <button type="submit" id="chat-submit" class="chat-submit-btn" aria-label="Send message"><i class="fas fa-paper-plane"></i></button>
        </form>
        
        <!-- Admin Verification Form (Hidden by default) -->
        <div id="admin-panel">
          <div class="admin-header">
            <span><i class="fas fa-lock"></i> Developer Mode</span>
            <button type="button" class="cancel-admin-btn" id="cancel-admin">Cancel</button>
          </div>
          
          <form id="admin-form">
            <input type="password" id="admin-password" class="chat-input" placeholder="Enter Admin Password" aria-label="Admin password" autocomplete="off">
            <button type="submit" class="chat-submit-btn" aria-label="Verify password"><i class="fas fa-key"></i></button>
          </form>
          
          <form id="update-form" style="display: none;">
            <input type="text" id="update-fact" class="chat-input" placeholder="Teach me a new fact..." aria-label="New fact to teach the assistant" autocomplete="off">
            <button type="submit" class="chat-submit-btn" aria-label="Save update"><i class="fas fa-save"></i></button>
          </form>
        </div>
      </div>
    </div>
    
    <button id="chat-toggle-btn" aria-label="AI DGC! — toggle AI assistant">
      AI DGC!
    </button>
  `;
  
  document.body.appendChild(widgetContainer);
  
  // Load FontAwesome if not already present
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fa);
  }
  
  // Load CSS
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'src/components/PortfolioAssistant/chat-widget.css?v=20261002';
  document.head.appendChild(css);
  
  // Elements
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatWindow = document.getElementById('chat-window');
  const messagesContainer = document.getElementById('chat-messages');
  
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatSubmit = document.getElementById('chat-submit');
  
  const adminPanel = document.getElementById('admin-panel');
  const cancelAdminBtn = document.getElementById('cancel-admin');
  const adminForm = document.getElementById('admin-form');
  const adminPassword = document.getElementById('admin-password');
  const updateForm = document.getElementById('update-form');
  const updateFact = document.getElementById('update-fact');
  
  // State
  let messageHistory = [];
  let isAdminVerified = false;
  
  // Toggle Chat Window
  function toggleChat() {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatInput.focus();
    }
  }
  
  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  
  // Markdown rendering lives in safe-markdown.js, which escapes every HTML
  // character (including quotes) and only allows safe link schemes, so assistant
  // output can never inject markup or event handlers. Fallback stays escaped.
  const parseMarkdown = window.renderSafeMarkdown || ((text) => {
    const el = document.createElement('div');
    el.textContent = text || '';
    return el.innerHTML;
  });

  // Add message to UI
  function appendMessage(role, content) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${role}`;
    
    if (role === 'user' || role === 'error' || role === 'system') {
      msgDiv.textContent = content;
    } else {
      msgDiv.innerHTML = parseMarkdown(content);
    }
    
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
  }
  
  // Show typing indicator
  function showTyping() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-message assistant typing-container';
    indicator.innerHTML = `
      <span class="typing-indicator"></span>
      <span class="typing-indicator"></span>
      <span class="typing-indicator"></span>
    `;
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return indicator;
  }
  
  // Handle standard chat submission
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Check for secret admin command
    if (text === '/sudo-update') {
      chatInput.value = '';
      chatForm.style.display = 'none';
      adminPanel.classList.add('active');
      adminPassword.focus();
      appendMessage('system', 'Developer Mode Initiated. Authentication required.');
      return;
    }
    
    // Normal message flow
    chatInput.value = '';
    chatInput.disabled = true;
    chatSubmit.disabled = true;
    
    appendMessage('user', text);
    messageHistory.push({ role: 'user', content: text });
    
    const typingIndicator = showTyping();
    
    try {
      const response = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageHistory })
      });
      
      typingIndicator.remove();
      
      if (!response.ok) {
        let details = 'The assistant service is temporarily unavailable.';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) details = errorData.error;
        } catch (_) {
          // Keep the safe fallback message when the server response is not JSON.
        }
        throw new Error(details);
      }
      
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const assistantMsg = document.createElement('div');
      assistantMsg.className = 'chat-message assistant';
      messagesContainer.appendChild(assistantMsg);
      
      let fullResponse = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) throw new Error(data.error);
              if (data.text) {
                fullResponse += data.text;
                assistantMsg.innerHTML = parseMarkdown(fullResponse);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                console.error('Error parsing stream:', err);
              } else {
                throw err;
              }
            }
          }
        }
      }
      
      messageHistory.push({ role: 'assistant', content: fullResponse });
      
    } catch (error) {
      console.error('Chat error:', error);
      if (typingIndicator.parentNode) typingIndicator.remove();
      appendMessage('error', error.message || 'Sorry, I encountered an error connecting to my brain. Please try again later.');
      messageHistory.pop(); // Remove the user message that failed
    } finally {
      chatInput.disabled = false;
      chatSubmit.disabled = false;
      chatInput.focus();
    }
  });
  
  // Cancel Admin Mode
  cancelAdminBtn.addEventListener('click', () => {
    adminPanel.classList.remove('active');
    chatForm.style.display = 'flex';
    adminPassword.value = '';
    updateFact.value = '';
    adminForm.style.display = 'flex';
    updateForm.style.display = 'none';
    isAdminVerified = false;
    appendMessage('system', 'Developer Mode Canceled.');
  });
  
  // Handle Admin Verification
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pwd = adminPassword.value;
    if (!pwd) return;
    
    const btn = adminForm.querySelector('button');
    btn.disabled = true;
    
    try {
      const res = await fetch(apiUrl('/api/admin/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      
      if (res.ok) {
        isAdminVerified = true;
        adminForm.style.display = 'none';
        updateForm.style.display = 'flex';
        updateFact.focus();
        appendMessage('system', 'Authentication successful. You may now teach me new facts.');
      } else {
        appendMessage('error', 'Authentication failed. Invalid password.');
        adminPassword.value = '';
      }
    } catch (err) {
      appendMessage('error', 'Error connecting to verification server.');
    } finally {
      btn.disabled = false;
    }
  });
  
  // Handle Knowledge Update
  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fact = updateFact.value.trim();
    if (!fact || !isAdminVerified) return;
    
    const btn = updateForm.querySelector('button');
    btn.disabled = true;
    
    try {
      const res = await fetch(apiUrl('/api/admin/update'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password: adminPassword.value,
          fact: fact 
        })
      });
      
      if (res.ok) {
        appendMessage('system', '🟢 Knowledge updated successfully. I will remember this for future visitors.');
        updateFact.value = '';
      } else {
        const data = await res.json();
        appendMessage('error', data.error || 'Failed to update knowledge.');
      }
    } catch (err) {
      appendMessage('error', 'Error connecting to update server.');
    } finally {
      btn.disabled = false;
    }
  });
});
