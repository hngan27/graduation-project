(function() {
  const socket = io();
  const { currentUserId, partnerId } = chatConfig;
  if (currentUserId) {
    socket.emit('join', currentUserId);
  }
  const messagesEl = document.getElementById('messages');
  socket.on('private message', msg => {
    if (!messagesEl) return;
    // Message wrapper
    const wrapper = document.createElement('div');
    wrapper.className = msg.senderId === currentUserId ? 'flex justify-end' : 'flex justify-start';
    // Message bubble
    const bubble = document.createElement('div');
    bubble.className = msg.senderId === currentUserId
      ? 'bg-green-100 text-gray-900 px-4 py-2 rounded-2xl max-w-xs shadow-sm'
      : 'bg-white text-gray-900 px-4 py-2 rounded-2xl max-w-xs shadow-sm';
    // Image if exists
    if (msg.imageUrl) {
      const imgEl = document.createElement('img');
      imgEl.src = msg.imageUrl;
      imgEl.className = 'w-32 h-32 mb-2 rounded cursor-pointer';
      imgEl.style.cursor = 'pointer';
      imgEl.addEventListener('click', () => window.open(msg.imageUrl, '_blank'));
      bubble.appendChild(imgEl);
    }
    // Text if exists
    if (msg.content) {
      const textEl = document.createElement('p');
      textEl.textContent = msg.content;
      bubble.appendChild(textEl);
    }
    // Timestamp
    const timeEl = document.createElement('div');
    timeEl.className = msg.senderId === currentUserId
      ? 'text-xs text-right text-gray-400 mt-1'
      : 'text-xs text-left text-gray-400 mt-1';
    const createdAt = msg.createdAt ? new Date(msg.createdAt) : new Date();
    timeEl.textContent = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    bubble.appendChild(timeEl);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    // update history preview
    updateChatHistory(msg);
  });
  const form = document.getElementById('chat-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fileInput = document.getElementById('imageInput');
      const input = document.getElementById('messageInput');
      const hasFile = fileInput && fileInput.files && fileInput.files.length > 0;
      // If image upload, send via AJAX
      if (hasFile) {
        const formData = new FormData(form);
        fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        })
          .then(res => res.json())
          .then(msg => {
            // Append new message bubble
            const wrapper = document.createElement('div');
            wrapper.className = msg.senderId === currentUserId ? 'flex justify-end' : 'flex justify-start';
            const bubble = document.createElement('div');
            bubble.className = msg.senderId === currentUserId
              ? 'bg-green-100 text-gray-900 px-4 py-2 rounded-2xl max-w-xs shadow-sm'
              : 'bg-white text-gray-900 px-4 py-2 rounded-2xl max-w-xs shadow-sm';
            if (msg.imageUrl) {
              const imgEl = document.createElement('img');
              imgEl.src = msg.imageUrl;
              imgEl.className = 'w-32 h-32 mb-2 rounded cursor-pointer';
              imgEl.addEventListener('click', () => window.open(msg.imageUrl, '_blank'));
              bubble.appendChild(imgEl);
            }
            if (msg.content) {
              const textEl = document.createElement('p');
              textEl.textContent = msg.content;
              bubble.appendChild(textEl);
            }
            const timeEl = document.createElement('div');
            timeEl.className = msg.senderId === currentUserId
              ? 'text-xs text-right text-gray-400 mt-1'
              : 'text-xs text-left text-gray-400 mt-1';
            const createdAt = msg.createdAt ? new Date(msg.createdAt) : new Date();
            timeEl.textContent = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            bubble.appendChild(timeEl);
            wrapper.appendChild(bubble);
            messagesEl.appendChild(wrapper);
            messagesEl.scrollTop = messagesEl.scrollHeight;
            // reset form
            input.value = '';
            fileInput.value = '';
            const preview = document.getElementById('imagePreview');
            if (preview) { preview.src = ''; preview.classList.add('hidden'); }
            // update history preview
            updateChatHistory(msg);
          })
          .catch(console.error);
        return;
      }
      // Text-only message via socket
      if (!input || !input.value.trim()) return;
      const content = input.value.trim();
      socket.emit('private message', { content, to: partnerId, senderId: currentUserId });
      input.value = '';
    });
  }
  // Intercept chat list link clicks to mark messages as read and update nav badge without full reload
  const chatLinks = document.querySelectorAll('#chatList a');
  chatLinks.forEach(link => {
    link.addEventListener('click', async function(e) {
      e.preventDefault();
      const href = this.href;
      const partnerIdMatch = href.match(/\/chat\/(.*?)($|#)/);
      const partnerId = partnerIdMatch ? partnerIdMatch[1] : '';
      try {
        const res = await fetch(`/chat/${partnerId}/read`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          // update global unread count in nav
          const navBadge = document.querySelector('a[title="Chat"] span');
          if (navBadge) {
            if (data.unreadCount > 0) navBadge.textContent = data.unreadCount;
            else navBadge.remove();
          }
          // remove individual chat unread badge
          const badgeEl = this.closest('li').querySelector('.bg-green-500');
          if (badgeEl) badgeEl.remove();
        }
      } catch (err) {
        console.error('Error marking read:', err);
      }
      // then navigate
      window.location = href;
    });
  });

  // Update the sidebar chat history preview and order on new messages
  function updateChatHistory(msg) {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;
    // determine partnerId for this message
    const partner = msg.senderId === currentUserId ? msg.recipientId : msg.senderId;
    // find existing chat item link
    const link = chatList.querySelector(`a[href='/chat/${partner}#chat-block']`);
    if (!link) return;
    const li = link.closest('li');
    // update preview text
    const previewEl = li.querySelector('.truncate');
    if (previewEl) {
      // determine preview text or image label
      let text = msg.content && msg.content.trim() !== '' ? msg.content : chatConfig.sentImageText;
      // prefix with 'You:' if current user sent it
      if (msg.senderId === currentUserId) {
        text = chatConfig.youPrefix + text;
      }
      previewEl.textContent = text;
    }
    // update time
    const timeEl = li.querySelector('.text-xs.text-gray-400');
    if (timeEl) {
      const d = msg.createdAt ? new Date(msg.createdAt) : new Date();
      timeEl.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    // mark unread if incoming
    if (msg.senderId !== currentUserId) {
      // Only show unread badge if not currently viewing this chat
      if (msg.senderId !== chatConfig.partnerId) {
        let badge = li.querySelector('.ml-2.bg-green-500');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'ml-2 bg-green-500 text-white text-xs rounded-full px-2';
          badge.textContent = '1';
          link.parentNode.insertBefore(badge, link.nextSibling);
        }
      } else {
        // If currently viewing, clear badge
        const badgeEl = li.querySelector('.ml-2.bg-green-500');
        if (badgeEl) badgeEl.remove();
      }
    }
    // move to top
    chatList.insertBefore(li, chatList.firstChild);
  }
})();
