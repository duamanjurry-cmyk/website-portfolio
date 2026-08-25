const DATA_URL="/content/portfolio.json";
let siteData=null,activeCategory="All";
const labels={image:"IMAGE",pdf:"PDF",video:"VIDEO",external:"WEB",file:"FILE"};

async function init(){
  try{
    const res=await fetch(DATA_URL,{cache:"no-store"});
    if(!res.ok) throw new Error("Could not load portfolio data.");
    siteData=await res.json();
    applySiteSettings(); applyHeroImages(); renderFilters(); renderProjects();
  }catch(err){
    const g=document.getElementById("portfolioGrid");
    if(g) g.innerHTML=`<div class="placeholder"><div><strong>Portfolio data could not load.</strong><span>${err.message}</span></div></div>`;
  }
}

function applySiteSettings(){
  document.title=`${siteData.ownerName||"Portfolio"} | Professional Portfolio`;
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val||""};
  set("brandInitials",siteData.initials); set("brandName",siteData.ownerName);
  set("heroEyebrow",siteData.heroEyebrow); set("heroTitle",siteData.heroTitle); set("heroText",siteData.heroText);
  set("aboutTitle",siteData.aboutTitle); set("aboutText",siteData.aboutText);
  set("footerName",`© ${new Date().getFullYear()} ${siteData.ownerName||""}`);
  const a=[];
  if(siteData.email)a.push(`<a class="button" href="mailto:${siteData.email}">Email Me</a>`);
  if(siteData.linkedin)a.push(`<a class="text-link" href="${siteData.linkedin}" target="_blank" rel="noopener">LinkedIn →</a>`);
  if(siteData.resume)a.push(`<a class="text-link" href="${siteData.resume}" target="_blank" rel="noopener">Resume →</a>`);
  const ca=document.getElementById("contactActions"); if(ca) ca.innerHTML=a.join("");
}

function applyOneHero(imgId,phId,value){
  const img=document.getElementById(imgId),ph=document.getElementById(phId);
  if(!img||!ph)return;
  const card=img.closest(".float-one,.float-two");
  if(value&&String(value).trim()){
    img.src=value; img.hidden=false; ph.hidden=true;
    if(card)card.classList.add("hero-has-image");
    img.onerror=()=>{img.hidden=true;ph.hidden=false;if(card)card.classList.remove("hero-has-image")};
  }else{
    img.hidden=true;ph.hidden=false;if(card)card.classList.remove("hero-has-image");
  }
}
function applyHeroImages(){
  applyOneHero("heroMainImage","heroMainPlaceholder",siteData.heroMainImage);
  applyOneHero("heroEmailImage","heroEmailPlaceholder",siteData.heroEmailImage);
  applyOneHero("heroAutomationImage","heroAutomationPlaceholder",siteData.heroAutomationImage);
}

function renderFilters(){
  const p=siteData.projects||[],cats=["All",...new Set(p.map(x=>x.category).filter(Boolean))];
  const f=document.getElementById("filters");
  f.innerHTML=cats.map(c=>`<button class="filter ${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");
  f.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{activeCategory=b.dataset.cat;renderFilters();renderProjects()});
}
function renderProjects(){
  const ps=(siteData.projects||[]).filter(p=>activeCategory==="All"||p.category===activeCategory);
  const g=document.getElementById("portfolioGrid");
  g.innerHTML=ps.map((p,i)=>{
    const t=p.thumbnail?`<img src="${p.thumbnail}" alt="${esc(p.title)} preview">`:`<div class="placeholder"><div><strong>Add ${labels[p.mediaType]||"PROJECT"} Preview</strong><span>${esc(p.title)}</span></div></div>`;
    return `<article class="card" tabindex="0" data-index="${i}"><div class="media">${t}<span class="badge">${labels[p.mediaType]||"PROJECT"}</span></div><div class="card-body"><span class="category">${esc((p.category||"Project").toUpperCase())}</span><h3>${esc(p.title)}</h3><p>${esc(p.description||"")}</p><div class="tools">${esc(p.tools||"")}</div></div></article>`;
  }).join("");
  g.querySelectorAll(".card").forEach(c=>{const open=()=>openProject(ps[Number(c.dataset.index)]);c.onclick=open;c.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}}});
}
function mediaFor(p){
  if(!p.media)return `<div class="filebox"><div><strong>No project file added yet</strong><p>Upload one from the admin dashboard.</p></div></div>`;
  if(p.mediaType==="image")return `<img src="${p.media}" alt="${esc(p.title)}">`;
  if(p.mediaType==="pdf")return `<iframe src="${p.media}" title="${esc(p.title)} PDF"></iframe>`;
  if(p.mediaType==="video")return `<video src="${p.media}" controls playsinline></video>`;
  if(p.mediaType==="external")return `<div class="filebox"><div><strong>Live Project</strong><p>Open the live webpage in a new tab.</p><a class="button" href="${p.media}" target="_blank" rel="noopener">Open Website</a></div></div>`;
  return `<div class="filebox"><div><strong>Project File</strong><p>Open or download the attached file.</p><a class="button" href="${p.media}" target="_blank" rel="noopener">Open File</a></div></div>`;
}
function openProject(p){
  document.getElementById("modalContent").innerHTML=`<article class="modal-project"><span class="category">${esc((p.category||"Project").toUpperCase())}</span><h2>${esc(p.title)}</h2><p class="modal-summary">${esc(p.description||"")}</p><div class="modal-media">${mediaFor(p)}</div><div class="meta"><section><h4>CHALLENGE</h4><p>${esc(p.challenge||"")}</p></section><section><h4>SOLUTION</h4><p>${esc(p.solution||"")}</p></section><section><h4>TOOLS</h4><p>${esc(p.tools||"")}</p></section><section><h4>RESULT</h4><p>${esc(p.result||"")}</p></section></div></article>`;
  document.getElementById("modal").showModal();
}
function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.getElementById("closeModal").onclick=()=>document.getElementById("modal").close();
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")e.target.close()};
init();
