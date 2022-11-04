// dom elementlari
const elForm = document.querySelector(".book-form");
const elInput = elForm.querySelector(".search-input");
const elSelectLanguage = elForm.querySelector("#language");
const elSelectSorting = elForm.querySelector(".select-search");
const elList = document.querySelector(".list");
const languageLists = [];
const newlanguageLists = [];

// template 
let elTemplate = document.querySelector(".template").content;

// languagesni yig'ib oluvchi funksiya
function collectLanguages() {
    books.forEach(item => {
        const findBooks = item.language;
      newlanguageLists.push(findBooks)
        newlanguageLists.forEach(element => {
            if (!languageLists.includes(element)) {
                languageLists.push(element);
            }
        });
    });
    languageLists.sort();
};

// selectga render qiluvchi funksiya
function showLanguages() {
    const newFragment = document.createDocumentFragment();
    languageLists.forEach(item => {
        const newOption = document.createElement("option");
        
        newOption.textContent = item;
        newOption.value = item;
        newFragment.appendChild(newOption);
    });
    elSelectLanguage.appendChild(newFragment);
}



// booksni render qiluvchi funksiya
function showbooks(books, titleRegex = "") {
    elList.innerHTML = "";
    const fragment = new DocumentFragment();
    
    for (const book of books) {
        
        let cloneTemplate = elTemplate.cloneNode(true);
        
        if (titleRegex.source !== "(?:)" && titleRegex) {
            cloneTemplate.querySelector(".title").innerHTML = book.title.replace(titleRegex,
                `<mark class="bg-warning"> ${titleRegex.source}</mark>`);
        } else {
            cloneTemplate.querySelector(".title").textContent = book.title;
        }

        cloneTemplate.querySelector(".book").src = book.imageLink;
        cloneTemplate.querySelector(".page").textContent = book.pages;
        cloneTemplate.querySelector(".author").textContent = book.author;
        cloneTemplate.querySelector(".year").textContent = book.year;
        cloneTemplate.querySelector(".language").textContent = book.language;
        cloneTemplate.querySelector(".wiki").href = book.link;
        
        fragment.appendChild(cloneTemplate);
    }
    elList.appendChild(fragment);
};

// search qiluvchi funksiya
function searchBook(item) {
    return books.filter(element => {
        return element.title.match(item) && (elSelectLanguage.value === "all" || element.language.includes(elSelectLanguage.value))
    });
};

// sorting function
function sorting(sorted, type) {
    if (type === "a_z") {
        sorted.sort((a,b) => a.title.localeCompare(b.title))
    }else if(type === "z_a") {
        sorted.sort((a,b) => b.title.localeCompare(a.title))
    }else if (type === "tohigh") {
        sorted.sort((a,b) => a.year - b.year)
    }else if (type === "tolow") {
        sorted.sort((a,b) => b.year - a.year)
    }else if (type === "pagestoup") {
        sorted.sort((a,b) => a.pages - b.pages)
    }else if (type === "pagestodown") {
        sorted.sort((a,b) => b.pages - a.pages)
    }
};

elForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    
    const searchElement = new RegExp(elInput.value.trim(), `gi`);
    const searchlist = searchBook(searchElement);
    
    if (searchlist.length > 0) {
        sorting(searchlist, elSelectSorting.value);
        showbooks(searchlist, searchElement)
    } else {
        alert("NOT FOUND");
    }
    
    
});

collectLanguages();
showLanguages();
showbooks(books);