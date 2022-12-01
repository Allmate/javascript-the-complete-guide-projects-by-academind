'use strict';

const listEl = document.querySelector('.posts');
const postTemplateEl = document.getElementById('single-post');
const fetchPostsBtn = document.querySelector('#available-posts button');
const createPostBtn = document.querySelector('form button');

const sendHttpRequest = function (method, url, data = null, responseType = 'json') {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.responseType = responseType;

        xhr.onload = function () {
            if(xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            }

            reject(new Error('cannot fetch posts!'));
        };

        xhr.onerror = function () {
            // call func for network issue
            reject(new Error('failed to send request!'));
        };

        if(data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));

            return;
        }

        xhr.send();
    });
};

const fetchPosts = async function () {
    const posts = await sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts')
        .catch(error => {
            console.log(error.message);
        });

    posts?.forEach(post => {
        const postEl = document.importNode(postTemplateEl.content, true);
        postEl.querySelector('h2').textContent = post.title.toUpperCase();
        postEl.querySelector('p').textContent = post.body;
        postEl.querySelector('li').dataset.postId = post.id;
        listEl.appendChild(postEl);
    });
};

const createPost = async function (title, body) {
    const post = {
        id: Math.random(),
        title,
        body
    };

    const {id: postId} = await sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);

    return postId;
};

const deletePost = async function (id) {
    return await sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${id}`);
};

fetchPostsBtn.addEventListener('click', fetchPosts);

createPostBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const postTitle = document.getElementById('title').value.trim();
    const postContent = document.getElementById('content').value.trim();

    createPost(postTitle, postContent).then(console.log);

    document.querySelector('form').reset();
});

listEl.addEventListener('click', async (event) => {
    if(event.target.tagName === 'BUTTON') {
        const postId = event.target.closest('li').dataset.postId;
        deletePost(postId).then(console.log);
    }
});