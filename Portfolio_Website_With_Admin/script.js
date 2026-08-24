const DATA_URL = "/content/portfolio.json";
let siteData = null;
let activeCategory = "All";

const labels = {image:"IMAGE",pdf:"PDF",video:"VIDEO",external:"WEB",file:"FILE"};

async function init() {
  try {
    const res = await fetch(DATA_URL, {cache:"no-store"});
    if (!res.ok) throw new Error("Could not load portfolio data.");
    siteData = await res.json();
    applySiteSettings();
    renderFilters();
    renderProjects();
  } catch (err) {
    document.getElementById("portfolioGrid").innerHTML =
      `<div class="placeholder"><div><strong>Portfolio data could not load.</strong><span>${err.message}</span></div></div>`;
  }
}

function applySiteSettings(){
  document.title = `${siteData.ownerName || "Portfolio"} | Professional Portfolio`;
  const set = (id,val) => { const el=document.getElementById(id); if(el) el.textContent=val || ""; };
  set("brandInitials",siteData.initials);
  set("brandName",siteData.ownerName);
  set("heroEyebrow",siteData.heroEyebrow);
  set("heroTitle",siteData.heroTitle);
  set("heroText",siteData.heroText);
  set("aboutTitle",siteData.aboutTitle);
  set("aboutText",siteData.aboutText);
  set("footerName",`© ${new Date().getFullYear()} ${siteData.ownerName || ""}`);

  const actions=[];
  if(siteData.email) actions.push(`<a class="button" href="mailto:${siteData.email}">Email Me</a>`);
  if(siteData.linkedin) actions.push(`<a class="text-link" href="${siteData.linkedin}" target="_blank" rel="noopener">LinkedIn →</a>`);
  if(siteData.resume) actions.push(`<a class="text-link" href="${siteData.resume}" target="_blank" rel="noopener">Resume →</a>`);
  document.getElementById("contactActions").innerHTML=actions.join("");
}

function renderFilters(){
  const projects = siteData.projects || [];
  const cats = ["All", ...new Set(projects.map(p=>p.category).filter(Boolean))];
  document.getElementById("filters").innerHTML = cats.map(c =>
    `<button class="filter ${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`
  ).join("");
  document.querySelectorAll(".filter").forEach(btn => btn.onclick=()=>{
    activeCategory=btn.dataset.cat; renderFilters(); renderProjects();
  });
}

function renderProjects(){
  const projects = (siteData.projects || []).filter(p => activeCategory==="All" || p.category===activeCategory);
  const grid=document.getElementById("portfolioGrid");
  grid.innerHTML=projects.map((p,i)=>{
    const thumb=p.thumbnail
      ? `<img src="${p.thumbnail}" alt="${escapeHtml(p.title)} preview">`
      : `<div class="placeholder"><div><strong>Add ${labels[p.mediaType]||"PROJECT"} Preview</strong><span>${escapeHtml(p.title)}</span></div></div>`;
    return `<article class="card" tabindex="0" data-index="${i}">
      <div class="media">${thumb}<span class="badge">${labels[p.mediaType]||"PROJECT"}</span></div>
      <div class="card-body">
        <span class="category">${escapeHtml((p.category||"Project").toUpperCase())}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description||"")}</p>
        <div class="tools">${escapeHtml(p.tools||"")}</div>
      </div>
    </article>`;
  }).join("");

  document.querySelectorAll(".card").forEach(card=>{
    const open=()=>openProject(projects[Number(card.dataset.index)]);
    card.onclick=open;
    card.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}};
  });
}

function mediaFor(p){
  if(!p.media) return `<div class="filebox"><div><strong>No project file added yet</strong><p>Upload one from the admin dashboard.</p></div></div>`;
  if(p.mediaType==="image") return `<img src="${p.media}" alt="${escapeHtml(p.title)}">`;
  if(p.mediaType==="pdf") return `<iframe src="${p.media}" title="${escapeHtml(p.title)} PDF"></iframe>`;
  if(p.mediaType==="video") return `<video src="${p.media}" controls playsinline></video>`;
  if(p.mediaType==="external") return `<div class="filebox"><div><strong>Live Project</strong><p>Open the live webpage in a new tab.</p><a class="button" href="${p.media}" target="_blank" rel="noopener">Open Website</a></div></div>`;
  return `<div class="filebox"><div><strong>Project File</strong><p>Open or download the attached file.</p><a class="button" href="${p.media}" target="_blank" rel="noopener">Open File</a></div></div>`;
}

function openProject(p){
  document.getElementById("modalContent").innerHTML =
   `<article class="modal-project">
      <span class="category">${escapeHtml((p.category||"Project").toUpperCase())}</span>
      <h2>${escapeHtml(p.title)}</h2>
      <p class="modal-summary">${escapeHtml(p.description||"")}</p>
      <div class="modal-media">${mediaFor(p)}</div>
      <div class="meta">
        <section><h4>CHALLENGE</h4><p>${escapeHtml(p.challenge||"")}</p></section>
        <section><h4>SOLUTION</h4><p>${escapeHtml(p.solution||"")}</p></section>
        <section><h4>TOOLS</h4><p>${escapeHtml(p.tools||"")}</p></section>
        <section><h4>RESULT</h4><p>${escapeHtml(p.result||"")}</p></section>
      </div>
    </article>`;
  document.getElementById("modal").showModal();
}

function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

document.getElementById("closeModal").onclick=()=>document.getElementById("modal").close();
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal") e.target.close();};

init();
