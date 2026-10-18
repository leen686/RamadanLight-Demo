/*
 * Ramadan Light — browser-only demo data layer.
 * Replaces the original PHP/MySQL backend with localStorage so the app can be
 * tried on GitHub Pages. Every visitor gets their own copy of the sample data.
 */
(function () {
  var DB_KEY = 'rl_demo_db_v1';
  var SESSION_KEY = 'rl_demo_session_v1';

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function fresh() {
    var s = clone(window.RL_SEED);
    var db = {
      users: s.users, blockedUsers: s.blockedUsers, categories: s.categories,
      recipes: [], ingredients: [], instructions: [],
      likes: s.likes.map(function (p) { return { userID: p[0], recipeID: p[1] }; }),
      favourites: s.favourites.map(function (p) { return { userID: p[0], recipeID: p[1] }; }),
      comments: s.comments, reports: s.reports, next: {}
    };
    var ing = 1, ins = 1;
    s.recipes.forEach(function (r) {
      db.recipes.push({ id: r.id, userID: r.userID, categoryID: r.categoryID, name: r.name,
        description: r.description, photoFileName: r.photoFileName, videoFilePath: r.videoFilePath });
      r.ingredients.forEach(function (x) {
        db.ingredients.push({ id: ing++, recipeID: r.id, ingredientName: x[0], ingredientQuantity: x[1] });
      });
      r.steps.forEach(function (x, i) {
        db.instructions.push({ id: ins++, recipeID: r.id, step: x, stepOrder: i + 1 });
      });
    });
    return db;
  }

  function safeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); return true; }
    catch (e) { alert('Your browser storage is full or disabled, so this change could not be saved.'); return false; }
  }

  var db;
  try { db = JSON.parse(safeGet(DB_KEY)) || fresh(); } catch (e) { db = fresh(); }

  function save() { return safeSet(DB_KEY, JSON.stringify(db)); }
  function nextId(table) {
    var max = 0;
    db[table].forEach(function (r) { if (r.id > max) max = r.id; });
    return max + 1;
  }

  /* ---------- helpers shared by all pages ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function img(name) {
    if (!name) return 'images/avatar.png';
    if (/^(data:|blob:|https?:)/.test(name)) return name;
    return 'images/' + encodeURI(name);
  }
  function param(name) { return new URLSearchParams(location.search).get(name); }
  function go(url) { location.replace(url); }

  /* ---------- session ---------- */
  function currentUser() {
    var id = parseInt(safeGet(SESSION_KEY), 10);
    if (!id) return null;
    return db.users.filter(function (u) { return u.id === id; })[0] || null;
  }
  function requireUser(type, msg) {
    var u = currentUser();
    if (!u || (type && u.userType !== type)) {
      go('login.html?error=' + encodeURIComponent(msg || 'You must login first'));
      throw new Error('redirect');
    }
    return u;
  }

  /* ---------- queries (mirror the original SQL) ---------- */
  function user(id) { return db.users.filter(function (u) { return u.id === id; })[0]; }
  function category(id) { return db.categories.filter(function (c) { return c.id === id; })[0] || { categoryName: '' }; }
  function recipe(id) { return db.recipes.filter(function (r) { return r.id === id; })[0]; }
  function likesCount(recipeID) { return db.likes.filter(function (l) { return l.recipeID === recipeID; }).length; }
  function has(table, userID, recipeID) {
    return db[table].some(function (x) { return x.userID === userID && x.recipeID === recipeID; });
  }
  function recipeRow(r) {
    var u = user(r.userID) || {};
    return { id: r.id, name: r.name, photoFileName: r.photoFileName, categoryID: r.categoryID,
      categoryName: category(r.categoryID).categoryName, firstName: u.firstName, lastName: u.lastName,
      creatorPhoto: u.photoFileName, likesCount: likesCount(r.id) };
  }
  function recipes(categoryID) {
    return db.recipes
      .filter(function (r) { return !categoryID || categoryID === 'all' || r.categoryID === parseInt(categoryID, 10); })
      .sort(function (a, b) { return b.id - a.id; })
      .map(recipeRow);
  }
  function ingredients(recipeID) { return db.ingredients.filter(function (i) { return i.recipeID === recipeID; }); }
  function instructions(recipeID) {
    return db.instructions.filter(function (i) { return i.recipeID === recipeID; })
      .sort(function (a, b) { return a.stepOrder - b.stepOrder; });
  }

  /* ---------- actions (mirror the original PHP endpoints) ---------- */
  function login(email, password) {
    email = email.trim().toLowerCase();
    if (db.blockedUsers.some(function (b) { return b.emailAddress.toLowerCase() === email; })) {
      return { error: 'This account is blocked.' };
    }
    var u = db.users.filter(function (x) { return x.emailAddress.toLowerCase() === email; })[0];
    if (!u || u.password !== password) return { error: 'Invalid email or password.' };
    safeSet(SESSION_KEY, String(u.id));
    return { user: u };
  }
  function signout() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} }

  function signup(d) {
    if (!d.firstName || !d.lastName || !d.emailAddress || !d.password) return { error: 'Please fill in all required fields.' };
    var email = d.emailAddress.toLowerCase();
    var taken = db.users.concat(db.blockedUsers).some(function (u) { return u.emailAddress.toLowerCase() === email; });
    if (taken) return { error: 'This email is already registered.' };
    var u = { id: nextId('users'), userType: 'user', firstName: d.firstName, lastName: d.lastName,
      emailAddress: d.emailAddress, password: d.password, photoFileName: d.photo || 'avatar.png' };
    db.users.push(u);
    if (!save()) { db.users.pop(); return { error: 'Something went wrong. Please try again.' }; }
    safeSet(SESSION_KEY, String(u.id));
    return { user: u };
  }

  function toggleAdd(table, userID, recipeID) {
    if (!has(table, userID, recipeID)) db[table].push({ userID: userID, recipeID: recipeID });
    return save();
  }
  function addReport(userID, recipeID) {
    if (!has('reports', userID, recipeID)) db.reports.push({ id: nextId('reports'), userID: userID, recipeID: recipeID });
    return save();
  }
  function removeFavourite(userID, recipeID) {
    db.favourites = db.favourites.filter(function (f) { return !(f.userID === userID && f.recipeID === recipeID); });
    return save();
  }
  function addComment(userID, recipeID, text) {
    var d = new Date();
    var date = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    db.comments.push({ id: nextId('comments'), recipeID: recipeID, userID: userID, comment: text, date: date });
    return save();
  }

  function saveRecipe(userID, data, existingID) {
    var id = existingID || nextId('recipes');
    var r = existingID ? recipe(existingID) : { id: id, userID: userID };
    r.name = data.name; r.categoryID = data.categoryID; r.description = data.description;
    if (data.photo) r.photoFileName = data.photo;
    if (data.video !== undefined) r.videoFilePath = data.video;
    if (!existingID) db.recipes.push(r);
    db.ingredients = db.ingredients.filter(function (i) { return i.recipeID !== id; });
    db.instructions = db.instructions.filter(function (i) { return i.recipeID !== id; });
    var ing = nextId('ingredients'), ins = nextId('instructions');
    data.ingredients.forEach(function (x) {
      db.ingredients.push({ id: ing++, recipeID: id, ingredientName: x[0], ingredientQuantity: x[1] });
    });
    data.steps.forEach(function (s, i) {
      db.instructions.push({ id: ins++, recipeID: id, step: s, stepOrder: i + 1 });
    });
    return save() ? id : 0;
  }

  function deleteRecipeData(recipeID) {
    ['ingredients', 'instructions'].forEach(function (t) {
      db[t] = db[t].filter(function (x) { return x.recipeID !== recipeID; });
    });
    ['comments', 'likes', 'favourites', 'reports'].forEach(function (t) {
      db[t] = db[t].filter(function (x) { return x.recipeID !== recipeID; });
    });
    db.recipes = db.recipes.filter(function (r) { return r.id !== recipeID; });
    RLMedia.remove('video_' + recipeID);
  }
  function deleteRecipe(userID, recipeID) {
    var r = recipe(recipeID);
    if (!r || r.userID !== userID) return false;
    deleteRecipeData(recipeID);
    return save();
  }

  function handleReport(reportID, recipeID, action) {
    if (action === 'dismiss') {
      db.reports = db.reports.filter(function (x) { return x.id !== reportID; });
      return save();
    }
    if (action === 'block') {
      var r = recipe(recipeID); if (!r) return false;
      var u = user(r.userID); if (!u || u.userType === 'admin') return false;
      db.blockedUsers.push({ id: nextId('blockedUsers'), firstName: u.firstName, lastName: u.lastName, emailAddress: u.emailAddress });
      db.recipes.filter(function (x) { return x.userID === u.id; }).forEach(function (x) { deleteRecipeData(x.id); });
      db.reports = db.reports.filter(function (x) { return x.id !== reportID; });
      ['comments', 'likes', 'favourites', 'reports'].forEach(function (t) {
        db[t] = db[t].filter(function (x) { return x.userID !== u.id; });
      });
      db.users = db.users.filter(function (x) { return x.id !== u.id; });
      return save();
    }
    return false;
  }

  function reset() {
    db = fresh(); save(); signout(); RLMedia.clear();
  }

  /* ---------- uploaded media ---------- */
  // Photos are shrunk and stored inline; videos are kept in IndexedDB.
  function readPhoto(file, maxSize) {
    return new Promise(function (resolve) {
      if (!file) return resolve('');
      var url = URL.createObjectURL(file);
      var im = new Image();
      im.onload = function () {
        var scale = Math.min(1, (maxSize || 800) / Math.max(im.width, im.height));
        var c = document.createElement('canvas');
        c.width = Math.round(im.width * scale); c.height = Math.round(im.height * scale);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      im.onerror = function () { URL.revokeObjectURL(url); resolve(''); };
      im.src = url;
    });
  }

  var RLMedia = (function () {
    function open() {
      return new Promise(function (resolve, reject) {
        if (!window.indexedDB) return reject();
        var req = indexedDB.open('rl_demo_media', 1);
        req.onupgradeneeded = function () { req.result.createObjectStore('files'); };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(); };
      });
    }
    function run(mode, fn) {
      return open().then(function (d) {
        return new Promise(function (resolve, reject) {
          var tx = d.transaction('files', mode), req = fn(tx.objectStore('files'));
          tx.oncomplete = function () { resolve(req && req.result); };
          tx.onerror = function () { reject(); };
        });
      });
    }
    return {
      put: function (key, blob) { return run('readwrite', function (s) { return s.put(blob, key); }); },
      get: function (key) { return run('readonly', function (s) { return s.get(key); }).catch(function () { return null; }); },
      remove: function (key) { run('readwrite', function (s) { return s.delete(key); }).catch(function () {}); },
      clear: function () { run('readwrite', function (s) { return s.clear(); }).catch(function () {}); }
    };
  })();

  // Link a recipe's video: shipped files, saved uploads, or an external URL.
  function videoHref(r) {
    var p = r.videoFilePath || '';
    if (/^https?:/i.test(p)) return Promise.resolve(p);
    if (p.indexOf('upload:') === 0) {
      return RLMedia.get('video_' + r.id).then(function (b) { return b ? URL.createObjectURL(b) : '#'; });
    }
    return Promise.resolve('videos/' + encodeURI(p));
  }
  function videoName(r) {
    var p = r.videoFilePath || '';
    return p.indexOf('upload:') === 0 ? p.slice(7) : p;
  }

  window.RL = {
    db: function () { return db; }, save: save, esc: esc, img: img, param: param, go: go,
    currentUser: currentUser, requireUser: requireUser, user: user, category: category, recipe: recipe,
    recipes: recipes, ingredients: ingredients, instructions: instructions, likesCount: likesCount, has: has,
    login: login, signout: signout, signup: signup, toggleAdd: toggleAdd, addReport: addReport,
    removeFavourite: removeFavourite, addComment: addComment, saveRecipe: saveRecipe,
    deleteRecipe: deleteRecipe, handleReport: handleReport, reset: reset, readPhoto: readPhoto,
    media: RLMedia, videoHref: videoHref, videoName: videoName
  };

  // requireUser() stops the page script after redirecting; keep that quiet in the console.
  window.addEventListener('error', function (e) {
    if (e.error && e.error.message === 'redirect') e.preventDefault();
  });

  // Every "Sign out" / "Log out" button ends the demo session.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-signout]');
    if (a) { e.preventDefault(); signout(); location.href = 'index.html'; }
  });
})();
