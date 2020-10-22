// Storage Controller
const StorageCtrl = (() => {
  return {
    storeItem: (item) => {
      let items;

      // Check if any items in localstorage
      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item);

        // Set localstorage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));

        items.push(item);

        // Re-set localstorage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: () => {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem('items'));

      const updatedData = items.map((item) => {
        if (item.id === updatedItem.id) {
          item = updatedItem;
        }
        return item;
      });

      items = updatedData;

      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemFromStorage: (id) => {
      let items = JSON.parse(localStorage.getItem('items'));

      const updatedData = items.filter((item) => item.id !== id);

      items = updatedData;

      localStorage.setItem('items', JSON.stringify(items));
    },

    clearAllItems: () => {
      localStorage.removeItem('items');
    }
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Construction
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  return {
    getItems: () => {
      return data.items;
    },

    logData: () => {
      return data;
    },

    getTotalCalories: () => {
      let total = 0;

      data.items.forEach((item) => {
        total += item.calories;
      });

      // Set total calories to state
      data.totalCalories = total;

      return data.totalCalories;
    },

    addItem: (name, calories) => {
      let ID;

      // Vreate ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calorise to number
      calories = parseInt(calories);

      // Create new Item
      let newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: (id) => {
      const currentItem = data.items.find((item) => item.id === id);
      return currentItem;
    },

    setCurrentItem: (item) => {
      data.currentItem = item;
    },

    getCurrentItem: () => {
      return data.currentItem;
    },

    updateItem: (name, calories) => {
      calories = parseInt(calories);

      let found;

      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },

    deleteItem: (id) => {
      data.items = data.items.filter((item) => item.id !== id);
    },

    clearAllItems: () => {
      data.items = [];
    }
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: document.querySelector('#item-list'),
    itemNameInput: document.querySelector('#item-name'),
    itemCaloriesInput: document.querySelector('#item-calories'),
    totalCalories: document.querySelector('.total-calories'),

    addBtn: document.querySelector('.add-btn'),
    updateBtn: document.querySelector('.update-btn'),
    deleteBtn: document.querySelector('.delete-btn'),
    backBtn: document.querySelector('.back-btn'),
    clearBtn: document.querySelector('.clear-btn')
  };

  const {
    itemList,
    itemNameInput,
    itemCaloriesInput,
    totalCalories,
    updateBtn,
    deleteBtn,
    backBtn,
    addBtn,
    clearBtn
  } = UISelectors;

  return {
    populateItemList: (items) => {
      let html = '';

      items.forEach((item) => {
        html += `
          <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}</strong> <em>${item.calories} Calories</em>
          <a class="secondary-content" href="#"> 
          <i class="edit-item tiny material-icons">edit</i>
          </a></li>
        `;
      });

      // Insert list items
      itemList.innerHTML = html;
    },

    getSelectors: () => {
      return UISelectors;
    },

    getItemInput: () => {
      return {
        name: itemNameInput.value,
        calories: itemCaloriesInput.value
      };
    },

    addListItem: (item) => {
      itemList.style.display = 'block';

      let html = `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
        <a class="secondary-content" href="#"> 
        <i class="edit-item tiny material-icons">edit</i>
        </a></li>
      `;

      itemList.insertAdjacentHTML('beforeend', html);
    },

    clearInput: () => {
      itemNameInput.value = '';
      itemCaloriesInput.value = '';
    },

    hideList: () => {
      itemList.style.display = 'none';
    },

    showTotalCalories: (total) => {
      totalCalories.textContent = total;
    },

    clearEditState: () => {
      UICtrl.clearInput();
      updateBtn.style.display = 'none';
      deleteBtn.style.display = 'none';
      backBtn.style.display = 'none';
      addBtn.style.display = 'inline-flex';
    },

    showEditState: () => {
      updateBtn.style.display = 'inline-flex';
      deleteBtn.style.display = 'inline-flex';
      backBtn.style.display = 'inline-flex';
      addBtn.style.display = 'none';
    },

    addItemToForm: () => {
      itemNameInput.value = ItemCtrl.getCurrentItem().name;
      itemCaloriesInput.value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },

    updateListItem: (updatedItem) => {
      const listItems = document.querySelectorAll('#item-list li');

      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${updatedItem.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${updatedItem.name}</strong> <em>${updatedItem.calories} Calories</em>
          <a class="secondary-content" href="#"> 
          <i class="edit-item tiny material-icons">edit</i>
          </a> 
          `;
        }
      });
    },

    deleteListItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: () => {
      const listItems = document.querySelectorAll('#item-list li');

      listItems.forEach((item) => item.remove());
    }
  };
})();

// APP Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  // Load event listeners
  const loadEventListeners = () => {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    UISelectors.addBtn.addEventListener('click', itemAddSubmit);

    // Edit icon click event
    const ul = document.querySelector('.collection');
    ul.addEventListener('click', itemEditClick);

    // Update Btn event
    UISelectors.updateBtn.addEventListener('click', itemUpdateSubmit);

    // Back Btn event
    UISelectors.backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      UICtrl.clearEditState();
    });

    // Delete Btn event
    UISelectors.deleteBtn.addEventListener('click', itemDeleteSubmit);

    // Clear Btn event
    UISelectors.clearBtn.addEventListener('click', clearAllItems);
  };

  // Add Item
  const itemAddSubmit = (e) => {
    e.preventDefault();

    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    if (input.name && input.calories) {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      // Store in localstorage
      StorageCtrl.storeItem(newItem);

      // Clear Input
      UICtrl.clearInput();
    }
  };

  // Edit Item
  const itemEditClick = (e) => {
    e.preventDefault();
    if (e.target.classList.contains('edit-item')) {
      // Get list item ID
      const listId = e.target.parentNode.parentNode.id; // iten-0

      const listIdArr = listId.split('-');

      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
  };

  // Update Submit
  const itemUpdateSubmit = (e) => {
    e.preventDefault();
    const input = UICtrl.getItemInput();

    const updateItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update Ui
    UICtrl.updateListItem(updateItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // Update in localstorage
    StorageCtrl.updateItemStorage(updateItem);

    // Clear Input
    UICtrl.clearEditState();
  };

  // Delete Submit
  const itemDeleteSubmit = (e) => {
    e.preventDefault();

    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from Ui
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // Delete from localstorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    // Clear Input
    UICtrl.clearEditState();
  };

  // Clear Btn
  const clearAllItems = (e) => {
    e.preventDefault();

    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from localstorage
    StorageCtrl.clearAllItems();

    // Hide UL
    UICtrl.hideList();
  };

  return {
    init: () => {
      // Set initial state
      UICtrl.clearEditState();

      // Fetch items
      const items = ItemCtrl.getItems();

      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl, StorageCtrl);

//Init App
App.init();
