const uri = '/api/TodoItems';
const uri2 = '/api/TodoItems/categories';
let todos = [];
function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim(),
        category_id: parseInt(document.getElementById('category-select1').value.trim(), 10) 
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}
function addCategory() { //
    const addNameTextbox = document.getElementById('category-name1');

    const item = {
        category_name: addNameTextbox.value.trim(),
    
    };

    fetch('/api/TodoItems/new_categories', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to add item');
            }
            return response.json();
        })
        .then(() => {
            console.log('Category added successfully:', item);
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add category:', error));
}
function deleteItem(id) {
    fetch(uri + '/' + id, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}
function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        category_id: parseInt(document.getElementById('category-select2').value.trim(), 10) 
    };

    fetch(uri + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function updateCategory() { //
    let cat_id = parseInt(document.getElementById('category-selecting').value.trim(), 10);
    const item = {
        id: cat_id,
        category_name: document.getElementById('new-category-name2').value.trim()
    };

    fetch(uri2 + '/' + document.getElementById('category-selecting').value.trim(), {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput3();

    return false;
}
function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}
function closeInput1() {
    document.getElementById('editForm1').style.display = 'none';
}

function closeInput2() {
    document.getElementById('deleteForm1').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    // DoTo
}
function getCategories() { //
    fetch(uri2)
        .then(response => response.json())
        .then(data => { fillCategorySelect(data) }) 
        .catch(error => console.error('Unable to get categories.', error));;
}
function getCategoryName(categoryId) { //
    let urll = uri2 + '/' + categoryId;
    return fetch(urll)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.category_name);
            return data.category_name; 
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function deleteCategory() { //
    let id = parseInt(document.getElementById('category-selecting2').value.trim(), 10);
    fetch(uri2 + '/' + id, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}
function fillCategorySelect(categories) { //
    const categorySelect = document.getElementById('category-select1');

    categorySelect.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.category_name;
        categorySelect.appendChild(option);
    });

    const categorySelect2 = document.getElementById('category-select2');

    categorySelect2.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.category_name;
        categorySelect2.appendChild(option);
    });

    const categorySelecting = document.getElementById('category-selecting');

    categorySelecting.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.category_name;
        categorySelecting.appendChild(option);
    });
    
    const category_selecting2 = document.getElementById('category-selecting2');

    category_selecting2.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.category_name;
        category_selecting2.appendChild(option);
    });
}
function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {

        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditForm(' + item.id + ')');
        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteItem(' + item.id + ')');

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        debugger;
        getCategoryName(item.category_id)
            .then(ndata => {
                let categoryName = ndata;
                let categoryNode = document.createTextNode(categoryName);
                td3.appendChild(categoryNode);
            })
            .catch(error => {
                console.error('An error occurred while fetching category name:', error);
            });

        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    todos = data;
}

