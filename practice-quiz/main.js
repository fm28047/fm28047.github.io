function toggleLightMode(init=0) {
    var theme_choice;
    var element = document.body
    if (init===1) {
      theme_choice = localStorage.getItem("light_mode");
    }
    else {
      if (element.classList.contains("light-mode")) {
        theme_choice = "dark";
      } else {
        theme_choice = "light";
      }
    }
    localStorage.setItem("light_mode", theme_choice);
    if (theme_choice == "light") {
      element.classList.add("light-mode");
    } else {
      element.classList.remove("light-mode");
    }
  }

toggleLightMode(1)

var website_name = 'http://thisisau.github.io'

class Header extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <table class="header-content"><tr>
            <td class="home-link">&nbsp;</td>
            <td class="light-dark"><a href="#" onclick="parent.toggleLightMode()">Light/Dark</a></td>
        </tr></table>
      `;
    }
  }

function setHTML(className, displayValue) {
    var items = document.getElementsByClassName(className);
    for (var i=0; i < items.length; i++) {
        items[i].innerHTML = displayValue;
    }
  }

function idHTML(idName, displayValue) {
    document.getElementById(idName).innerHTML = displayValue;
}

customElements.define('main-header', Header);

function randint(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function invert(dictionary){
  var inverted = {};
  for(key in dictionary){
    inverted[dictionary[key]] = key;
  }
  return inverted;
}

function getPromiseFromEvent(item, event) {
  return new Promise((resolve) => {
    const listener = () => {
      item.removeEventListener(event, listener);
      resolve();
    }
    item.addEventListener(event, listener);
  })
}

function randomProperty(obj) {
  var keys = Object.keys(obj);
  return obj[keys[ keys.length * Math.random() << 0]];
}

function randomKey(obj) {
  var keys = Object.keys(obj);
  return keys[ keys.length * Math.random() << 0];
}

function randomListItem(list) {
  return list[ list.length * Math.random() << 0];
}