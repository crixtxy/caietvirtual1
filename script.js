// script.js - Caiet Virtual

// Trecere între mod light/dark
const toggleThemeBtn = document.getElementById('toggle-theme');
if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
}

// Aplică tema salvată la încărcarea paginii
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    afiseazaNotite();
    actualizeazaDashboard();
    gestioneazaLectii();
});

// Salvare notiță din editor
const saveNoteBtn = document.getElementById('save-note');
if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', () => {
        const titlu = document.getElementById('note-title').value;
        const continut = document.getElementById('note-content').value;
        if (titlu && continut) {
            const notita = {
                titlu,
                continut,
                data: new Date().toLocaleString(),
                favorit: false
            };
            const notite = JSON.parse(localStorage.getItem('notite') || '[]');
            notite.push(notita);
            localStorage.setItem('notite', JSON.stringify(notite));
            alert('Notiță salvată cu succes!');
        }
    });
}

// Export notițe în fișier .txt
const saveAsTxtBtn = document.getElementById('save-as-txt');  // Asigură-te că ai acest buton în editor.html
if (saveAsTxtBtn) {
    saveAsTxtBtn.addEventListener('click', () => {
        const titlu = document.getElementById('note-title').value;
        const continut = document.getElementById('note-content').value;

        if (titlu && continut) {
            const notaText = `Titlu: ${titlu}\n\nContinut:\n${continut}`;
            const blob = new Blob([notaText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${titlu}.txt`;  // Fișierul va fi numit după titlu
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert('Completează toate câmpurile pentru a salva notița!');
        }
    });
}

// Afișare în dashboard și caiet
function afiseazaNotite() {
    const lista = document.getElementById('notite-lista') || document.getElementById('dashboard-note-list');
    if (!lista) return;
    const notite = JSON.parse(localStorage.getItem('notite') || '[]');

    if (notite.length === 0) {
        lista.innerHTML = '<p>Nu există notițe salvate.</p>';
        return;
    }

    lista.innerHTML = '';
    notite.forEach((n, i) => {
        const item = document.createElement('div');
        item.className = 'notita';
        item.innerHTML = `
            <h3>${n.titlu}</h3>
            <p>${n.continut.substring(0, 100)}...</p>
            <small>${n.data}</small>
        `;
        lista.appendChild(item);
    });
}

// Căutare notițe
const searchBox = document.getElementById('search-notes');
if (searchBox) {
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.toLowerCase();
        const lista = document.getElementById('notite-lista');
        const notite = JSON.parse(localStorage.getItem('notite') || '[]');
        const filtrate = notite.filter(n => n.titlu.toLowerCase().includes(query) || n.continut.toLowerCase().includes(query));

        lista.innerHTML = '';
        filtrate.forEach(n => {
            const div = document.createElement('div');
            div.className = 'notita';
            div.innerHTML = `<h3>${n.titlu}</h3><p>${n.continut.substring(0,100)}...</p>`;
            lista.appendChild(div);
        });
    });
}

// Lecții interactive
function gestioneazaLectii() {
    const butoane = document.querySelectorAll('.start-lesson');
    const container = document.getElementById('lesson-details');
    if (!butoane.length || !container) return;

    const lectii = {
        1: 'Cornell este un sistem de notițe care împarte pagina în 3 zone: idei cheie, notițe și rezumat. Poți folosi bullet points și evidențieri pentru claritate.',
        2: 'Pentru organizarea ideilor, începe cu o schiță generală și apoi dezvoltă fiecare idee folosind concepte cheie și conexiuni logice.',
        3: 'Tehnica Pomodoro presupune să lucrezi 25 minute și să iei pauză 5. Repetă de 4 ori, apoi ia o pauză mai lungă. Ideal pentru concentrare.'
    };

    butoane.forEach(btn => {
        btn.addEventListener('click', () => {
            const nr = btn.dataset.lesson;
            container.innerHTML = `<p>${lectii[nr]}</p>`;
        });
    });
}

// Dashboard actualizare
function actualizeazaDashboard() {
    const total = document.getElementById('total-notes');
    const update = document.getElementById('last-update');
    const notite = JSON.parse(localStorage.getItem('notite') || '[]');

    if (total) total.textContent = notite.length;
    if (update && notite.length > 0) {
        update.textContent = notite[notite.length - 1].data;
    }
}

// Export notițe
const exportBtn = document.getElementById('export-notes') || document.getElementById('download-backup');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        const notite = JSON.parse(localStorage.getItem('notite') || '[]');
        const blob = new Blob([JSON.stringify(notite, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notite_backup.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Curățare toate notițele
const stergeBtn = document.getElementById('clear-all');
if (stergeBtn) {
    stergeBtn.addEventListener('click', () => {
        if (confirm('Sigur vrei să ștergi toate notițele?')) {
            localStorage.removeItem('notite');
            location.reload();
        }
    });
}

// Previzualizare în editor
const noteContent = document.getElementById('note-content');
if (noteContent) {
    noteContent.addEventListener('input', () => {
        const preview = document.getElementById('note-preview-content');
        preview.textContent = noteContent.value;
    });
}

// Curățare formular
const clearNoteBtn = document.getElementById('clear-note');
if (clearNoteBtn) {
    clearNoteBtn.addEventListener('click', () => {
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-preview-content').textContent = '';
    });
}
