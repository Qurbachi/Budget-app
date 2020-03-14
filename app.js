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
})();

//UI CONTROLLER
var uiController = (function() {
  var DOMstrings = {
    type: '.add__type',
    description: '.add__description',
    value: '.add__value',
    button: '.add__btn'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.type).value,
        description: document.querySelector(DOMstrings.description).value,
        value: document.querySelector(DOMstrings.value).value
      };
    },

    getDOMobject: function() {
      return DOMstrings;
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
    //1. Get the field input data
    var input = uiCtrl.getInput();
  };

  return {
    init: function () {
      console.log('Application has started.');
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
