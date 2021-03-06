//BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var calculateTotal = function(type) {
    var sum  = 0;

      if (data.allItems[type].length > 0) {
        data.allItems[type].forEach( function(current) {
        sum += current.value;
        data.totals[type]=sum;});
  } else {
    data.totals[type]=0;
  }
};

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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
      console.log(newItem.id, newItem.value);

      //return new element
      return newItem;

    },

    deleteBudget: function(type, id) {
      var index, ids;
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      //1. Calculate total income and exoenses
        calculateTotal('exp');
        calculateTotal('inc');
      //2. Calculate budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;
      //3. Calculate percentages of income already spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

  var formatNumber = function(num, type) {
      var int, dec, numSplit;

      num = Math.abs(num);
      num = num.toFixed(2);

      numSplit = num.split('.');
      int = numSplit[0];
      if (int.length > 3) {
        int = int.substr(0, int.length -3) + ',' + int.substr(int.length -3, 3);
      }

      dec = numSplit[1];

      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.type).value,
        description: document.querySelector(DOMstrings.description).value,
        value: parseFloat(document.querySelector(DOMstrings.value).value)
      };
    },

    addListItem: function(obj, type) {
              var html, newHtml, element;
              // Create HTML string with placeholder text

              if (type === 'inc') {
                  element = DOMstrings.incomeContainer;

                  html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              } else if (type === 'exp') {
                  element = DOMstrings.expensesContainer;

                  html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              }

              // Replace the placeholder text with some actual data
              newHtml = html.replace('%id%', obj.id);
              newHtml = newHtml.replace('%description%', obj.description);
              newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

              // Insert the HTML into the DOM
              document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
          },

    getDOMobject: function() {
      return DOMstrings;
    },

    changedType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.input + ',' +
        DOMstrings.description + ',' +
        DOMstrings.value);

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });
    },

    deleteListItem: function(selectorID) {
      var el;
      el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.description + ', ' + DOMstrings.value);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
        current.description = "";
      });
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }

      //budget: data.budget,
      //totalInc: data.totals.inc,
      //totalExp: data.totals.exp,
      //percentage: data.percentage
    },

    displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

    },

    displayMonth: function() {
      var now, year, month, months;
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.type).addEventListener('change', uiCtrl.changedType);
    });
  };

  var updateBudget = function() {
    //1. Calculate the budget
      budgetCtrl.calculateBudget();
    //2. Return the budget
      var budget = budgetCtrl.getBudget();
    //3. Display the budget on the UI
      uiController.displayBudget(budget);
    //4. Update percentages
      updatePercentages();
  };

  var updatePercentages = function() {
    //1.Calculate percentages
      budgetCtrl.calculatePercentages();
    //2. Read the percentages from the budgetController
      var percentages = budgetCtrl.getPercentages();
    //3. Display percentages to the UI
      console.log(percentages);
  };

  var ctrlAddItem = function() {
    var input, newItem;

    //1. Get the field input data
    input = uiCtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
    //2. Add an item into budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    //3. Add an item into UI
    uiCtrl.addListItem(newItem, input.type);
    //4. CLear the input fields
    uiCtrl.clearFields();
    //5. Calculate and update budget
    updateBudget();
    //6. Calculate and update percentages
    updatePercentages();
    }
  };

  function ctrlDeleteItem(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. Delete an item from th data structure
      budgetCtrl.deleteBudget(type, ID);
      //2. Delete an item from the UI
      uiCtrl.deleteListItem(itemID);
      //3. Update and show the new budget
      updateBudget();
    }
  }

  return {
    init: function () {
      uiCtrl.displayMonth();
      console.log('Application has started.');
      uiController.displayBudget({budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: -1});
      setupEventListeners();
    }
  };
})(budgetController, uiController);

controller.init();
