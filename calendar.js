console.clear();
// CONSTANTS
var months = ["january","february","march","april","may","june", "july", "august", "september", "october", "november", "december"];

var KEY_EVENTS = {
  DIRECTION_PAD_LEFT: 37,
  DIRECTION_PAD_UP: 38,
  DIRECTION_PAD_RIGHT : 39,
  DIRECTION_PAD_DOWN: 40,
  ENTER: 13
}

// DOM ELEMENTS
var monthSelector = document.querySelector(".month-selector");
var prevMonthButton = monthSelector.querySelector(".month-nav-icon.prev-icon");
var nextMonthButton = monthSelector.querySelector(".month-nav-icon.next-icon");
var currentMonthContainer = monthSelector.querySelector(".current-month-container");
var weekRowsContainer = document.querySelector(".weeks-container");
var yearListContainer = document.querySelector(".year-selector"); 

var today = new Date()
var currentDateObj, currentMonthIndex, monthIndex;

var GeneratedDateObj = function(date = 1, currentMonthDate = false, currentDate = false, nextMonthDate = false, disabled = false){
  return {
    date:date,
    currentMonthDate: currentMonthDate,
    currentDate: currentDate,
    nextMonthDate: nextMonthDate, 
    disabled: disabled,
  }
}

// DYNAMIC UL LI GENERATOR FUNCTIONS
var generateDateLi = function(dateObj={}){
  var dateLi = document.createElement("li");
  var spanEl = document.createElement("span");
  spanEl.classList.add("date-container");
  if(dateObj.currentMonthDate){
    spanEl.classList.add("selected");
  }
  if(dateObj.currentDate){
    spanEl.classList.add("today");
  }
  spanEl.innerHTML = dateObj.date;
  dateLi.appendChild(spanEl);
  return dateLi;
}

var generateWeekRows = function(index = 1, dateArray = []){
  var weekUl = document.createElement("ul");
  weekUl.classList.add("week-row", `week-${index}-row`);
  for(var i = 0; i < dateArray.length; i++){
    weekUl.appendChild(generateDateLi(dateArray[i]));
  }
  return weekUl;
}

var generateMonthDates = function(index = 1, dateArray = []){
  weekRowsContainer.appendChild(generateWeekRows(index, dateArray));
  setYear();
}

var cleanMonthDates = function(){
  while (weekRowsContainer.firstChild) {
    weekRowsContainer.removeChild(weekRowsContainer.firstChild);
  }
}

var generateYearLi = function(year){
  var yearLi = document.createElement("li");
  yearLi.classList.add("year");
  if(year === currentDateObj.getFullYear()){
    yearLi.classList.add("selected");
  };
  yearLi.innerHTML = year;
  return yearLi;
}

var setYear = function(){
  clearYearList();
  var currentYear = currentDateObj.getFullYear();
  for(var i = 2; i > -3; i--){
    yearListContainer.appendChild(generateYearLi(currentYear - i));
  }
}

var clearYearList = function(){
  while (yearListContainer.firstChild) {
    yearListContainer.removeChild(yearListContainer.firstChild);
  }
}

// FUNCTION FOR SETTING MONTH AND YEAR
var setMonth = function(index){
  monthIndex = monthIndex >= 0 ? index % 12 : 11;
  currentDateObj.setMonth(index);
  setWeeks(currentDateObj);
  currentMonthContainer.innerHTML = months[currentDateObj.getMonth()];
}

var setNextYear = function(){
  setMonth(monthIndex + 12);
}

var setPrevYear = function(){
  setMonth(monthIndex - 12);
}

var checkDateFallsInCurrentMonth = function(dateObject){
  if(dateObject.getMonth() === monthIndex){
    return true;
  }
  return false;
}

var init = function(){
  currentDateObj = new Date(today);
  currentDateObj.setDate(1);
  currentMonthIndex = currentDateObj.getMonth();
  monthIndex = currentMonthIndex;
  setMonth(currentMonthIndex);
}

var reset = init;

// ARRAY FOR EVERY WEEKS AND DATE OF PARTICULAR MONTH
var setWeeks = function(dateReference){
  var selectedDate = new Date(dateReference.getTime());
  var weeks = [];
  monthStartingDay = selectedDate.getDay();
  selectedDate.setDate(-1 * monthStartingDay);
  cleanMonthDates();
  for(var i = 0; i < 6; i++){
    var dateObjArray = [];
    for(var j = 0; j < 7; j++){
      selectedDate.setDate(selectedDate.getDate() + 1);
      dateObjArray.push(new GeneratedDateObj(selectedDate.getDate(), monthIndex === selectedDate.getMonth(), today.getTime() === selectedDate.getTime()));
    }
    generateMonthDates(i, dateObjArray);
  }
}

// FOR KEYDOWN EVENT AND FOR MONTH NAVIGATION
window.addEventListener("keydown", function(event){
  if(document.activeElement === monthSelector){
    if(event.which === KEY_EVENTS.DIRECTION_PAD_LEFT){
      setMonth(monthIndex - 1);
    }
    else if(event.which === KEY_EVENTS.DIRECTION_PAD_RIGHT){
      setMonth(monthIndex + 1);
    }
  }
})

// EVENT LISTENER ON MONTH NAVIGATION BUTTON
nextMonthButton.addEventListener('click', function(){
  setMonth(monthIndex + 1);
  // console.log(this.parentNode);
//   animate({
//   duration: 600,
//   timing(x, timeFraction) {
//     return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x);
//   },
//   draw(progress) {
//     currentMonthContainer.style.transform = `translateY(${progress*-35}px)`;
//   }
// });
});
prevMonthButton.addEventListener('click', function(){
  setMonth(monthIndex - 1);
});

// SWIPE FEATURE WITH HAMMER.JS LIBRARY
var mc = new Hammer(monthSelector);
mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL,threshold: 30 });
mc.on("swipeleft", function(ev) {
    setMonth(monthIndex + 1);
});
mc.on("swiperight", function(ev) {
    setMonth(monthIndex + 1);
});

// INITAIALIZATION 
init();
setNextYear();

function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction goes from 0 to 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // calculate the current animation state
    let progress = timing(1.5,timeFraction)

    draw(progress); // draw it

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}
    
