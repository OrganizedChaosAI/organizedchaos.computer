
/* <JS> */

/* <Global Variables> */
const desktop = document.getElementById('desktop');
const contextMenu = document.getElementById('context-menu');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
let taskbarManagement;
let highestZIndex = 1000;
/* </Global Variables> */



function bringToFront(window) {
    highestZIndex++;
    window.style.zIndex = highestZIndex;
    
    // Remove 'active' class from all windows and taskbar items
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
    document.querySelectorAll('.taskbar-item').forEach(t => t.classList.remove('active'));
    
    // Add 'active' class to the focused window and its taskbar item
    window.classList.add('active');
    const app = window.getAttribute('data-app');
    const taskbarItem = document.querySelector(`.taskbar-item[data-app="${app}"]`);
    if (taskbarItem) {
        taskbarItem.classList.add('active');
    }
}




/* <Icon Data> */
let icons = [
    { name: 'My Computer', x: 20, y: 20, svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/></svg>' },
    { name: 'Recycle Bin', x: 20, y: 110, svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>' },
    { name: 'My Documents', x: 20, y: 200, svg: '<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#fff" d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/></svg>' }
];
/* </Icon Data> */

/* <Desktop Management> */
function initializeDesktop() {
    icons.forEach(icon => createIcon(icon.name, icon.x, icon.y, icon.svg));
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

function createCustomIcon() {
    const name = prompt('Enter icon name:');
    if (name) {
        const x = Math.random() * (desktop.clientWidth - 70);
        const y = Math.random() * (desktop.clientHeight - 70);
        const color = getRandomColor();
        const svg = `<svg viewBox="0 0 24 24" width="32" height="32"><rect width="24" height="24" fill="${color}" /></svg>`;
        createIcon(name, x, y, svg);
        icons.push({ name, x, y, svg });
    }
}
/* </Desktop Management> */

/* <Draggable Functionality> */
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
/* </Draggable Functionality> */

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

    const window = document.createElement('div');
    window.className = 'window';
    window.setAttribute('data-app', name);
    window.style.width = '400px';
    window.style.height = '300px';
    window.style.left = '100px';
    window.style.top = '100px';
    window.innerHTML = `
        <div class="window-header">
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
    bringToFront(window);


    window.addEventListener('mousedown', () => bringToFront(window));

    window.querySelector('.close').addEventListener('click', () => {
        window.remove();
        if (taskbarManagement) {
            const taskbarItem = document.querySelector(`.taskbar-item[data-app="${name}"]`);
            if (taskbarItem) {
                taskbarItem.remove();
            }
        }
    });


//Begin new minimize 

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
//End new minimize




    
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
    
    if (taskbarManagement) {
        taskbarManagement.createTaskbarItem(name);
    }
}

function getWindowContent(name) {
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

    function createTaskbarItem(app) {
        if (openWindows.has(app)) return;

        openWindows.add(app);
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item';
        taskbarItem.setAttribute('data-app', app);
        
        // Use the SVG icon from the start menu
        const startMenuItem = document.querySelector(`.start-menu-item[data-app="${app}"]`);
        const svgIcon = startMenuItem ? startMenuItem.querySelector('svg').cloneNode(true) : '';
        
        taskbarItem.innerHTML = `
            ${svgIcon.outerHTML || ''}
            <span>${app}</span>
            <span class="taskbar-item-close">×</span>
        `;
        
        taskbarItem.addEventListener('click', (e) => {
            if (e.target.classList.contains('taskbar-item-close')) {
                closeWindow(app);
                taskbarItem.remove();
                openWindows.delete(app);
            } else {
                const appWindow = document.querySelector(`.window[data-app="${app}"]`);
                if (appWindow) {
                    if (appWindow.style.display === 'none') {
                        // Maximize the window
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
                        // Minimize the window if it's active
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
                        // Bring window to front if it's not active
                        bringToFront(appWindow);
                    }
                }
            }
        });
        
        taskbar.appendChild(taskbarItem);
    }

    function toggleWindow(app) {
        const appWindow = document.querySelector(`.window[data-app="${app}"]`);
        if (appWindow) {
            if (appWindow.style.display === 'none') {
                appWindow.style.display = 'block';
            } else {
                appWindow.style.display = 'none';
            }
        }
    }

    function closeWindow(app) {
        const appWindow = document.querySelector(`.window[data-app="${app}"]`);
        if (appWindow) {
            appWindow.remove();
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

    return { createTaskbarItem, toggleWindow, closeWindow };
}
/* </Taskbar Management> */

/* <Context Menu Logic> */
function showContextMenu(e) {
    e.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
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
        const icon = item.querySelector('.start-menu-icon');
        item.addEventListener('mouseover', () => {
            icon.style.transform = 'scale(1.1)';
            icon.style.transition = 'transform 0.3s ease-in-out';
        });
        item.addEventListener('mouseout', () => {
            icon.style.transform = 'scale(1)';
        });
        item.addEventListener('click', () => {
            const app = item.getAttribute('data-app');
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
    desktop.addEventListener('click', hideContextMenu);
    document.getElementById('new-folder').addEventListener('click', createNewFolder);
    document.getElementById('custom-icon').addEventListener('click', createCustomIcon);
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