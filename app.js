//BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, value) {
      var newItem, ID;

      //create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item
      if (type === 'exp') {
        newItem = new Expense(ID, des, value);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, value);
      }

      //push into data structure
      data.allItems[type].push(newItem);

      //return new element
      return newItem;

    },
    testing: function() {
      console.log(data);
    }
  };
})();

//UI CONTROLLER
var uiController = (function() {
  var DOMstrings = {
    type: '.add__type',
    description: '.add__description',
    value: '.add__value',
    button: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__container'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.type).value,
        description: document.querySelector(DOMstrings.description).value,
        value: document.querySelector(DOMstrings.value).value
      };
    },

    addListItem: function(obj, type) {
      //Create HTML text with a placeholder
      var html, newHtml, element;
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">&description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace placeholder text with some data
      newHtml = html.replace('&id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      //Insert HTML into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    getDOMobject: function() {
      return DOMstrings;
    },

    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.description + ', ' + DOMstrings.value);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
        current.description = "";
      });
      fieldsArr.focus();
    }
  };
})();

//GENERAL APP CONTROLLER
var controller = (function(budgetCtrl, uiCtrl) {
  var DOM = uiCtrl.getDOMobject();

  var setupEventListeners = function() {
    document.querySelector(DOM.button).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    var input, newItem;

    //1. Get the field input data
    input = uiCtrl.getInput();
    //2.
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    //3. Add
    uiCtrl.addListItem(newItem, input.type);
    //4. CLear the input fields
    uiCtrl.clearFields();
  };

  return {
    init: function () {
      console.log('Application has started.');
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
