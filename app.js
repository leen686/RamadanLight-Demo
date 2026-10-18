"use strict";
// Interactive client-side portfolio demonstration. No authentication, PHP or MySQL.
// The recipes and recipe details below are illustrative sample data.
const KEY = "ramadan_light_portfolio_demo_v1";
const SAMPLES = [
  { id:"sample-pasta", name:"Creamy Lemon Shrimp Pasta", category:"Iftar", minutes:35, symbol:"🍝", likes:32, timestamp:5, description:"Comforting pasta with a bright lemon finish and tender shrimp.", ingredients:["200 g pasta", "150 g shrimp", "1 lemon", "2 tbsp yogurt or cream", "Garlic, black pepper, and parsley"], steps:["Cook the pasta until tender and reserve a little cooking water.", "Sauté garlic and shrimp until cooked through.", "Toss with lemon juice and cream; thin with pasta water as needed.", "Combine with the pasta, garnish, and serve."], owned:false },
  { id:"sample-salad", name:"Creamy Chicken Salad", category:"Suhoor", minutes:20, symbol:"🥗", likes:27, timestamp:4, description:"A fresh chicken salad with a creamy, tangy dressing.", ingredients:["1 cup cooked chicken", "Lettuce and cucumber", "2 tbsp plain yogurt", "1 tsp lemon juice", "Pinch of salt and pepper"], steps:["Chop the chicken and vegetables into bite-sized pieces.", "Mix yogurt, lemon, and seasonings for the dressing.", "Combine, chill briefly, and serve."], owned:false },
  { id:"sample-balls", name:"No-Bake Energy Balls", category:"Snacks", minutes:15, symbol:"🍫", likes:45, timestamp:3, description:"Small date-and-oat bites for an easy treat.", ingredients:["1 cup rolled oats", "6 soft dates", "2 tbsp peanut butter", "1 tbsp cocoa powder", "A little water, if needed"], steps:["Blend the dates into a sticky paste.", "Stir in the oats, peanut butter, and cocoa.", "Roll into small balls and chill before serving."], owned:false },
  { id:"sample-sandwich", name:"Veggie & Hummus Sandwich", category:"Suhoor", minutes:10, symbol:"🥙", likes:21, timestamp:2, description:"A colorful, quick sandwich with crunchy vegetables and hummus.", ingredients:["2 slices whole-grain bread", "3 tbsp hummus", "Cucumber and tomato", "Lettuce", "A squeeze of lemon"], steps:["Spread hummus over the bread.", "Layer on the fresh vegetables.", "Add lemon, close the sandwich, and enjoy."], owned:false },
  { id:"sample-soup", name:"Wild Rice & Mushroom Soup", category:"Iftar", minutes:45, symbol:"🍲", likes:39, timestamp:1, description:"An earthy, gently spiced soup for a cozy Iftar table.", ingredients:["½ cup wild rice", "1 cup sliced mushrooms", "1 small onion", "3 cups vegetable stock", "Black pepper and thyme"], steps:["Soften the onion and mushrooms in a pot.", "Add rice, stock, and seasonings.", "Simmer until the rice is fully cooked and serve warm."], owned:false }
];
const $ = id => document.getElementById(id);
const encode = val => String(val ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const blank = () => ({custom:[], favorites:[], likes:[], comments:{}, reports:[]});
function load(){
  try{
    const v=JSON.parse(localStorage.getItem(KEY));
    if(v && Array.isArray(v.custom) && Array.isArray(v.favorites) && Array.isArray(v.likes) && v.comments && typeof v.comments==="object" && Array.isArray(v.reports)){
      return {custom:v.custom.filter(r=>r && r.owned===true && typeof r.id==="string").slice(0,80),favorites:v.favorites.filter(x=>typeof x==="string").slice(0,150),likes:v.likes.filter(x=>typeof x==="string").slice(0,150),comments:v.comments,reports:v.reports.filter(x=>typeof x==="string").slice(0,100)};
    }
  }catch(_){}
  return blank();
}
let state=load();
let editId=null;
let detailId=null;
let categoryPreset="all";
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){toast("Browser storage is not available; changes may not persist.");}}
function recipes(){return [...SAMPLES,...state.custom];}
function byId(id){return recipes().find(r=>r.id===id);}
function likesFor(r){return Number(r.likes||0)+(state.likes.includes(r.id)?1:0);}
function toast(message){const el=$("toast");el.textContent=message;clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>el.textContent="",2900);}
function empty(message,link=false){return '<div class="empty"><h3>Nothing here just yet.</h3><p>'+encode(message)+'</p>'+(link?'<a href="#create">Try adding a recipe →</a>':'')+'</div>';}
function card(r){
  const fav=state.favorites.includes(r.id),liked=state.likes.includes(r.id);
  const type=r.category==="Iftar"?"iftar":r.category==="Suhoor"?"suhoor":"snacks";
  return '<article class="recipe-card"><div class="dish-art '+type+'"><span class="art-label">'+encode(r.category)+'</span><span role="img" aria-label="Illustration of '+encode(r.name)+'">'+encode(r.symbol||"🥣")+'</span></div>'+
    '<div class="recipe-card-body"><div class="recipe-card-top"><span>RAMADAN LIGHT</span><span>◷ '+encode(r.minutes)+' MIN</span></div><h3>'+encode(r.name)+'</h3><p>'+encode(r.description)+'</p>'+
    '<div class="recipe-stats"><span>♡ '+likesFor(r)+' likes</span><span>'+encode(r.ingredients?.length || 0)+' ingredients</span></div>'+
    '<div class="recipe-actions"><button class="btn btn-forest" data-action="view" data-id="'+encode(r.id)+'">View recipe</button><button class="btn btn-outline" data-action="favorite" data-id="'+encode(r.id)+'">'+(fav?'♥ Saved':'♡ Save')+'</button>'+
    (r.owned?'<button class="btn btn-outline" data-action="edit" data-id="'+encode(r.id)+'">Edit</button><button class="btn btn-outline danger" data-action="delete" data-id="'+encode(r.id)+'">Delete</button>':'')+'</div></div></article>';
}
function renderRecipes(){
  const query=$("search").value.trim().toLowerCase(),cat=$("category").value,order=$("sort").value;
  let rows=recipes().filter(r=>(cat==="all"||r.category===cat)&&[r.name,r.description,r.category,...(r.ingredients||[])].some(v=>String(v).toLowerCase().includes(query)));
  rows.sort((a,b)=>order==="az"?a.name.localeCompare(b.name):order==="new"?Number(b.timestamp||0)-Number(a.timestamp||0):likesFor(b)-likesFor(a));
  $("recipe-results").innerHTML=rows.length?rows.map(card).join(""):empty("Try another search or category.");
  $("results-count").textContent=rows.length+" "+(rows.length===1?"recipe":"recipes")+" found";
}
function renderFavorites(){
  const rows=recipes().filter(r=>state.favorites.includes(r.id));
  $("favorites-results").innerHTML=rows.length?rows.map(card).join(""):empty("Explore recipes and save some favorites.");
  $("fav-counter").textContent=String(rows.length);
}
function renderMine(){ $("my-results").innerHTML=state.custom.length?state.custom.slice().reverse().map(card).join(""):empty("Share a sample recipe to see it here.",true); }
function renderReports(){
  const rows=state.reports.map(byId).filter(Boolean);
  $("moderation-results").innerHTML=rows.length?rows.map(r=>'<article class="moderation-row"><div><h3>'+encode(r.name)+'</h3><p>Flagged recipe · '+encode(r.category)+'</p></div><button class="btn btn-outline" data-action="resolve" data-id="'+encode(r.id)+'">Resolve report</button></article>').join(""):empty("No pending demo reports. Open a recipe and select Report recipe to test this screen.");
}
function refresh(){renderRecipes();renderFavorites();renderMine();renderReports();}
function route(){
  const p=decodeURIComponent(location.hash.slice(1)||"home");const page=["home","recipes","favorites","mine","create","moderation"].includes(p)?p:"home";
  for(const el of document.querySelectorAll("section.screen"))el.hidden=(el.id!==page);
  for(const a of document.querySelectorAll("[data-nav]")){a.classList.toggle("active",a.dataset.nav===page);if(a.dataset.nav===page)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");}
  if(page==="recipes" && categoryPreset!=="all"){$("category").value=categoryPreset;categoryPreset="all";}
  refresh();window.scrollTo(0,0);
}
function closeDialog(){const dlg=$("recipe-dialog");if(dlg.open)dlg.close();detailId=null;}
function openDialog(r){
  detailId=r.id;
  const liked=state.likes.includes(r.id),fav=state.favorites.includes(r.id),flagged=state.reports.includes(r.id);
  const comments=Array.isArray(state.comments[r.id])?state.comments[r.id].slice(0,35):[];
  $("dialog-content").innerHTML='<div class="dialog-head"><div class="dialog-art" aria-hidden="true">'+encode(r.symbol||"🥣")+'</div><span class="eyebrow">'+encode(r.category)+' · '+encode(r.minutes)+' MINUTES</span><h2>'+encode(r.name)+'</h2><p>'+encode(r.description)+'</p></div>'+
    '<div class="dialog-content"><div class="detail-columns"><section><h3>Ingredients</h3><ul>'+r.ingredients.map(x=>'<li>'+encode(x)+'</li>').join("")+'</ul></section><section><h3>Method</h3><ol>'+r.steps.map(x=>'<li>'+encode(x)+'</li>').join("")+'</ol></section></div>'+
    '<div class="dialog-controls"><button class="btn btn-forest" data-action="like" data-id="'+encode(r.id)+'">'+(liked?'♥ Liked':'♡ Like')+' · '+likesFor(r)+'</button><button class="btn btn-outline" data-action="favorite" data-id="'+encode(r.id)+'">'+(fav?'♥ Saved':'♡ Save recipe')+'</button><button class="btn btn-outline" data-action="report" data-id="'+encode(r.id)+'">'+(flagged?'⚑ Report sent':'⚑ Report recipe')+'</button></div>'+
    '<div class="dialog-comments"><h3>Conversation <small style="font:12px DM Sans;color:#888">('+comments.length+')</small></h3><div>'+ (comments.length?comments.map(c=>'<div class="comment"><b>Demo visitor</b><br>'+encode(String(c).slice(0,250))+'</div>').join(""):'<p class="muted">Be the first to leave a sample comment.</p>')+'</div><form class="comment-form" id="comment-form"><input name="comment" required maxlength="250" aria-label="Add comment" placeholder="Leave a friendly comment..."><button type="submit" class="btn btn-forest">Post</button></form></div></div>';
  $("recipe-dialog").showModal();
}
function handleAction(action,recipeId){
  const r=byId(recipeId);if(!r)return;
  if(action==="view"){openDialog(r);return;}
  if(action==="favorite"){state.favorites=state.favorites.includes(recipeId)?state.favorites.filter(x=>x!==recipeId):[...state.favorites,recipeId];save();refresh();if(detailId===recipeId)openDialogRefresh(r);toast(state.favorites.includes(recipeId)?"Recipe saved to favorites":"Recipe removed from favorites");return;}
  if(action==="like"){state.likes=state.likes.includes(recipeId)?state.likes.filter(x=>x!==recipeId):[...state.likes,recipeId];save();refresh();if(detailId===recipeId)openDialogRefresh(r);toast(state.likes.includes(recipeId)?"You liked this recipe":"Like removed");return;}
  if(action==="report"){if(!state.reports.includes(recipeId)){state.reports.push(recipeId);save();refresh();toast("Sample report sent to admin preview");}else toast("Recipe is already reported");if(detailId===recipeId)openDialogRefresh(r);return;}
  if(action==="resolve"){state.reports=state.reports.filter(x=>x!==recipeId);save();refresh();toast("Report resolved (demo only)");return;}
  if(action==="edit" && r.owned){closeDialog();editId=recipeId;const form=$("recipe-form");for(const key of ["name","category","minutes","symbol","description"])form.elements.namedItem(key).value=r[key];form.elements.namedItem("ingredients").value=r.ingredients.join("\n");form.elements.namedItem("steps").value=r.steps.join("\n");$("create-heading").textContent="Edit your recipe.";$("submit-recipe").textContent="Save changes";location.hash="#create";return;}
  if(action==="delete" && r.owned && confirm("Delete this sample recipe from your browser?")){state.custom=state.custom.filter(x=>x.id!==recipeId);state.favorites=state.favorites.filter(x=>x!==recipeId);state.likes=state.likes.filter(x=>x!==recipeId);state.reports=state.reports.filter(x=>x!==recipeId);delete state.comments[recipeId];save();closeDialog();refresh();toast("Recipe deleted");}
}
function openDialogRefresh(r){
  // Closing before reopening is unnecessary; replace the dialog content while it remains open.
  const dlg=$("recipe-dialog");if(dlg.open)dlg.close();openDialog(r);
}
function clearForm(){editId=null;$("recipe-form").reset();$("create-heading").textContent="Add a recipe.";$("submit-recipe").textContent="Publish sample recipe";}
document.addEventListener("click",e=>{
  const btn=e.target.closest("button[data-action]");if(btn){handleAction(btn.dataset.action,btn.dataset.id);return;}
  const catLink=e.target.closest("[data-category-link]");if(catLink){categoryPreset=catLink.dataset.categoryLink;$("search").value="";$("category").value=categoryPreset;}
});
$("recipe-form").addEventListener("submit",e=>{
  e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
  const values=Object.fromEntries(new FormData(form).entries());
  const ingredients=String(values.ingredients||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,35);
  const steps=String(values.steps||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,30);
  const name=String(values.name||"").trim(),description=String(values.description||"").trim();
  const minutes=Number(values.minutes);
  if(!name||!description||!ingredients.length||!steps.length||minutes<1||minutes>360||!["Iftar","Suhoor","Snacks"].includes(values.category)){toast("Please complete all required fields.");return;}
  const data={name,description,minutes,category:values.category,symbol:values.symbol,ingredients,steps,owned:true};
  if(editId){const index=state.custom.findIndex(r=>r.id===editId);if(index>=0){state.custom[index]={...state.custom[index],...data};toast("Recipe updated");}}
  else{state.custom.push({id:"custom-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7),timestamp:Date.now(),likes:0,...data});toast("Recipe added to your demo collection");}
  save();clearForm();refresh();location.hash="#mine";
});
$("dialog-content").addEventListener("submit",e=>{
  if(e.target.id!=="comment-form")return;e.preventDefault();if(!detailId)return;const comment=e.target.elements.namedItem("comment").value.trim();if(!comment)return;
  if(!Array.isArray(state.comments[detailId]))state.comments[detailId]=[];
  state.comments[detailId].unshift(comment.slice(0,250));state.comments[detailId]=state.comments[detailId].slice(0,35);
  save();const r=byId(detailId);if(r)openDialogRefresh(r);toast("Comment added to demo");
});
$("dialog-close").addEventListener("click",closeDialog);
$("recipe-dialog").addEventListener("click",e=>{if(e.target===$("recipe-dialog"))closeDialog();});
for(const elId of ["search","category","sort"])$(elId).addEventListener(elId==="search"?"input":"change",renderRecipes);
$("filter-form").addEventListener("submit",e=>e.preventDefault());
$("cancel-edit").addEventListener("click",clearForm);
$("reset-demo").addEventListener("click",()=>{if(confirm("Clear demo favorites, recipes, likes, and comments on this device?")){state=blank();save();clearForm();closeDialog();$("search").value="";$("category").value="all";refresh();location.hash="#home";toast("Demo reset");}});
window.addEventListener("hashchange",()=>{if(location.hash!=="#create"&&editId!==null)clearForm();route();});
route();
