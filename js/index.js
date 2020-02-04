document.addEventListener("DOMContentLoaded", function() {
// CODE STARTS HERE

    /**** DOM ELEMENTS ****/
const bookList = document.getElementById("list");
const showPanel = document.getElementById("show-panel");

let allBooks = [];
let currentUser = {
  id: 1,
  username: "pouros"
}
let currentBook;
let likeButton;


    /**** EVENT LISTENERS ****/
bookList.addEventListener("click", handleBookClick);

    /**** EVENT HANDLERS ****/
function handleBookClick(event) {
  if (event.target.className == "book-li") {
    clickedBook = allBooks.find( book => book.id === parseInt(event.target.id) );
    renderBookToShowPanel(clickedBook);
  }
};

function handleBookLike(event) {
  if (!!currentBook.users.find( user => user.id === currentUser.id)) {
    // alert("You've already liked this book, silly!");
    usersWhoHaveLiked = currentBook.users;
    usersWhoHaveLiked.pop(currentUser);
    patchLikeToBook(usersWhoHaveLiked);
  } else {
    usersWhoHaveLiked = currentBook.users;
    usersWhoHaveLiked.push(currentUser);
    patchLikeToBook(usersWhoHaveLiked);
  }
};

    /**** FETCHES ****/
const initialBookFetch = function() {
  fetch('http://localhost:3000/books')
  .then( response => response.json() )
  .then( books => {
    allBooks = books;
    renderAllBooks(books) 
  });
}

const patchLikeToBook = function(usersWhoHaveLiked) {
  return fetch(`http://localhost:3000/books/${currentBook.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      users: usersWhoHaveLiked
    })
  })
  .then( response => response.json() )
  .then( book => renderBookToShowPanel(book) )
}

    /**** RENDER FUNCTIONS ****/
function renderOneBook(book) {
  bookLi = document.createElement("li");
  bookLi.id = book.id;
  bookLi.className = "book-li";
  bookLi.textContent = book.title;

  bookList.append(bookLi);
};
function renderAllBooks(books) {
  books.forEach( book => renderOneBook(book) );
};

function renderBookToShowPanel(book) {
  clearChildren(showPanel);
  currentBook = book;
  showPanel.innerHTML = `
    <h2>${book.title}</h2>
    <img src=${book.img_url}>
    <p>${book.description}</p>
    <h5>Users who have liked this book:</h5>
    <ul id="users-who-liked">
    </ul>
    <button id="like-button">Like This Book</button>
  `
  likeButton = document.getElementById("like-button");
  likeButton.addEventListener("click", handleBookLike);

  book.users.forEach( user => renderUserWhoLiked(user) );
}
function renderUserWhoLiked(user) {
  let usersWhoLikedList = document.getElementById("users-who-liked");
  let userWhoLikedLi = document.createElement("li");
  userWhoLikedLi.id = user.id;
  userWhoLikedLi.innerHTML = `<h4>${user.username}</h4>`;

  usersWhoLikedList.append(userWhoLikedLi);
};

    /**** MISC. FUNCTIONS ****/
function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

    /**** INITIAL RUNNERS ****/
initialBookFetch();

// CODE ENDS HERE
});
