const axios = require('axios');
let items = document.querySelectorAll('.catalog-item');

items.forEach((item, index) => {
    let button = item.querySelector('.button');
    if(button) {
        let dataName = button.getAttribute('data-name'),
            dataAdded = localStorage.getItem('data-added'+ index),
            load = () => {
                button.disabled = true;
                button.innerHTML = "<svg class=\"button__spinner\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#spinner\"></use></svg>";
            },
            add = () => {
                setTimeout(() => {
                    button.disabled = false;
                    button.setAttribute('data-added', '');
                    button.innerHTML = "<svg class=\"button__icon\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#check-mark\"></use></svg><span>В корзине</span>";
                }, 500);
                localStorage.setItem('data-added'+ index,'data-added');
            },
            remove = () => {
                setTimeout(() => {
                    button.disabled = false;
                    button.removeAttribute('data-added');
                    button.innerHTML = dataName;
                }, 500);
                localStorage.removeItem('data-added'+ index);
            };

        button.addEventListener('click', () => {
            if (button.hasAttribute('data-added')) {
                load();
                axios.get('https://jsonplaceholder.typicode.com/posts/1')
                .then(() => {
                    remove();
                })
                .catch(error => {
                    console.log(error);
                    add();
                });
            } else {
                load();
                axios.get('https://jsonplaceholder.typicode.com/posts/1')
                .then(() => {
                    add();
                })
                .catch(error => {
                    console.log(error);
                    remove();
                });
            }
        });

        (dataAdded) ? add() : remove();
    }
});
