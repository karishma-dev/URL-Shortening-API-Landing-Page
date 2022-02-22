// Variables
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navItem = document.querySelectorAll(".nav-item");
const urlInput = document.getElementById("url-input");
const form = document.forms.url_form;
const submitBtn = document.getElementById("submit-url");
const result = document.querySelector(".result");
const errorBox = document.getElementById("error");

// Eventlistener to open/close mobile navigation menu
hamburger.addEventListener("click", function(){
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
})

// Eventlistener to close mobile navigation menu
navItem.forEach((item) => {
     item.addEventListener("click", function(){
       hamburger.classList.remove("active")
       navMenu.classList.remove("active");
     })
});

// Function that generates the resultCard containing short link
const resultCard = function(link, shortLink){
    urlInput.value = "";
    return `<div class = "result-card col-12">
                <span class="result-url">${link}</span>
                <div class="short-link">
                  <a href="https://${shortLink}" target="_blank">https://${shortLink}</a>
                  <button class="main-btns copy-btn">Copy</button>
                </div>
            </div>`;
}

// Function to generate shortLink
async function getShortLink() {
    let link = urlInput.value;
    let ok;
    submitBtn.innerHTML = "Loading..."
  
    let res = await fetch(`https://api.shrtco.de/v2/shorten?url=${link}`).then(async (res) => {
      let data = await res.json();
      
      if (res.ok) {
        ok = true;
        return data;
      }
  
      if (data.error_code == 2) {
        ok = res.ok;
        return;
      }
  
      ok = res.ok;

    });
  
    submitBtn.innerHTML = 'Shorten it!' 
    if (!ok) {
        return
    };
  
    result.insertAdjacentHTML(
      "afterbegin",
      resultCard(link, res.result.short_link3)
    );
  
}

// EventListener to call the getShortLink() after the form is submited
form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!urlInput.value) {
    showError("Please add a link", false);
    return;
  }

  showError("", true);
  getShortLink();

});
  
// Toggle error function to show error
function showError(content, toggleRemove) {
  if (!toggleRemove) {
    urlInput.classList.add("error-outline");
    errorBox.innerHTML = content;
    return;
  }
  
  urlInput.classList.remove("error-outline");
  errorBox.innerHTML = "";
}

document.addEventListener('click', function (event) {
    if (!event.target.classList.contains('copy-btn')) return;

    let short_link = event.target.parentNode.querySelector('.short-link > a');
 
    navigator.clipboard.writeText(short_link.href);

    event.target.classList.add('copied');
    event.target.textContent = 'Copied!';
    
    setTimeout(() => {
        event.target.classList.remove('copied')
        event.target.textContent = 'Copy'
    }, 2500)

})