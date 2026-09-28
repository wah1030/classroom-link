const demoResources = [
  {name:'Prompt Template.pdf', meta:'PDF · 1.2 MB', icon:'▤', tone:'', url:'#'},
  {name:'案例练习文件.zip', meta:'ZIP · 4.8 MB', icon:'⌁', tone:'green', url:'#'},
  {name:'课堂笔记与链接', meta:'Google Doc', icon:'▱', tone:'orange', url:'#'}
];
const API_URL = 'https://script.google.com/macros/s/AKfycbzECo_2mSZrWOjloQIPHygelRqSkwUTbymakhmSykwy0crrjaPjTvY3xXHxzChhc393Wg/exec';
const $ = (s) => document.querySelector(s);
const resourceMarkup = (items) => items.length ? items.map((r) => `<div class="resource"><span class="file-icon ${r.tone}">${r.icon}</span><div><b title="${r.name}">${r.name}</b><small>${r.meta}</small></div><a class="download" href="${r.url}" target="_blank" rel="noopener">↓</a></div>`).join('') : '<p class="muted">No materials published yet.</p>';
$('#resourceList').innerHTML = resourceMarkup(demoResources);
$('#teacherResourceList').innerHTML = resourceMarkup(demoResources);

async function syncFromApi() {
  try {
    const response = await fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) return;
    const data = await response.json();
    const classroom = data.classroom || {};
    if (classroom.title) $('#roomTitle').textContent = classroom.title;
    if (classroom.prompt) $('#promptText').textContent = classroom.prompt;
    if (classroom.title) $('#promptTitle').textContent = classroom.title;
    if (Array.isArray(data.resources)) {
      const resources = data.resources.map((file) => ({
        name: file.name,
        meta: `${file.mimeType || 'File'} · ${formatBytes(file.size)}`,
        icon: '▤',
        tone: '',
        url: file.url || '#'
      }));
      $('#resourceList').innerHTML = resourceMarkup(resources);
      $('#teacherResourceList').innerHTML = resourceMarkup(resources);
      $('#teacherResourceCount').textContent = resources.length;
    }
  } catch (error) {
    // Keep the demo content visible when the cloud API is not available yet.
  }
}
function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
syncFromApi();
setInterval(syncFromApi, 5000);

document.querySelectorAll('.switch').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.switch').forEach((b) => b.classList.remove('active'));
  button.classList.add('active');
  $('#studentView').classList.toggle('hidden', button.dataset.view !== 'student');
  $('#teacherView').classList.toggle('hidden', button.dataset.view !== 'teacher');
}));

$('#copyPrompt').addEventListener('click', async () => {
  await navigator.clipboard?.writeText($('#promptText').textContent.trim());
  $('#copyMessage').textContent = 'Copied — ready to paste into ChatGPT';
  setTimeout(() => $('#copyMessage').textContent = '', 2800);
});
document.querySelector('[data-action="done"]').addEventListener('click', (e) => { e.currentTarget.classList.add('selected'); $('#doneCount').textContent = 'You are done · 18 students'; });
document.querySelector('[data-action="question"]').addEventListener('click', () => $('#questionBox').classList.toggle('hidden'));
$('#sendQuestion').addEventListener('click', () => { $('#questionText').value=''; $('#questionBox').classList.add('hidden'); alert('Question sent. Your teacher will see it in the console.'); });

$('#publishPrompt').addEventListener('click', () => {
  $('#promptTitle').textContent = $('#teacherPromptTitle').value || 'Latest prompt';
  $('#promptText').textContent = $('#teacherPrompt').value;
  $('#copyMessage').textContent = 'Prompt updated';
  fetch(API_URL, { method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify({action:'publishPrompt', title: $('#teacherPromptTitle').value, prompt: $('#teacherPrompt').value}) }).catch(() => {});
  document.querySelector('[data-view="student"]').click();
  setTimeout(() => $('#copyMessage').textContent = '', 2500);
});
$('#chooseFile').addEventListener('click', () => $('#fileInput').click());
$('#dropzone').addEventListener('click', () => $('#fileInput').click());
$('#fileInput').addEventListener('change', () => { const file = $('#fileInput').files[0]; if(file) { $('#resourceName').value = file.name; $('#dropzone').querySelector('b').textContent = file.name; } });
$('#publishFile').addEventListener('click', () => {
  const file = $('#fileInput').files[0];
  if (!file) { $('#fileInput').click(); return; }
  const name = $('#resourceName').value.trim() || file.name;
  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = String(reader.result).split(',')[1];
    const button = $('#publishFile');
    button.disabled = true;
  button.textContent = 'Uploading…';
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'text/plain;charset=utf-8'},
        body: JSON.stringify({action:'upload', filename:name, mimeType:file.type, base64})
      });
      const data = await response.json();
      if (!data.ok) throw new Error(data.error || 'Upload failed');
      await syncFromApi();
      document.querySelector('[data-view="student"]').click();
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      button.disabled = false;
      button.textContent = 'Upload and publish';
      $('#resourceName').value = '';
      $('#fileInput').value = '';
      $('#dropzone').querySelector('b').textContent = '拖文件到这里';
    }
  };
  reader.readAsDataURL(file);
});
