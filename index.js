let name = document.querySelector('#name'),
    secondName = document.querySelector('#secondName'),
    email = document.querySelector("#email"),
    btn = document.querySelector('.btn'),
    users = document.querySelector('.users'),
    clear = document.querySelector('.clear'),
    city = document.querySelector('.city')

// Объект для localStorage
let storage = JSON.parse(localStorage.getItem('users')) || {}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length || mutation.removedNodes.length ) {
            console.log("Карта USERS обновилась")
            setListeners()

        if (btn.getAttribute('data-change')) {
            const item = btn.getAttribute('data-change')
            if (item !== email.value) {
              document.querySelector(`[data-out="${item}"]`).remove()
              delete storage[item]
              localStorage.setItem('users', JSON.stringify(storage))
              btn.setAttribute('data-change', '')
            }
        }
        }
    })
})

observer.observe(users, {
    childList: true
})

btn.addEventListener('click', getData)
clear.addEventListener('click', clearLocalStorage)

function getData(e) {
    e.preventDefault()
    const data = {}

    if (email.value === '') return

    data.name = name.value || ''
    data.secondName = secondName.value || ''
    data.email = email.value || ''
    data.city = city.value || ''

    const key = data.email
    storage[key] = data

    localStorage.setItem('users', JSON.stringify(storage))

    rerenderCard(JSON.parse(localStorage.getItem('users')))

    return data
}

function createCard({ name, secondName, email, city }) {
    return `
        <div data-out=${email} class="user-outer">
            <div class="user-info">
                <p>Name: ${name}</p>
                <p>Second name: ${secondName}</p>
                <p>Email: ${email}</p>
                <p>City: ${city}</p>
            </div>
            <div class="menu">
                <button data-delete=${email} class="delete">Удалить</button>
                <button data-change=${email} class="change">Применить/Изменить</button>
            </div>
        </div>
    `
}

function rerenderCard(storage) {
    users.innerHTML = ''

    /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
     */

    /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
     */

    Object.entries(storage).forEach(user => {
        // user = ['email1', {name: '', secondName: '', email: ''}]
        const [email, userData] = user
        console.log("USER  === ", user)
        console.log("EMAIL === ", email)
        console.log("DATA  === ", userData)

        const div = document.createElement('div')
        div.className = 'user'
        div.innerHTML = createCard(userData)
        users.append(div)
    })
}

function setListeners() {
    const del = document.querySelectorAll('.delete')
    const change = document.querySelectorAll('.change')
    let clicked

    del.forEach(n => {
        n.addEventListener('click', () => {
            clicked = n.getAttribute('data-delete')

            const outer = document.querySelector(`[data-out="${clicked}"]`)
            outer.remove()
            delete storage[clicked]
            localStorage.setItem('users', JSON.stringify(storage) )
        })
    })

    change.forEach(n => {
        n.addEventListener('click', () => {
            clicked = n.getAttribute('data-change')
            name.value = storage[clicked].name
            secondName.value = storage[clicked].secondName
            email.value = storage[clicked].email
            city.value = storage[clicked].city
            btn.setAttribute('data-change', clicked)
        })
    })
}

function clearLocalStorage() {
    window.location.reload()
    localStorage.removeItem('users')
}

function show(el) {
    el.style.display = 'block'
}

function hide(el) {
    el.style.display = 'none'
}

window.onload = rerenderCard(JSON.parse(localStorage.getItem('users')))
