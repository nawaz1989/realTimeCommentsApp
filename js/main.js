var socket = io.connect('http://' + location.host);

$(document).ready(function(){

    var Chat = (function() {
        var init = function() {
            $('form').on('submit', submitForm);
        };

        var submitForm = function(e) {
            e.preventDefault();
            var comment = $('#comment').val();
            var bold = $('#B').is(':checked');
            var italic = $('#I').is(':checked');
            var underline = $('#U').is(':checked');
            socket.emit('send', {
                message: comment,
                time: Date.now(),
                bold: bold,
                italic: italic,
                underline: underline
            });
        }

        return {init: init};
    })()
    
    Chat.init();

    var Posts = (function() {

        var init = function() {
            socket.on('post', function(data) { postComment(data)});
            var posts = formatPosts()
            setPostsHtml(posts);
        };

        var postComment = function(data) {
            if(data.message) {
                var posts = formatPosts()
                posts = posts.concat(data);
                localStorage.setItem('posts', JSON.stringify(posts));
                setPostsHtml(posts);
                
                
            } else {
                console.log('There is a problem: ', data);
            }
        };

        var setPostsHtml = function(posts) {
            var html = '';
            posts.map(function(post) {
                html += '<div class="' + getClass(post) + '">' + post.message + '<span>' + getTime(post.time)+ ' seconds ago</span></div>';
            });

            $('#posts').html(html);
        }

        var getTime = function(time) {
            return (Date.now()  - time)/ (1000);
        }

        var getClass = function(data) {
            className = '';
            if(data.bold) {
                className += 'bold';
            }
            if(data.italic) {
                className += ' italic';
            }
            if(data.underline) {
                className += ' underline';
            }

            return className;
        }

        var getPosts = function() {
            return localStorage.getItem('posts');
        }

        var formatPosts = function(posts) {
            posts = getPosts();
            if(!posts) {
                posts = [];
            } else {
                posts = JSON.parse(posts);
            }

            return posts;
        }

        return {init: init};
    })();
    
    Posts.init();

});
