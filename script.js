const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogListEl = document.getElementById('backlog-list');
const progressListEl = document.getElementById('progress-list');
const completeListEl = document.getElementById('complete-list');
// const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
// let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        // onHoldListArray = JSON.parse(localStorage.onHoldItems);
    } else {
        backlogListArray = ['Day 1: The Christmas Chronicles', 'Day 2: Home Alone', 'Day 3: Christmas With The Cranks', 'Day 4: The Christmas Chronicles 2', 'Day 5: Miracle On 34th Street', 'Day 6: The Holiday', 'Day 7: The Santa Clause', 'Day 8: A Christmas Carol', 'Day 9: Jingle Jangle', "Day 10: National Lampoon's Christmas Vacation", 'Day 11: Bad Santa', 'Day 12: Arthur Christmas', 'Day 13: Jingle All The Way', 'Day 14: Home Alone 2', 'Day 15: Love Actually', "Day 16: I'll Be Home For Christmas", 'Day 17: The Polar Express', 'Day 18: Elf', 'Day 19: A Bad Moms Christmas', 'Day 20: The Santa Claus 2', 'Day 21: The Holiday Calendar', 'Day 22: Deck The Halls', 'Day 23: Klaus', 'Day 24: How The Grinch Stole Christmas'];
        // progressListArray = ['Work on projects', 'Listen to music'];
        // completeListArray = ['Being cool', 'Getting stuff done'];
        // onHoldListArray = ['Being uncool'];
    }
}

// Set localStorage Arrays
function updateSavedColumns() {
    listArrays = [backlogListArray, progressListArray, completeListArray];
    const arrayNames = ['backlog', 'progress', 'complete'];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    });
}

// Filter Array to remove empty values
function filterArray(array) {
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
    // List Item
    const listEl = document.createElement("li");
    listEl.textContent = item;
    listEl.id = index;
    listEl.classList.add("drag-item");
    listEl.draggable = true;
    listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
    listEl.setAttribute("ondragstart", "drag(event)");
    //add another function which takes care of the click
    listEl.setAttribute("onclick", "editable(event)");
    // listEl.contentEditable = true <== remove this line
    // Append
    columnEl.appendChild(listEl);
}

  // additional function to handle click and make it also work in firefox
    function editable(el) {
    // set the clicked list element as editable
    el.target.contentEditable = true;
    //set the focus on this element in order to be able to change the text
    // and to keep the drag functionality working
    el.target.focus();
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    // Check localStorage once
    if (!updatedOnLoad) {
        getSavedColumns();
    }
    // Backlog Column
    backlogListEl.textContent = '';
    backlogListArray.forEach((backlogItem, index) => {
        createItemEl(backlogListEl, 0, backlogItem, index);
    });
    backlogListArray = filterArray(backlogListArray);
    // Progress Column
    progressListEl.textContent = '';
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressListEl, 1, progressItem, index);
    });
    progressListArray = filterArray(progressListArray);
    // Complete Column
    completeListEl.textContent = '';
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeListEl, 2, completeItem, index);
    });
    completeListArray = filterArray(completeListArray);
    // Dont run more than once, Update Local Storage
    updatedOnLoad = true;
    updateSavedColumns();
}

// Update Item - Delete if necessary, or update the Array value
function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;
    if (!dragging) {
        if (!selectedColumnEl[id].textContent) {
            delete selectedArray[id];
        } else {
            selectedArray[id] = selectedColumnEl[id].textContent;
        }
        updateDOM();
    }
}

// Add to ColumnList, Reset Textbox
function addToColumn(column) {
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    addItems[column].textContent = '';
    updateDOM(column);
}

// Show Add Item Input Box
function showInputBox(column) {
    addBtns[column].style.visibility = 'hidden';
    saveItemBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
    addBtns[column].style.visibility = 'visible';
    saveItemBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
    backlogListArray = Array.from(backlogListEl.children).map(i => i.textContent);
    progressListArray = Array.from(progressListEl.children).map(i => i.textContent);
    completeListArray = Array.from(completeListEl.children).map(i => i.textContent);
    updateDOM();
}

// When Item Enters Column Area
function dragEnter(column) {
    listColumns[column].classList.add('over');
    currentColumn = column;
}

// When Item Starts Dragging
function drag(e) {
    draggedItem = e.target;
    dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
    e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
    e.preventDefault();
    // Remove Background Color/Padding
    listColumns.forEach((column) => {
    column.classList.remove('over');
    });
    // Add item to Column
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);
    // Dragging complete
    dragging = false;
    rebuildArrays();
}

// On Load
updateDOM();

// Snowflake

'use strict'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let width, height, lastNow
let snowflakes
const maxSnowflakes = 100

function init() {
    snowflakes = []
    resize()
    render(lastNow = performance.now())
}

function render(now) {
    requestAnimationFrame(render)

    const elapsed = now - lastNow
    lastNow = now

    ctx.clearRect(0, 0, width, height)
    if (snowflakes.length < maxSnowflakes)
        snowflakes.push(new Snowflake())

    ctx.fillStyle = ctx.strokeStyle = '#fff'

    snowflakes.forEach(snowflake => snowflake.update(elapsed, now))
}

function pause() {
    cancelAnimationFrame(render)
}

function resume() {
    lastNow = performance.now()
    requestAnimationFrame(render)
}


class Snowflake {
    constructor() {
        this.spawn()
    }

    spawn(anyY = false) {
        this.x = rand(0, width)
        this.y = anyY === true ?
            rand(-50, height + 50) :
            rand(-50, -10)
        this.xVel = rand(-.05, .05)
        this.yVel = rand(.02, .1)
        this.angle = rand(0, Math.PI * 2)
        this.angleVel = rand(-.001, .001)
        this.size = rand(7, 12)
        this.sizeOsc = rand(.01, .5)
    }

    update(elapsed, now) {
        const xForce = rand(-.001, .001);

        if (Math.abs(this.xVel + xForce) < .075) {
            this.xVel += xForce
        }

        this.x += this.xVel * elapsed
        this.y += this.yVel * elapsed
        this.angle += this.xVel * 0.05 * elapsed //this.angleVel * elapsed

        if (
            this.y - this.size > height ||
            this.x + this.size < 0 ||
            this.x - this.size > width
        ) {
            this.spawn()
        }

        this.render()
    }

    render() {
        ctx.save()
        const {
            x,
            y,
            angle,
            size
        } = this
        ctx.beginPath()
        ctx.arc(x, y, size * 0.2, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.restore()
    }
}

// Utils
const rand = (min, max) => min + Math.random() * (max - min)

function resize() {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
}

window.addEventListener('resize', resize)
window.addEventListener('blur', pause)
window.addEventListener('focus', resume)
init()