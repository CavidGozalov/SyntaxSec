document.addEventListener("DOMContentLoaded", async () => {
    const feed = document.getElementById("feed");
    const filtersContainer = document.getElementById("filters");
    
    if (!feed) return;

    const { data: articles, error } = await _supabase
        .from('articles')
        .select('*, comments(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching articles:', error);
        feed.innerHTML = `<p>Failed to load articles from database.</p>`;
        return;
    }

    if (!articles || articles.length === 0) {
        feed.innerHTML = `<p>No articles found yet.</p>`;
        return;
    }

    function displayArticles(articlesToDisplay) {
        feed.innerHTML = '';
        articlesToDisplay.forEach(article => {
            const card = document.createElement('div');
            card.className = 'card';
            
            let commentsHtml = '';
            if (article.comments && article.comments.length > 0) {
                article.comments.forEach(comment => {
                    commentsHtml += `
                        <div class="comment-item">
                            <strong>${escapeHtml(comment.author_name)}:</strong> ${escapeHtml(comment.content)}
                            <div class="comment-reactions">
                                <button class="comment-like-btn" data-comment-id="${comment.id}">
                                    👍 (<span class="comment-like-count">${comment.likes || 0}</span>)
                                </button>
                                <button class="comment-dislike-btn" data-comment-id="${comment.id}">
                                    👎 (<span class="comment-dislike-count">${comment.dislikes || 0}</span>)
                                </button>
                            </div>
                        </div>
                    `;
                });
            } else {
                commentsHtml = `<p style="font-size: 13px; color: #64748b;">No comments yet. Be the first!</p>`;
            }

            card.innerHTML = `
                <span class="tag">${escapeHtml(article.tag || 'General')}</span>
                <h3>${escapeHtml(article.title)}</h3>
                <p>${escapeHtml(article.content)}</p>
                <span class="date">${escapeHtml(article.date || new Date(article.created_at).toLocaleDateString())}</span>

                <div class="reaction-container">
                    <button class="like-btn" data-id="${article.id}">
                        👍 Like (<span class="like-count">${article.likes || 0}</span>)
                    </button>
                    <button class="dislike-btn" data-id="${article.id}">
                        👎 Dislike (<span class="dislike-count">${article.dislikes || 0}</span>)
                    </button>
                </div>

                <div class="comments-section">
                    <h4>Comments</h4>
                    <div class="comments-list">
                        ${commentsHtml}
                    </div>
                    <form class="comment-form" data-id="${article.id}">
                        <input type="text" name="author" placeholder="Your Name" required>
                        <textarea name="content" placeholder="Write a comment..." required></textarea>
                        <button type="submit" class="comment-submit-btn">Post Comment</button>
                    </form>
                </div>
            `;
            feed.appendChild(card);
        });

        attachEventListeners(articlesToDisplay);
    }

    function escapeHtml(str) {
        return str ? String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
    }

    function attachEventListeners(currentArticles) {
        document.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const articleId = button.getAttribute('data-id');
                const article = currentArticles.find(a => a.id == articleId);
                const newLikes = (article.likes || 0) + 1;

                const { error } = await _supabase
                    .from('articles')
                    .update({ likes: newLikes })
                    .eq('id', articleId);

                if (!error) {
                    article.likes = newLikes;
                    button.querySelector('.like-count').textContent = newLikes;
                }
            });
        });

        document.querySelectorAll('.dislike-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const articleId = button.getAttribute('data-id');
                const article = currentArticles.find(a => a.id == articleId);
                const newDislikes = (article.dislikes || 0) + 1;

                const { error } = await _supabase
                    .from('articles')
                    .update({ dislikes: newDislikes })
                    .eq('id', articleId);

                if (!error) {
                    article.dislikes = newDislikes;
                    button.querySelector('.dislike-count').textContent = newDislikes;
                }
            });
        });

        document.querySelectorAll('.comment-like-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const commentId = button.getAttribute('data-comment-id');
                let targetComment = null;
                
                for (const article of currentArticles) {
                    if (article.comments) {
                        targetComment = article.comments.find(c => c.id == commentId);
                        if (targetComment) break;
                    }
                }
                if (!targetComment) return;

                const newLikes = (targetComment.likes || 0) + 1;
                const { error } = await _supabase
                    .from('comments')
                    .update({ likes: newLikes })
                    .eq('id', commentId);

                if (!error) {
                    targetComment.likes = newLikes;
                    button.querySelector('.comment-like-count').textContent = newLikes;
                }
            });
        });

        document.querySelectorAll('.comment-dislike-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const commentId = button.getAttribute('data-comment-id');
                let targetComment = null;

                for (const article of currentArticles) {
                    if (article.comments) {
                        targetComment = article.comments.find(c => c.id == commentId);
                        if (targetComment) break;
                    }
                }
                if (!targetComment) return;

                const newDislikes = (targetComment.dislikes || 0) + 1;
                const { error } = await _supabase
                    .from('comments')
                    .update({ dislikes: newDislikes })
                    .eq('id', commentId);

                if (!error) {
                    targetComment.dislikes = newDislikes;
                    button.querySelector('.comment-dislike-count').textContent = newDislikes;
                }
            });
        });

        document.querySelectorAll('.comment-form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const articleId = form.getAttribute('data-id');
                const authorName = form.querySelector('input[name="author"]').value;
                const content = form.querySelector('textarea[name="content"]').value;

                const { data, error } = await _supabase
                    .from('comments')
                    .insert([
                        { article_id: articleId, author_name: authorName, content: content }
                    ])
                    .select();

                if (error) {
                    console.error('Detailed Supabase Error:', error);
                    alert('Failed to post comment: ' + error.message);
                } else if (data && data.length > 0) {
                    const article = currentArticles.find(a => a.id == articleId);
                    if (!article.comments) article.comments = [];
                    article.comments.push(data[0]);

                    displayArticles(currentArticles);
                }
            });
        });
    }

    displayArticles(articles);

    if (filtersContainer) {
        const tags = ['All', ...new Set(articles.map(a => a.tag || 'General'))];

        filtersContainer.innerHTML = '';
        tags.forEach((tag, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = tag;
            
            if (index === 0) button.classList.add('active');

            button.addEventListener('click', () => {
                filtersContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                if (tag === 'All') {
                    displayArticles(articles);
                } else {
                    const filtered = articles.filter(a => (a.tag || 'General') === tag);
                    displayArticles(filtered);
                }
            });

            filtersContainer.appendChild(button);
        });
    }
});