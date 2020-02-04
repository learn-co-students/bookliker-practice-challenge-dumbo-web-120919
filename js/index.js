document.addEventListener("DOMContentLoaded", function() {

/*** DOM Elements ***/
const listUl = document.querySelector("#list")
const showDiv = document.querySelector("#show-panel")

/*** Initial Fetch ***/
fetch("http://localhost:3000/books")
.then(r => r.json())
.then(data => {
    renderAllBooks(data)
})

function renderAllBooks(data) {
    data.forEach(book => renderOneBook(book))
}

function renderOneBook(book) {
    // show sidebar book list
    const listLi = document.createElement("li")
    listLi.innerText = book.title
    listUl.append(listLi)

    // create click event on book list
    listLi.addEventListener("click", () => handleBookClick(book))

}


// click on a book, you should see the book's thumbnail and description and a list of users who have liked the book
function handleBookClick(book) {
    // clear the stage
    showDiv.innerHTML = ""

    // show book info
    const bookTitle = document.createElement("h2")
    bookTitle.innerText = book.title
    const bookImg = document.createElement("img")
    bookImg.src = book.img_url
    const bookDesc = document.createElement("p")
    bookDesc.innerText = book.description
        
        
    // show list of users who have liked the book
    const userContainer = document.createElement("div")
    const userUl = document.createElement("ul")
    

    book.users.forEach(user => {
        const userLi = document.createElement("li")
        userLi.innerText = user.username
        userUl.append(userLi)
        userContainer.append(userUl)
    })

    // create "like" btn, add click event to it
    const likeBtn = document.createElement("button")
    likeBtn.innerText = "Like This Book"
    likeBtn.addEventListener("click", () => handleLike(book))
    
    // adding them all to show-panel div
    showDiv.append(bookTitle, bookImg, bookDesc, userContainer, likeBtn)
}

/*** Helper Functions (event handlers, etc) ***/
function handleLike(book) {

    // You are user 1 {"id":1, "username":"pouros"}
    // send a PATCH request to http://localhost:3000/books/:id with an array of users who like the book
    // This array should be equal to the existing array of users that like the book, plus your user
    const updatedUser = { "id":1, "username":"pouros" }
    
    if (book.users.length > 1) {
        book.users.push(updatedUser)
    } else {
        book.users = []
        book.users.push(updatedUser)
    }


    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(book)
    })
    .then(r => r.json())
    .then(newBookInfo => {
        // console.log(book.users)
        handleBookClick(newBookInfo)
    })

} 


// END OF CODE
});
