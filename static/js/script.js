/* <JS> */

/* <Global Variables> */
const desktop = document.getElementById('desktop');
const contextMenu = document.getElementById('context-menu');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
let taskbarManagement;
let highestZIndex = 1000;
/* </Global Variables> */

/* <Icon Data> */
let icons = [
    { name: 'My Computer', x: 20, y: 20, svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/></svg>' },
    { name: 'Recycle Bin', x: 20, y: 110, svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>' },
    { name: 'My Documents', x: 20, y: 200, svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/></svg>' },
    { name: 'Chat', svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>' },
    { name: 'Art', svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>' },
    { name: 'Today', svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>' },
    { name: 'Academy', svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>' },
    { name: 'Work', svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>' },
    { name: 'Fun', svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>' }
];
/* </Icon Data> */

function getIcon(name) {
    return icons.find(icon => icon.name.toLowerCase() === name.toLowerCase()) || icons[0]; // Default to first icon if not found
}

function bringToFront(window) {
    highestZIndex++;
    window.style.zIndex = highestZIndex;
    
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
    document.querySelectorAll('.taskbar-item').forEach(t => t.classList.remove('active'));
    
    window.classList.add('active');
    const app = window.getAttribute('data-app');
    const taskbarItem = document.querySelector(`.taskbar-item[data-app="${app}"]`);
    if (taskbarItem) {
        taskbarItem.classList.add('active');
    }
}

/* <Desktop Management> */
function initializeDesktop() {
    const desktopIcons = icons.filter(icon => icon.x !== undefined && icon.y !== undefined);
    desktopIcons.forEach(icon => createIcon(icon.name, icon.x, icon.y, icon.svg));
}

function createIcon(name, x, y, svg) {
    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;
    icon.innerHTML = `
        <div class="icon-image">${svg}</div>
        <div>${name}</div>
    `;
    icon.addEventListener('dblclick', () => openWindow(name));
    makeDraggable(icon);
    desktop.appendChild(icon);
}

function createNewFolder() {
    const name = 'New Folder';
    const x = Math.random() * (desktop.clientWidth - 70);
    const y = Math.random() * (desktop.clientHeight - 70);
    const svg = '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>';
    createIcon(name, x, y, svg);
    icons.push({ name, x, y, svg });
}

function createTextFile(x, y) {
    const name = 'New File.txt';
    const svg = '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>';
    const icon = createIcon(name, x, y, svg);
    icon.addEventListener('dblclick', () => openTextFileEditor(name));
    icons.push({ name, x, y, svg });
}

function openTextFileEditor(name) {
    const content = localStorage.getItem(name) || '';
    const window = createWindow(name, 'text-editor');
    window.querySelector('.window-content').innerHTML = `
        <textarea style="width: 100%; height: 100%; resize: none;">${content}</textarea>
    `;
    const textarea = window.querySelector('textarea');
    textarea.addEventListener('input', () => {
        localStorage.setItem(name, textarea.value);
    });
}
/* </Desktop Management> */

/* <Draggable - Resize Functionality> */
function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    if (!header) return;

    let isDragging = false;
    let startX, startY;

    header.addEventListener('mousedown', initDrag);

    function initDrag(e) {
        isDragging = true;
        startX = e.clientX - element.offsetLeft;
        startY = e.clientY - element.offsetTop;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
}

function makeResizable(element) {
    const handles = ['right', 'bottom', 'corner'];
    const minWidth = 200;
    const minHeight = 100;

    handles.forEach(type => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${type}-handle`;
        element.appendChild(handle);

        let startX, startY, startWidth, startHeight;

        const initResize = (e) => {
            e.stopPropagation();
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(getComputedStyle(element).width, 10);
            startHeight = parseInt(getComputedStyle(element).height, 10);
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        };

        const resize = (e) => {
            if (type === 'right' || type === 'corner') {
                const width = Math.max(minWidth, startWidth + e.clientX - startX);
                element.style.width = `${width}px`;
            }
            if (type === 'bottom' || type === 'corner') {
                const height = Math.max(minHeight, startHeight + e.clientY - startY);
                element.style.height = `${height}px`;
            }
        };

        const stopResize = () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        };

        handle.addEventListener('mousedown', initResize);
    });
}
/* </Draggable - Resize Functionality> */

/* <Window Management> */
function openWindow(name) {
    let existingWindow = document.querySelector(`.window[data-app="${name}"]`);
    if (existingWindow) {
        if (existingWindow.style.display === 'none') {
            const taskbarItem = document.querySelector(`.taskbar-item[data-app="${name}"]`);
            const rect = taskbarItem.getBoundingClientRect();
            existingWindow.style.transformOrigin = `${rect.left}px ${rect.top}px`;
            existingWindow.style.transform = 'scale(0.1)';
            existingWindow.style.opacity = '0';
            existingWindow.classList.add('maximizing');
            existingWindow.style.display = 'block';
            requestAnimationFrame(() => {
                existingWindow.style.transform = 'scale(1)';
                existingWindow.style.opacity = '1';
            });
            setTimeout(() => {
                existingWindow.classList.remove('maximizing');
                existingWindow.style.transform = '';
                existingWindow.style.opacity = '';
            }, 300);
        }
        bringToFront(existingWindow);
        return;
    }

    const icon = getIcon(name);
    const window = document.createElement('div');
    window.className = 'window';
    window.setAttribute('data-app', name);
    window.style.width = '400px';
    window.style.height = '300px';
    window.style.left = '100px';
    window.style.top = '100px';
    window.innerHTML = `
        <div class="window-header">
            <div class="window-icon">${icon.svg}</div>
            <span>${name}</span>
            <div class="window-controls">
                <span class="minimize">-</span>
                <span class="maximize">□</span>
                <span class="close">×</span>
            </div>
        </div>
        <div class="window-content">
            ${getWindowContent(name)}
        </div>
    `;
    desktop.appendChild(window);
    window.style.display = 'block';
    makeDraggable(window);
    makeResizable(window);
    bringToFront(window);

    window.addEventListener('mousedown', () => bringToFront(window));

    window.querySelector('.close').addEventListener('click', () => {
        window.remove();
        if (taskbarManagement && taskbarManagement.removeWindow) {
            taskbarManagement.removeWindow(name);
        }
    });

    window.querySelector('.minimize').addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = window.getBoundingClientRect();
        const taskbarItem = document.querySelector(`.taskbar-item[data-app="${name}"]`);
        const taskbarRect = taskbarItem.getBoundingClientRect();

        window.style.transformOrigin = `${taskbarRect.left - rect.left}px ${taskbarRect.top - rect.top}px`;

        window.classList.add('minimizing');
        setTimeout(() => {
            window.style.display = 'none';
            window.classList.remove('minimizing');
        }, 300);
    });
    
    window.querySelector('.maximize').addEventListener('click', () => {
        if (window.style.width === '100%') {
            window.style.width = '400px';
            window.style.height = '300px';
            window.style.top = '100px';
            window.style.left = '100px';
        } else {
            window.style.width = '100%';
            window.style.height = 'calc(100% - 40px)';
            window.style.top = '0';
            window.style.left = '0';
        }
    });

    initializeAppFunctionality(name, window);
    
    if (taskbarManagement && taskbarManagement.createTaskbarItem) {
        taskbarManagement.createTaskbarItem(name);
    }
    bringToFront(window);
}

function createWindow(name, type = 'default') {
    const icon = getIcon(name);
    const window = document.createElement('div');
    window.className = 'window';
    window.setAttribute('data-app', name);
    window.style.width = '400px';
    window.style.height = '300px';
    window.style.left = '100px';
    window.style.top = '100px';
    window.innerHTML = `
        <div class="window-header">
            <div class="window-icon">${icon.svg}</div>
            <span>${name}</span>
            <div class="window-controls">
                <span class="minimize">-</span>
                <span class="maximize">□</span>
                <span class="close">×</span>
            </div>
        </div>
        <div class="window-content">
            ${getWindowContent(name, type)}
        </div>
    `;

    window.querySelector('.close').addEventListener('click', () => {
        window.remove();
        if (taskbarManagement && taskbarManagement.removeWindow) {
            taskbarManagement.removeWindow(name);
        }
    });

    window.querySelector('.minimize').addEventListener('click', () => {
        window.style.display = 'none';
    });
    
    window.querySelector('.maximize').addEventListener('click', () => {
        if (window.style.width === '100%') {
            window.style.width = '400px';
            window.style.height = '300px';
            window.style.top = '100px';
            window.style.left = '100px';
        } else {
            window.style.width = '100%';
            window.style.height = 'calc(100% - 40px)';
            window.style.top = '0';
            window.style.left = '0';
        }
    });

    return window;
}

function getWindowContent(name, type) {
    switch (type) {
        case 'text-editor':
            return '<textarea style="width: 100%; height: 100%; resize: none;"></textarea>';
        default:
            switch (name.toLowerCase()) {
                case 'today':
                    return `
                        <div class="calendar">
                            <div class="calendar-header">May 2023</div>
                            ${generateCalendar()}
                        </div>
                    `;
                case 'chat':
                    return `
                        <div class="chat-messages"></div>
                        <div class="chat-input">
                            <input type="text" placeholder="Type a message...">
                            <button>Send</button>
                        </div>
                    `;
                case 'art':
                    return '<canvas class="art-canvas" width="350" height="250"></canvas>';
                case 'academy':
                    return `
                        <h2>Welcome to the Academy</h2>
                        <p>Start learning today!</p>
                        <select id="course-select">
                            <option value="">Select a course</option>
                            <option value="math">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="history">History</option>
                        </select>
                        <div id="course-content"></div>
                    `;
                case 'work':
                    return `
                        <h2>Work Dashboard</h2>
                        <div id="task-list">
                            <h3>Your tasks for today:</h3>
                            <ul>
                                <li>Complete project proposal</li>
                                <li>Review team progress</li>
                                <li>Schedule client meeting</li>
                            </ul>
                        </div>
                        <button id="add-task">Add New Task</button>
                    `;
                case 'fun':
                    return `
                        <h2>Fun Zone</h2>
                        <p>Choose a game to play:</p>
                        <ul id="game-list">
                            <li><button class="game-button" data-game="tictactoe">Tic Tac Toe</button></li>
                            <li><button class="game-button" data-game="snake">Snake</button></li>
                            <li><button class="game-button" data-game="tetris">Tetris</button></li>
                        </ul>
                        <div id="game-area"></div>
                    `;
                default:
                    return `Content for ${name}`;
            }
    }
}
/* </Window Management> */

/* <Application Functionality> */
function initializeAppFunctionality(name, window) {
    switch (name.toLowerCase()) {
        case 'chat':
            initializeChatApp(window);
            break;
        case 'art':
            initializeArtApp(window);
            break;
        case 'today':
            initializeCalendarApp(window);
            break;
        case 'academy':
            initializeAcademyApp(window);
            break;
        case 'work':
            initializeWorkApp(window);
            break;
        case 'fun':
            initializeFunApp(window);
            break;
        default:
            console.log(`No specific initialization for ${name}`);
    }
}

function initializeChatApp(window) {
    const input = window.querySelector('.chat-input input');
    const sendButton = window.querySelector('.chat-input button');
    const messages = window.querySelector('.chat-messages');

    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = input.value.trim();
        if (message) {
            messages.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
        }
    }
}

function initializeArtApp(window) {
    const canvas = window.querySelector('.art-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;
    }
}

function initializeCalendarApp(window) {
    const calendarDays = window.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            if (day.textContent) {
                alert(`You clicked on ${day.textContent} May 2023`);
            }
        });
    });
}

function generateCalendar() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let calendarHTML = days.map(day => `<div class="calendar-day">${day}</div>`).join('');
    
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarHTML += '<div class="calendar-day"></div>';
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const isToday = i === today.getDate() ? 'today' : '';
        calendarHTML += `<div class="calendar-day ${isToday}">${i}</div>`;
    }

    return calendarHTML;
}

function initializeAcademyApp(window) {
    const courseSelect = window.querySelector('#course-select');
    const courseContent = window.querySelector('#course-content');

    courseSelect.addEventListener('change', (e) => {
        const course = e.target.value;
        if (course) {
            courseContent.innerHTML = `<p>You've selected the ${course} course. Content coming soon!</p>`;
        } else {
            courseContent.innerHTML = '';
        }
    });
}

function initializeWorkApp(window) {
    const addTaskButton = window.querySelector('#add-task');
    const taskList = window.querySelector('#task-list ul');

    addTaskButton.addEventListener('click', () => {
        const newTask = prompt('Enter a new task:');
        if (newTask) {
            const li = document.createElement('li');
            li.textContent = newTask;
            taskList.appendChild(li);
        }
    });
}

function initializeFunApp(window) {
    const gameButtons = window.querySelectorAll('.game-button');
    const gameArea = window.querySelector('#game-area');

    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const game = button.getAttribute('data-game');
            gameArea.innerHTML = `<p>You've selected to play ${game}. Game loading...</p>`;
        });
    });
}
/* </Application Functionality> */

/* <Taskbar Management> */
function initializeTaskbar() {
    const taskbar = document.getElementById('taskbar');
    const openWindows = new Set();

    const datetimeDiv = document.createElement('div');
    datetimeDiv.id = 'datetime';
    taskbar.appendChild(datetimeDiv);

    function updateDateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const dateString = now.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
        
        datetimeDiv.innerHTML = `<div class="time">${timeString}</div><div class="date">${dateString}</div>`;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    function createTaskbarItem(app) {
        if (openWindows.has(app)) return;
    
        openWindows.add(app);
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item';
        taskbarItem.setAttribute('data-app', app);
        
        const icon = getIcon(app);
        
        taskbarItem.innerHTML = `
            <div class="taskbar-icon">${icon.svg}</div>
            <span>${app}</span>
        `;
        
        taskbarItem.addEventListener('click', () => {
            const appWindow = document.querySelector(`.window[data-app="${app}"]`);
            if (appWindow) {
                if (appWindow.style.display === 'none') {
                    const rect = taskbarItem.getBoundingClientRect();
                    appWindow.style.transformOrigin = `${rect.left}px ${rect.top}px`;
                    appWindow.style.transform = 'scale(0.1)';
                    appWindow.style.opacity = '0';
                    appWindow.style.display = 'block';
                    
                    requestAnimationFrame(() => {
                        appWindow.classList.add('maximizing');
                        appWindow.style.transform = 'scale(1)';
                        appWindow.style.opacity = '1';
                    });
        
                    appWindow.addEventListener('transitionend', function handler() {
                        appWindow.classList.remove('maximizing');
                        appWindow.style.transform = '';
                        appWindow.style.opacity = '';
                        appWindow.removeEventListener('transitionend', handler);
                    });
                    bringToFront(appWindow);
                } else if (appWindow.classList.contains('active')) {
                    const rect = appWindow.getBoundingClientRect();
                    const taskbarRect = taskbarItem.getBoundingClientRect();
                    appWindow.style.transformOrigin = `${taskbarRect.left - rect.left}px ${taskbarRect.top - rect.top}px`;
                    appWindow.classList.add('minimizing');
                    setTimeout(() => {
                        appWindow.style.display = 'none';
                        appWindow.classList.remove('minimizing');
                        taskbarItem.classList.remove('active');
                    }, 300);
                } else {
                    bringToFront(appWindow);
                }
            }
        });
        
        taskbar.appendChild(taskbarItem);
    }

    function removeWindow(app) {
        openWindows.delete(app);
        const taskbarItem = document.querySelector(`.taskbar-item[data-app="${app}"]`);
        if (taskbarItem) {
            taskbarItem.remove();
        }
    }

    // Observe desktop for changes to update taskbar
    const desktopObserver = new MutationObserver(() => {
        const currentWindows = document.querySelectorAll('.window');
        currentWindows.forEach(window => {
            const app = window.getAttribute('data-app');
            if (!openWindows.has(app)) {
                createTaskbarItem(app);
            }
        });
    });
    desktopObserver.observe(desktop, { childList: true });

    return { createTaskbarItem, removeWindow };
}
/* </Taskbar Management> */

/* <Context Menu Logic> */
function showContextMenu(e) {
    e.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    
    // Clear previous menu items
    contextMenu.innerHTML = '';
    
    // Add "New Text File" option
    const newTextFileOption = document.createElement('div');
    newTextFileOption.textContent = 'New Text File';
    newTextFileOption.addEventListener('click', () => {
        createTextFile(e.clientX, e.clientY);
        hideContextMenu();
    });
    contextMenu.appendChild(newTextFileOption);
    
    // Add other context menu options here
}

function hideContextMenu() {
    contextMenu.style.display = 'none';
}
/* </Context Menu Logic> */

/* <Start Menu Logic> */
function toggleStartMenu() {
    if (startMenu.style.display === 'none' || startMenu.style.display === '') {
        startMenu.style.display = 'block';
        setTimeout(() => startMenu.classList.add('active'), 10);
    } else {
        startMenu.classList.remove('active');
        setTimeout(() => startMenu.style.display = 'none', 300);
    }
}

function initializeStartMenuItems() {
    const startMenuItems = startMenu.querySelectorAll('.start-menu-item');
    startMenuItems.forEach(item => {
        const app = item.getAttribute('data-app');
        const icon = getIcon(app);
        item.innerHTML = `
            <div class="start-menu-icon">${icon.svg}</div>
            <span>${app}</span>
        `;
        
        item.addEventListener('click', () => {
            openWindow(app);
            toggleStartMenu();
        });
    });
}

function smoothScrollStartMenu() {
    startMenu.style.scrollBehavior = 'smooth';
    startMenu.addEventListener('wheel', (e) => {
        e.preventDefault();
        startMenu.scrollTop += e.deltaY;
    });
}
/* </Start Menu Logic> */

/* <Utility Functions> */
function getRandomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

function preventDefaultDragBehavior(e) {
    e.preventDefault();
}

function simulateSystemNotification() {
    const notification = document.createElement('div');
    notification.style.position = 'absolute';
    notification.style.right = '10px';
    notification.style.bottom = '50px';
    notification.style.backgroundColor = 'rgba(45, 45, 45, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.backdropFilter = 'blur(10px)';
    notification.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.transition = 'opacity 0.5s ease-in-out';
    notification.textContent = 'System Notification: Update available';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}
/* </Utility Functions> */

/* <Error Handling> */
window.onerror = function(message, source, lineno, colno, error) {
    console.error('An error occurred:', message, 'at', source, lineno, colno);
    alert('An error occurred. Please check the console for more information.');
    return true;
};
/* </Error Handling> */

/* <Windows Logo> */
function initializeWindowsLogo() {
    const windowsLogo = document.getElementById('windows-logo');
    windowsLogo.addEventListener('click', () => {
        alert('Windows 10 Simulation');
    });
}
/* </Windows Logo> */

/* <Initialization> */
document.addEventListener('DOMContentLoaded', () => {
    taskbarManagement = initializeTaskbar();
    initializeDesktop();
    initializeStartMenuItems();
    initializeWindowsLogo();
    smoothScrollStartMenu();

    desktop.addEventListener('dragover', preventDefaultDragBehavior);
    desktop.addEventListener('drop', preventDefaultDragBehavior);
    
    desktop.addEventListener('contextmenu', showContextMenu);
    document.addEventListener('click', hideContextMenu);
    document.getElementById('new-folder').addEventListener('click', createNewFolder);
    document.getElementById('refresh').addEventListener('click', () => {
        desktop.innerHTML = '';
        icons.forEach(icon => createIcon(icon.name, icon.x, icon.y, icon.svg));
    });
    
    startButton.addEventListener('click', toggleStartMenu);
    
    // Simulate a system notification after 5 seconds
    setTimeout(simulateSystemNotification, 5000);
});
/* </Initialization> */

/* </JS> */