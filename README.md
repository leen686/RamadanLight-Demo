# Ramadan Light — Interactive Portfolio Demo

A separate, static interactive preview of **Ramadan Light**, a collaborative university recipe-sharing web application. This demo does **not** contain or modify the original team's private PHP/MySQL codebase.

## Demo features

- Browse sample Iftar, Suhoor, and snack recipes, with search and category filters.
- Open a recipe to see sample ingredients and preparation steps.
- Save favorites, like recipes, and add demo comments.
- Add, edit, and delete recipes you create in this browser.
- Flag a recipe and try a simplified admin moderation workflow.
- Reset all local demo interactions.

**Important:** The recipes and content are fictional sample data used for demonstration; they are not synced with the original database. This demo does not provide genuine user authentication or a protected administration system. Browser state is saved using localStorage.

## Run and deploy

Open `index.html` in a current browser. No build step is required.

To publish from your own separate GitHub repository:

1. Create a **new repository** named `RamadanLight-Demo` (do not fork the shared/private academic repository).
2. Upload the three website files `index.html`, `styles.css`, and `app.js` to the root. You may optionally include this README.
3. In Settings → Pages, choose **Deploy from a branch**, `main`, and `/(root)`, then Save.
4. Once deployment succeeds, GitHub's normal project Pages link will typically be `https://<username>.github.io/RamadanLight-Demo/`. Do not advertise it until you have opened and tested the actual deployed URL.

## Original academic project

Ramadan Light was developed collaboratively by a student team. The original project uses PHP, MySQL, HTML, CSS, and JavaScript, including recipe management, favorites, likes, comments, and administrative reporting functions.

The original repository is **private and shared with the team**. This frontend-only demo is intentionally independent; no teammate source files, private database records, or credentials have been republished here. Add verified teammate credits before publicly presenting this demo as your team's work.
