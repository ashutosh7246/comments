
var comments = [];
var ids = [];
function oninit() {
    if (localStorage.getItem('comments')) {
        var listContainer = document.getElementById('comment_list');
        comments = localStorage.getItem('comments');
        comments = JSON.parse(comments);
        let html = renderList(comments);
        listContainer.innerHTML = html;
        events();
    }
}

function addNewComment() {
    var listContainer = document.getElementById('comment_list');
    let value = document.getElementById('comment_id').value;
    if (value && value.length <= 200) {
        let timestamp = new Date().getTime();
        comments.push({
            id: timestamp,
            text: value,
            timestamp: timestamp,
            replies: []
        });
        let html = renderList(comments);
        localStorage.setItem('comments', JSON.stringify(comments));
        listContainer.innerHTML = html;
        events();
        document.getElementById('comment_id').value = '';
    }
}

function events() {
    var listContainer = document.getElementById('comment_list');
    setTimeout(() => {
        ids.forEach(id => {
            if (id) {
                if (document.getElementById(id + 'btn')) {
                    if (document.getElementById(id + 'btn').getAttribute('listener') !== 'true') {
                        document.getElementById(id + 'btn').addEventListener("click", function () {
                            let value = document.getElementById(id + 'input').value;
                            if (value && value.length <= 200) {
                                updateList(comments, value, id);
                                localStorage.setItem('comments', JSON.stringify(comments));
                                let html = renderList(comments);
                                listContainer.innerHTML = html;
                                events();
                                document.getElementById(id + 'input').value = '';
                            }
                        });
                    }
                }
                if (document.getElementById(id + 'btnrm')) {
                    if (document.getElementById(id + 'btnrm').getAttribute('listener') !== 'true') {
                        document.getElementById(id + 'btnrm').addEventListener("click", function () {
                            comments = removeFromList(comments, id);
                            localStorage.setItem('comments', JSON.stringify(comments));
                            let html = renderList(comments);
                            listContainer.innerHTML = html;
                            events();
                        });
                    }
                }
            }
        });
    }, 10);
}

function renderList(comnts) {
    let ul = `<ul>`;
    for (let i = 0; i < comnts.length; i++) {
        let node = createNode(comnts[i]);
        ul = ul + node;
        if (comnts[i].replies && comnts[i].replies.length) {
            let inner = renderList(comnts[i].replies);
            ul = ul + inner;
        }
    }
    ul = ul + `</ul>`;
    return ul;
}

function createNode(comment) {
    let node = `<li><div class="card">
   <div class="card-body">
     <h6 class="card-subtitle mb-2 text-muted">${comment.timestamp}</h6>
     <p class="card-text">${comment.text}</p>
     <input type="text" class="form-control" id="${comment.timestamp}input" placeholder="Reply" style="margin-bottom: 5px;">
     <button type="button" class="btn btn-primary" id="${comment.timestamp}btn">Reply</button>
     <button type="button" class="btn btn-primary" id="${comment.timestamp}btnrm">Remove</button>
   </div>
 </div></li>`;
    ids.push(comment.timestamp);
    return node;
}

function updateList(cmnts, value, id) {
    for (let i = 0; i < cmnts.length; i++) {
        if (cmnts[i].id === id) {
            let timestamp = new Date().getTime();
            cmnts[i].replies.push({
                id: timestamp,
                text: value,
                timestamp: timestamp,
                replies: []
            });
            break;
        }
        if (cmnts[i].replies && cmnts[i].replies.length) {
            updateList(cmnts[i].replies, value, id);
        }
    }
}

function removeFromList(cmnts, id) {
    for (let i = 0; i < cmnts.length; i++) {
        if (cmnts[i].id === id) {
            cmnts = cmnts.filter(el => el.id !== id);
            break;
        }
        if (cmnts[i].replies && cmnts[i].replies.length) {
            cmnts[i].replies = removeFromList(cmnts[i].replies, id);
        }
    }
    return cmnts;
}
