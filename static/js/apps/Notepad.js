export default class Notepad {
    constructor() {
        this.name = 'Notepad';
        this.icon = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11H8V13H16V11M16,15H8V17H16V15Z"/></svg>';
        this.iconPosition = { x: 20, y: 20 };
    }

    render(containerElement) {
        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.resize = 'none';
        textarea.style.border = 'none';
        textarea.style.padding = '10px';
        textarea.style.boxSizing = 'border-box';
        containerElement.appendChild(textarea);
    }
}