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
// handles clicking a book on the sidebar, sending it to render
function handleBookClick(event) {
  if (event.target.className == "book-li") {
    clickedBook = allBooks.find( book => book.id === parseInt(event.target.id) );
    renderBookToShowPanel(clickedBook);
  }
};

// handles clicking the like button on a book
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
// initial fetch to render all books on the sidebar
const initialBookFetch = function() {
  fetch('http://localhost:3000/books')
  .then( response => response.json() )
  .then( books => {
    allBooks = books;
    renderAllBooks(books) 
  });
}

// PATCH fetch to add or remove likes from a book
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
// functions to render one/all books to the sidebar
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

// function to render a selected book's info to the body
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
// function to be used to render all users who have liked a book
function renderUserWhoLiked(user) {
  let usersWhoLikedList = document.getElementById("users-who-liked");
  let userWhoLikedLi = document.createElement("li");
  userWhoLikedLi.id = user.id;
  userWhoLikedLi.innerHTML = `<h4>${user.username}</h4>`;

  usersWhoLikedList.append(userWhoLikedLi);
};

    /**** MISC. FUNCTIONS ****/
// standard refresh element function
function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

    /**** INITIAL RUNNERS ****/
// fetches all books and loads the sidebar on init
initialBookFetch();

// CODE ENDS HERE
});
