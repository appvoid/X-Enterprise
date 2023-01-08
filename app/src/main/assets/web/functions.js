// Core functions / data of main program
is_editor_activated = false;
const editor = document.querySelector(".editor")
const searchbar = document.querySelector("#searchbar")
const add_btn = document.querySelector("#add")
const delete_btn = document.querySelector("#delete")

// Common / Global functions
const showEditor = () => {
    editor.style.top = "40%";
    editor.style.opacity = "1";
    is_editor_activated = true;
}

// Search filter function
const search = () => {
    let input, filter, txtValue;
    input = document.getElementById("searchbar");
    filter = input.value.toLowerCase();
    for (const child of list_container.children) {
        txtValue = child.textContent || child.innerText
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            child.style.display = "";
        } else {
            if (filter.length > 0){
                child.style.display = "none";
            } else {
                child.style.display = "";
            }
        }
    }
}

const hideEditor = () => {
    unselectElements()
    is_editor_activated = false;
    editor.style.top = "100%";
    editor.style.opacity = "0";
}

// Useful for better UX
const unselectElements = () => {
    document.querySelectorAll('.list-element').forEach(elem=>{
        elem.classList.remove("element-expansion"); // Avoids expanding all list's elements
    })
}

// Takes an id and removes account from database
const removeAccount = (id) => {
    firebase.firestore().collection("users").doc(id).delete()
    hideEditor()
    list_container.style.opacity = "0";
    setTimeout(()=>{
        list_container.innerHTML = "";
        list_container.style.opacity = "1";
        updateUI(firebase.firestore().collection("users"), list_container)
    },250)

}

// Renders a client label on screen with self-contained html components and methods
const createListElement = (container, doc) => {
    const div = document.createElement('div'); // Element creation
    div.classList.add('list-element');         // Element class
    div.id = doc.id;                           // Element ID
    div.innerText = `${doc.data().firstName} ${doc.data().lastName}` // Element label

    // Expansion toggle logic
    div.addEventListener('click', (e)=>{
        if (is_editor_activated == false){
            // Switches classes list elements off
            unselectElements()
            e.target.classList.add("element-expansion")
            // Editor's show/hide logic
            editor.innerHTML = `<span class="gray">ID: ${e.target.id}</span>
                                <h4>First Name</h4>
                                <input id="firstName" class="prompt" value=${doc.data().firstName}>
                                <h4>Last Name</h4>
                                <input id="lastName" class="prompt" value=${doc.data().lastName.replace(/\s+/g, " ")}>
                                <h4>Addresses</h4>
                                <input id="addresses" style="margin-bottom: 1rem;" class="prompt" value=${doc.data().addresses}>
                                <button class="button" id="save">Save changes</button>
                                <button class="button" id="delete">Delete account</button>
            `
            // Note that we should call the elements from the DOM since we are recycling the UI
            document.querySelector("#save").addEventListener('click', (e)=>{
                firebase.firestore().collection('users').doc(doc.id).update({
                    firstName: document.querySelector("#firstName").value,
                    lastName: document.querySelector("#lastName").value,
                    addresses: document.querySelector("#addresses").value
                });
                list_container.style.opacity = "0";
                setTimeout(()=>{
                    list_container.innerHTML = "";
                    list_container.style.opacity = "1";
                    updateUI(firebase.firestore().collection("users"), list_container)
                },200)
            })
            document.querySelector("#delete").addEventListener('click', (e)=>{
                // This will create an effect of being erased animation
                hideEditor();
                div.style.opacity = "0";
                div.style.height = "0";
                div.style.margin = "0";
                div.style.padding = "0";

                setTimeout(()=> { // Then remove it after some milliseconds
                    removeAccount(div.id)
                }, 100)
            })
            showEditor();
        }  else {
            hideEditor();
        }
    })
    container.append(div);  // Populating to root container
}

// Renderer
const updateUI = (collection, container) => { // This function gets a firestore's collection
  collection.get()
  .then((snapshot) => {
    snapshot.docs.forEach(doc =>{ // Iterates each document in the collection
        createListElement(container, doc)
    })
  });
}

// Events
add.addEventListener('click', (e)=>{ // User registration
    // Editor's show logic
    showEditor();
    editor.innerHTML = `
                        <h4>New account</h4>
                        <input id="fullname" class="prompt" placeholder="First and last name">
                        <input id="address" style="margin-top:.5rem;margin-bottom:.5rem;" class="prompt" placeholder="Address, separated by comma.">
                        <button class="button" id="save">Submit</button>
                        <button class="button" id="delete">Cancel</button>
    `
    // Here we need to refresh the reference of delete element
    // because the element is erased each time we use innerHTML
    document.querySelector("#delete").addEventListener('click', (e)=>{
        hideEditor();
    })
    document.querySelector("#save").addEventListener('click', (e)=>{
        // Hacky way to get lastName
        if (document.querySelector("#fullname").value.length > 0) {
            let firstSpace = document.querySelector("#fullname").value.indexOf(" ");
            let lastName = document.querySelector("#fullname").value.slice(firstSpace);

            // Adds user to database
            firebase.firestore().collection('users').add({
                firstName: document.querySelector("#fullname").value.split(' ')[0],
                lastName: lastName,
                addresses: document.querySelector("#address").value.replaceAll(' ', '_')
            });

            list_container.style.opacity = "0";

            // Timeout useful to give enough time to the database to change before updating UI
            setTimeout(()=>{
                list_container.innerHTML = "";
                list_container.style.opacity = "1";
                updateUI(firebase.firestore().collection("users"), list_container)
                hideEditor();
            },200)
        }
    })
})

searchbar.addEventListener('click', (e)=>{
    is_editor_activated = true; // Trick the system to get a good user experience when hiding searchbar
})