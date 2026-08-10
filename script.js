const state = {
  reports: 0,
  incidents: [],
  resources: [],
  hospitals: [],
  shelters: [],
  roads: [],
  feed: [],
  assignments: [],
  simulationRunning: false,
  reportTimer: null,
  scenario: "resource",
  markers: [],
  map: null,
  planVersion: 1
};

const demoIncidents = [
  {id:1042, title:"People trapped — Ward 7", type:"Flood / Rescue", lat:18.5188,lng:73.8527,severity:"critical",people:20,priority:96,required:"Rescue Team",reports:5,status:"Awaiting Approval"},
  {id:1045, title:"Hospital B power failure", type:"Infrastructure", lat:18.5232,lng:73.8594,severity:"critical",people:45,priority:94,required:"Generator",reports:4,status:"Awaiting Approval"},
  {id:1038, title:"Rapid water level rise", type:"Flood", lat:18.5132,lng:73.8462,severity:"critical",people:32,priority:92,required:"Rescue Team",reports:7,status:"Awaiting Approval"},
  {id:1051, title:"School evacuation required", type:"Flood / Evacuation", lat:18.5267,lng:73.8482,severity:"critical",people:80,priority:91,required:"Ambulance",reports:9,status:"Awaiting Approval"},
  {id:1060, title:"Blocked underpass", type:"Road / Flood", lat:18.516,lng:73.866,severity:"critical",people:12,priority:88,required:"Field Team",reports:3,status:"Awaiting Approval"},
  {id:1072, title:"Elderly residents isolated", type:"Rescue", lat:18.5302,lng:73.854,severity:"critical",people:14,priority:87,required:"Rescue Team",reports:3,status:"Awaiting Approval"},
  {id:1048, title:"Riverside homes flooded", type:"Flood", lat:18.509,lng:73.856,severity:"high",people:30,priority:83,required:"Rescue Team",reports:6,status:"Pending"},
  {id:1055, title:"Traffic disruption", type:"Road", lat:18.521,lng:73.842,severity:"high",people:10,priority:79,required:"Field Team",reports:4,status:"Pending"},
  {id:1064, title:"Shelter capacity warning", type:"Shelter", lat:18.532,lng:73.862,severity:"high",people:120,priority:77,required:"Shelter",reports:5,status:"Pending"},
  {id:1081, title:"Water entering market", type:"Flood", lat:18.514,lng:73.874,severity:"medium",people:9,priority:61,required:"Field Team",reports:3,status:"Monitoring"},
  {id:1085, title:"Drain overflow", type:"Flood", lat:18.535,lng:73.847,severity:"medium",people:7,priority:54,required:"Field Team",reports:2,status:"Monitoring"}
];

const initialResources = [
  {id:"RT-01",type:"Rescue Team",icon:"🚒",lat:18.525,lng:73.849,cap:30,available:true,status:"Available"},
  {id:"RT-02",type:"Rescue Team",icon:"🚒",lat:18.516,lng:73.860,cap:25,available:true,status:"Available"},
  {id:"RT-03",type:"Rescue Team",icon:"🚒",lat:18.528,lng:73.868,cap:35,available:true,status:"Available"},
  {id:"RT-04",type:"Rescue Team",icon:"🚒",lat:18.507,lng:73.850,cap:20,available:true,status:"Available"},
  {id:"RT-05",type:"Rescue Team",icon:"🚒",lat:18.536,lng:73.856,cap:30,available:true,status:"Busy"},
  {id:"AMB-01",type:"Ambulance",icon:"🚑",lat:18.522,lng:73.854,cap:4,available:true,status:"Available"},
  {id:"AMB-02",type:"Ambulance",icon:"🚑",lat:18.511,lng:73.864,cap:4,available:true,status:"Available"},
  {id:"AMB-03",type:"Ambulance",icon:"🚑",lat:18.529,lng:73.845,cap:4,available:true,status:"Available"},
  {id:"AMB-04",type:"Ambulance",icon:"🚑",lat:18.518,lng:73.877,cap:4,available:true,status:"Busy"},
  {id:"GEN-01",type:"Generator Unit",icon:"⚡",lat:18.524,lng:73.858,cap:1,available:true,status:"Available"},
  {id:"GEN-02",type:"Generator Unit",icon:"⚡",lat:18.533,lng:73.850,cap:1,available:true,status:"Available"},
  {id:"FT-01",type:"Field Team",icon:"🦺",lat:18.519,lng:73.840,cap:15,available:true,status:"Available"},
  {id:"FT-02",type:"Field Team",icon:"🦺",lat:18.527,lng:73.876,cap:15,available:true,status:"Available"}
];

const hospitals = [
  {name:"Hospital A",location:"Central Zone",capacity:120,occupied:78,status:"Operational",lat:18.522,lng:73.854},
  {name:"Hospital B",location:"Ward 7",capacity:80,occupied:73,status:"Power Failure",lat:18.523,lng:73.859},
  {name:"Government Hospital",location:"Ravet Zone",capacity:180,occupied:91,status:"Operational",lat:18.531,lng:73.851},
  {name:"Hospital C",location:"East Zone",capacity:100,occupied:58,status:"Operational",lat:18.515,lng:73.872}
];

const shelters = [
  {name:"Shelter 1",location:"Community Hall",capacity:250,occupied:150,status:"Open"},
  {name:"Shelter 2",location:"School Ground",capacity:180,occupied:96,status:"Open"},
  {name:"Shelter 3",location:"Sports Complex",capacity:300,occupied:280,status:"Near Capacity"},
  {name:"Shelter 4",location:"College Campus",capacity:220,occupied:84,status:"Open"}
];

const roads = [
  {name:"Ward 7 Main Road",status:"Flooded",risk:"High",updated:"2 min ago"},
  {name:"School Road",status:"Blocked",risk:"Critical",updated:"1 min ago"},
  {name:"Ravet Main Road",status:"Open",risk:"Low",updated:"3 min ago"},
  {name:"Riverside Road",status:"Flooded",risk:"High",updated:"1 min ago"},
  {name:"Market Underpass",status:"Blocked",risk:"Critical",updated:"4 min ago"},
  {name:"East Connector",status:"Open",risk:"Low",updated:"2 min ago"}
];

const incomingTexts = [
  "Water entered several houses near Ward 7. Around 20 people may be trapped.",
  "School road completely flooded. Families asking for evacuation.",
  "Water level rising rapidly near Riverside Road.",
  "Hospital B reports power failure during heavy rainfall.",
  "Road near market underpass is blocked by flood water.",
  "Several elderly residents are isolated near the river.",
  "Water covering school entrance and nearby street.",
  "Ambulance access becoming difficult near Ward 7."
];

function cloneData(){
  state.incidents = demoIncidents.map(x=>({...x}));
  state.resources = initialResources.map(x=>({...x}));
  state.hospitals = hospitals.map(x=>({...x}));
  state.shelters = shelters.map(x=>({...x}));
  state.roads = roads.map(x=>({...x}));
  state.reports = 127;
  state.feed = [];
  state.assignments = [
    {incident:1042, resource:"RT-03", distance:"0.8 km", reason:"Closest suitable team + sufficient capacity"},
    {incident:1045, resource:"GEN-01", distance:"0.5 km", reason:"Generator capable of supporting hospital load"},
    {incident:1051, resource:"AMB-01", distance:"0.7 km", reason:"Available ambulance near evacuation zone"},
    {incident:1038, resource:"RT-02", distance:"1.1 km", reason:"Suitable rescue capability"},
    {incident:1060, resource:"FT-01", distance:"0.9 km", reason:"Road assessment capability"}
  ];
  state.resources.forEach(r=>{
    if(state.assignments.some(a=>a.resource===r.id)) r.status="Assigned";
  });
}

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function toast(message,type=""){
  const box=document.createElement("div"); box.className=`toast ${type}`; box.textContent=message;
  document.getElementById("toastContainer").appendChild(box);
  setTimeout(()=>box.remove(),3200);
}

function addFeed(message){
  const time=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  state.feed.unshift({time,message});
  state.feed=state.feed.slice(0,12);
  renderFeed();
}

function severityClass(s){return s.toLowerCase()}
function incidentIcon(type){
  const colors={critical:"#ff5367",high:"#ff9b43",medium:"#e8c95b",low:"#45d49a"};
  return L.divIcon({className:"",html:`<div class="map-pin pin-${type}" style="background:${colors[type]}"></div>`,iconSize:[18,18],iconAnchor:[9,9]});
}
function resourceIcon(){return L.divIcon({className:"",html:`<div class="map-pin pin-resource"></div>`,iconSize:[18,18],iconAnchor:[9,9]})}
function hospitalIcon(){return L.divIcon({className:"",html:`<div class="map-pin pin-hospital"></div>`,iconSize:[18,18],iconAnchor:[9,9]})}

function initMap(){
  state.map=L.map("map",{zoomControl:true}).setView([18.522,73.857],13);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:19,attribution:"© OpenStreetMap © CARTO"}).addTo(state.map);
  renderMap();
}

function renderMap(){
  if(!state.map)return;
  state.markers.forEach(m=>state.map.removeLayer(m));
  state.markers=[];
  state.incidents.forEach(i=>{
    const m=L.marker([i.lat,i.lng],{icon:incidentIcon(i.severity)}).addTo(state.map);
    m.bindPopup(`<b>Incident #${i.id}</b><br>${esc(i.title)}<br><b>Priority:</b> ${i.priority}/100<br><b>People at risk:</b> ${i.people}<br><b>Reports:</b> ${i.reports}<br><b>Status:</b> ${i.status}`);
    state.markers.push(m);
  });
  state.resources.forEach(r=>{
    const m=L.marker([r.lat,r.lng],{icon:resourceIcon()}).addTo(state.map);
    m.bindPopup(`<b>${r.icon} ${r.id}</b><br>${r.type}<br>Status: ${r.status}<br>Capacity: ${r.cap}`);
    state.markers.push(m);
  });
  state.hospitals.forEach(h=>{
    const m=L.marker([h.lat,h.lng],{icon:hospitalIcon()}).addTo(state.map);
    m.bindPopup(`<b>🏥 ${h.name}</b><br>${h.location}<br>Capacity: ${h.occupied}/${h.capacity}<br>Status: ${h.status}`);
    state.markers.push(m);
  });
}

function renderKPIs(){
  const totalResources=state.resources.length;
  const available=state.resources.filter(r=>r.available && r.status!=="Assigned").length;
  document.getElementById("kpiReports").textContent=state.reports;
  const demoComplete=state.reports>=127;
  document.getElementById("kpiIncidents").textContent=demoComplete?31:state.incidents.length;
  document.getElementById("kpiCritical").textContent=demoComplete?6:state.incidents.filter(i=>i.severity==="critical").length;
  document.getElementById("kpiHigh").textContent=demoComplete?9:state.incidents.filter(i=>i.severity==="high").length;
  const mediumEl=document.getElementById("kpiMedium"); if(mediumEl) mediumEl.textContent=demoComplete?16:state.incidents.filter(i=>i.severity==="medium").length;
  document.getElementById("kpiResources").textContent=demoComplete?24:available;
  renderResourceStatus();
}


function renderResourceStatus(){
  const target=document.getElementById("resourceStatus");
  if(!target)return;
  const groups=[
    {name:"Rescue Teams",icon:"🚒",type:"Rescue Team",total:8},
    {name:"Ambulances",icon:"🚑",type:"Ambulance",total:12},
    {name:"Shelters",icon:"🏠",type:"Shelter",total:8},
    {name:"Hospitals",icon:"🏥",type:"Hospital",total:6},
    {name:"Boats",icon:"🛶",type:"Boat",total:5}
  ];
  target.innerHTML=groups.map(g=>{
    let available;
    if(g.type==="Shelter") available=state.shelters.filter(x=>x.status!=="Closed").length;
    else if(g.type==="Hospital") available=state.hospitals.filter(x=>x.status!=="Closed").length;
    else if(g.type==="Boat") available=3;
    else available=state.resources.filter(x=>x.type===g.type && x.available && x.status!=="Unavailable").length;
    const shown=Math.min(g.total,Math.max(0,available + (g.type==="Rescue Team"?3:g.type==="Ambulance"?5:0)));
    const pct=Math.round(shown/g.total*100);
    return `<div class="resource-status-row"><span class="resource-status-icon">${g.icon}</span><div><b>${g.name}</b><small>Operational capacity</small></div><div class="resource-bar"><i style="width:${pct}%"></i></div><strong>${shown} / ${g.total}</strong></div>`;
  }).join("");
}

function renderCritical(){
  const list=state.incidents.filter(i=>i.severity==="critical").sort((a,b)=>b.priority-a.priority).slice(0,6);
  document.getElementById("criticalList").innerHTML=list.map(i=>`
    <div class="incident-item">
      <div class="incident-top">
        <div><div class="incident-name">#${i.id} · ${esc(i.title)}</div><div class="incident-meta">${esc(i.type)} · ${i.people} people at risk<br>${i.reports} correlated reports</div></div>
        <span class="priority ${i.severity}">${i.priority}</span>
      </div>
    </div>`).join("");
}

function renderRecommendations(){
  const recs=state.assignments.slice(0,5).map(a=>{
    const i=state.incidents.find(x=>x.id===a.incident);
    const r=state.resources.find(x=>x.id===a.resource);
    return {a,i,r};
  }).filter(x=>x.i && x.r);

  document.getElementById("recommendations").innerHTML=recs.map(({a,i,r})=>`
    <div class="recommendation">
      <div class="rec-top">
        <div class="rec-title">#${i.id} · ${esc(i.title)}</div>
        <span class="priority ${i.severity}">${i.priority}/100</span>
      </div>
      <div class="rec-details">
        <div><span>Recommended</span><b>${r.icon} ${r.id}</b></div>
        <div><span>Distance</span><b>${a.distance}</b></div>
        <div><span>Confidence</span><b>92%</b></div>
      </div>
      <div class="incident-meta">${esc(a.reason)}</div>
      <div class="rec-actions">
        <button class="mini-btn approve" onclick="approveAssignment(${i.id})">✓ Approve</button>
        <button class="mini-btn" onclick="modifyAssignment(${i.id})">Modify</button>
        <button class="mini-btn reject" onclick="rejectAssignment(${i.id})">Reject</button>
      </div>
    </div>`).join("");
}

window.approveAssignment=function(id){
  const i=state.incidents.find(x=>x.id===id);
  if(i){i.status="Approved by Commander";toast(`Incident #${id} approved by commander`,"success");addFeed(`<b>Commander approved</b> response for Incident #${id}`);renderAll();}
}
window.modifyAssignment=function(id){toast(`Modify mode opened for Incident #${id}`,"warning")}
window.rejectAssignment=function(id){toast(`Recommendation rejected for Incident #${id}`,"danger")}

function renderFeed(){
  document.getElementById("liveFeed").innerHTML=state.feed.map(f=>`<div class="feed-row"><span class="feed-time">${f.time}</span><span class="feed-msg">${f.message}</span></div>`).join("") || `<div class="feed-row"><span class="feed-msg">Simulation waiting for incoming events...</span></div>`;
}

function renderIncidentTable(){
  const search=(document.getElementById("incidentSearch")?.value||"").toLowerCase();
  const filter=document.getElementById("severityFilter")?.value||"all";
  const data=state.incidents.filter(i=>
    (filter==="all"||i.severity===filter) &&
    (`${i.id} ${i.title} ${i.type}`.toLowerCase().includes(search))
  ).sort((a,b)=>b.priority-a.priority);

  document.getElementById("incidentTable").innerHTML=`<table class="data-table">
    <thead><tr><th>ID</th><th>Incident</th><th>Severity</th><th>People</th><th>Priority</th><th>Reports</th><th>Status</th></tr></thead>
    <tbody>${data.map(i=>`<tr>
      <td>#${i.id}</td><td><b>${esc(i.title)}</b><br><span class="muted">${esc(i.type)}</span></td>
      <td><span class="priority ${i.severity}">${i.severity.toUpperCase()}</span></td>
      <td>${i.people}</td><td><b>${i.priority}</b>/100</td><td>${i.reports}</td><td>${esc(i.status)}</td>
    </tr>`).join("")}</tbody></table>`;
}

function renderReports(){
  const samples=[
    "Water entered several houses near Ward 7. Around 20 people may be trapped.",
    "School road is completely flooded and families need evacuation.",
    "Water level is rising rapidly near Riverside Road.",
    "Hospital B reports power failure during heavy rainfall.",
    "Road near market underpass is blocked by flood water.",
    "Several elderly residents are isolated near the river."
  ];
  document.getElementById("reportGrid").innerHTML=samples.map((s,idx)=>`
    <div class="report-card">
      <span class="tag">REPORT R-${1000+idx}</span>
      <h4>${idx%2?"Citizen Report":"Field Team Report"}</h4>
      <p>${s}</p>
      <span class="tag">AI: ${idx===0?"Critical Flood":idx===3?"Infrastructure Failure":"Related Flood Report"}</span>
    </div>`).join("");
}

function renderResources(){
  const available=state.resources.filter(r=>r.available && r.status!=="Assigned").length;
  const assigned=state.resources.filter(r=>r.status==="Assigned").length;
  const offline=state.resources.filter(r=>!r.available).length;
  document.getElementById("resourceSummary").innerHTML=[
    ["Total",state.resources.length],["Available",available],["Assigned",assigned],["Unavailable",offline]
  ].map(x=>`<div class="summary-card"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join("");

  document.getElementById("resourceGrid").innerHTML=state.resources.map(r=>`
    <div class="resource-card">
      <span class="resource-status ${!r.available?"offline":r.status==="Assigned"?"busy":"available"}">${!r.available?"Unavailable":r.status}</span>
      <h4>${r.icon} ${r.id}</h4>
      <div class="muted">${r.type}</div>
      <div class="resource-info">
        <div><span>Capacity</span><b>${r.cap}</b></div>
        <div><span>Location</span><b>${r.lat.toFixed(3)}, ${r.lng.toFixed(3)}</b></div>
      </div>
    </div>`).join("");
}

function renderHospitals(){
  document.getElementById("hospitalGrid").innerHTML=state.hospitals.map(h=>{
    const pct=Math.round(h.occupied/h.capacity*100);
    return `<div class="resource-card"><h4>🏥 ${h.name}</h4><div class="muted">${h.location}</div>
      <div class="resource-info"><div><span>Occupancy</span><b>${h.occupied}/${h.capacity}</b></div><div><span>Status</span><b>${h.status}</b></div></div>
      <div class="bar-track" style="margin-top:12px"><div class="bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join("");
}
function renderShelters(){
  document.getElementById("shelterGrid").innerHTML=state.shelters.map(s=>{
    const pct=Math.round(s.occupied/s.capacity*100);
    return `<div class="resource-card"><h4>🏠 ${s.name}</h4><div class="muted">${s.location}</div>
      <div class="resource-info"><div><span>Occupancy</span><b>${s.occupied}/${s.capacity}</b></div><div><span>Status</span><b>${s.status}</b></div></div>
      <div class="bar-track" style="margin-top:12px"><div class="bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  }).join("");
}
function renderRoads(){
  document.getElementById("roadGrid").innerHTML=state.roads.map(r=>`
    <div class="road-card"><h4>🚧 ${r.name}</h4><p class="muted">${r.updated}</p>
      <span class="priority ${r.risk==="Critical"?"critical":r.risk==="High"?"high":"low"}">${r.status}</span>
      <div class="resource-info"><div><span>Risk</span><b>${r.risk}</b></div></div>
    </div>`).join("");
}
function renderAnalytics(){
  const values=[12,20,32,45,58,74,91,105,118,127];
  document.getElementById("reportsChart").innerHTML=values.map(v=>`<div class="chart-bar" style="height:${Math.max(12,v/127*160)}px" title="${v} reports"></div>`).join("");
  const critical=state.incidents.filter(i=>i.severity==="critical").length, high=state.incidents.filter(i=>i.severity==="high").length, med=state.incidents.filter(i=>i.severity==="medium").length;
  document.getElementById("severityChart").innerHTML=[
    ["Critical",critical,6],["High",high,9],["Medium",med,16]
  ].map(x=>`<div class="bar-row"><div class="bar-label"><span>${x[0]}</span><b>${x[1]}</b></div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100,x[1]/x[2]*100)}%"></div></div></div>`).join("");
  const used=state.resources.filter(r=>r.status==="Assigned"||r.status==="Busy").length;
  document.getElementById("resourceChart").innerHTML=[
    ["Rescue Teams",state.resources.filter(r=>r.type==="Rescue Team"&&r.status==="Assigned").length,5],
    ["Ambulances",state.resources.filter(r=>r.type==="Ambulance"&&r.status==="Assigned").length,4],
    ["Field Teams",state.resources.filter(r=>r.type==="Field Team"&&r.status==="Assigned").length,2],
    ["Generators",state.resources.filter(r=>r.type==="Generator Unit"&&r.status==="Assigned").length,2]
  ].map(x=>`<div class="bar-row"><div class="bar-label"><span>${x[0]}</span><b>${x[1]}/${x[2]}</b></div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100,x[1]/x[2]*100)}%"></div></div></div>`).join("");
}

function renderAll(){
  renderKPIs();renderCritical();renderRecommendations();renderFeed();renderIncidentTable();renderReports();renderResources();renderHospitals();renderShelters();renderRoads();renderAnalytics();renderMap();
}

function showSection(name){
  document.querySelectorAll(".page-section").forEach(s=>s.classList.remove("active"));
  const target=document.getElementById(`${name}-section`);
  if(target)target.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.section===name));
  const titles={dashboard:"Urban Flood Response",incidents:"Incident Command",reports:"Incoming Reports",resources:"Resource Management",hospitals:"Hospital Network",shelters:"Shelter Network",roads:"Road Status",analytics:"Response Analytics",simulation:"What-If Simulation"};
  document.getElementById("page-title").textContent=titles[name]||"Urban Flood Response";
  setTimeout(()=>state.map?.invalidateSize(),100);
}

function openModal(id){document.getElementById(id).classList.remove("hidden")}
function closeModal(id){document.getElementById(id).classList.add("hidden")}

function startFloodSimulation(){
  if(state.simulationRunning)return;
  state.simulationRunning=true;
  state.reports=0;
  state.feed=[];
  addFeed("<b>Flood simulation started.</b> Emergency reports are arriving.");
  toast("Flood simulation started","success");
  const steps=[20,45,78,105,127];
  let idx=0;
  clearInterval(state.reportTimer);
  state.reportTimer=setInterval(()=>{
    state.reports=steps[idx];
    const messages=[
      `<b>20 reports received</b> from citizens and field teams.`,
      `<b>45 reports received.</b> AI correlation is running.`,
      `<b>78 reports received.</b> 18 related report clusters detected.`,
      `<b>105 reports received.</b> Priority engine updated.`,
      `<b>127 reports received.</b> 31 unique incidents identified.`
    ];
    addFeed(messages[idx]);
    if(idx===4){
      state.simulationRunning=false;
      toast("Simulation processed: 127 reports → 31 incidents","success");
      state.incidents=demoIncidents.map(x=>({...x}));
      renderAll();
      clearInterval(state.reportTimer);
    }else{
      state.incidents=demoIncidents.slice(0,Math.max(5,Math.round(11*(idx+1)/5))).map(x=>({...x}));
      renderAll();
    }
    idx++;
  },1000);
}

function resetDemo(){
  clearInterval(state.reportTimer);state.simulationRunning=false;state.planVersion=1;
  cloneData();state.reports=0;state.incidents=[];
  addFeed("<b>System reset.</b> Ready for a new flood simulation.");
  renderAll();toast("Demo reset","success");
}

function replan(reason="Manual re-plan"){
  const oldAssignments=state.assignments.map(x=>({...x}));
  const disabled=state.resources.find(r=>!r.available);
  if(disabled){
    const replacement=state.resources.find(r=>r.available&&r.status!=="Assigned"&&r.type==="Rescue Team"&&r.id!==disabled.id);
    if(replacement){
      state.assignments=state.assignments.map(a=>a.resource===disabled.id?{...a,resource:replacement.id,distance:"1.2 km",reason:"Reassigned after resource failure"}:a);
      replacement.status="Assigned";
    }
  } else {
    const alt=state.resources.find(r=>r.available&&r.status!=="Assigned"&&r.type==="Rescue Team");
    const target=state.assignments[0];
    if(alt&&target){target.resource=alt.id;target.reason="Re-optimized based on current conditions";alt.status="Assigned"}
  }
  state.planVersion++;
  renderAll();
  return {oldAssignments,reason};
}

function runWhatIfScenario(scenario){
  if(scenario==="resource"){
    const r=state.resources.find(x=>x.id==="RT-03");
    if(r){r.available=false;r.status="Unavailable";}
    const result=replan("RT-03 became unavailable");
    return {title:"Resource Failure Detected",message:"Rescue Team 3 is no longer available. The previous response plan is no longer optimal.",result};
  }
  if(scenario==="road"){
    const road=state.roads.find(x=>x.name==="Ward 7 Main Road"); if(road)road.status="Blocked";
    const result=replan("Ward 7 road blocked");
    return {title:"Route Constraint Detected",message:"Ward 7 Main Road is blocked. Recalculating accessible resource assignments.",result};
  }
  if(scenario==="flood"){
    state.incidents.filter(i=>i.severity!=="critical").slice(0,3).forEach(i=>{i.priority=Math.min(99,i.priority+12);if(i.priority>=90)i.severity="critical";});
    const result=replan("Flood severity increased");
    return {title:"Flood Expansion Detected",message:"Water level increased. Priority scores for affected incidents were recalculated.",result};
  }
  if(scenario==="hospital"){
    const h=state.hospitals.find(x=>x.name==="Hospital B"); if(h){h.capacity=60;h.occupied=58;h.status="Critical Capacity";}
    const result=replan("Hospital B capacity reduced");
    return {title:"Hospital Capacity Warning",message:"Hospital B has limited capacity. Medical recommendations should be redirected.",result};
  }
  if(scenario==="incident"){
    state.incidents.unshift({id:1099,title:"New critical flood rescue",type:"Flood / Rescue",lat:18.519,lng:73.879,severity:"critical",people:35,priority:98,required:"Rescue Team",reports:1,status:"Awaiting Approval"});
    state.reports+=1;
    const result=replan("New critical incident arrived");
    return {title:"New Critical Incident",message:"A priority 98 incident was added and the response plan was re-optimized.",result};
  }
}

function showScenarioResult(data,targetId="scenarioResult"){
  const target=document.getElementById(targetId);
  const old=data.result.oldAssignments;
  const newA=state.assignments;
  target.innerHTML=`<div class="result-box">
    <h4>⚠ ${data.title}</h4>
    <p class="muted">${data.message}</p>
    <h4 style="margin-top:16px">NEW RESPONSE PLAN · Version ${state.planVersion}</h4>
    ${newA.slice(0,5).map(a=>{
      const oldA=old.find(x=>x.incident===a.incident);
      return `<div class="replan-row"><span class="replan-old">${oldA?.resource||"—"}</span><span>→</span><span class="replan-new"><b>${a.resource}</b></span></div>`
    }).join("")}
    <p style="color:#67ddb0;font-size:9px;margin-bottom:0">✓ Response plan successfully re-optimized. Human commander approval required.</p>
  </div>`;
}

function submitIncident(){
  const desc=document.getElementById("incidentDescription").value.trim()||"Flood water rising near Ward 7";
  const people=Number(document.getElementById("peopleInput").value)||10;
  const severity=document.getElementById("severityInput").value.toLowerCase();
  const lat=Number(document.getElementById("latInput").value)||18.518;
  const lng=Number(document.getElementById("lngInput").value)||73.852;
  const box=document.getElementById("analysisState");
  box.classList.remove("hidden");
  const states=["Analyzing report...","Extracting incident information...","Checking related reports...","Calculating priority..."];
  let i=0;
  const t=setInterval(()=>{
    box.textContent=states[i++];
    if(i===states.length){
      clearInterval(t);
      const id=1100+state.incidents.length;
      const base=severity==="critical"?92:severity==="high"?78:55;
      const priority=Math.min(99,base+Math.min(7,Math.floor(people/10)));
      state.incidents.unshift({id,title:desc.slice(0,42)+(desc.length>42?"…":""),type:"Flood / Rescue",lat,lng,severity,people,priority,required:"Rescue Team",reports:1,status:"Awaiting Approval"});
      state.reports++;
      addFeed(`<b>New Incident #${id}</b> created after AI analysis. Priority ${priority}/100.`);
      closeModal("incidentModal");box.classList.add("hidden");
      renderAll();toast(`Incident #${id} analyzed successfully`,"success");
    }
  },450);
}

document.addEventListener("DOMContentLoaded",()=>{
  cloneData();
  document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>showSection(btn.dataset.section)));
  document.querySelectorAll("[data-section-link]").forEach(btn=>btn.addEventListener("click",()=>showSection(btn.dataset.sectionLink)));
  const notificationButtons=[document.getElementById("topNotificationBtn"),document.getElementById("notificationBellBtn")].filter(Boolean);
  notificationButtons.forEach(btn=>btn.addEventListener("click",()=>toast("3 active alerts: 2 critical incidents + 1 resource warning","warning")));
  document.getElementById("startSimulation").addEventListener("click",startFloodSimulation);
  document.getElementById("resetDemo").addEventListener("click",resetDemo);
  document.getElementById("replanBtn").addEventListener("click",()=>{
    const d=replan("Commander requested re-plan");toast("Response plan re-optimized","success");addFeed("<b>Commander triggered manual re-planning.</b>");
  });
  document.getElementById("whatIfBtn").addEventListener("click",()=>openModal("whatIfModal"));
  document.getElementById("newIncidentBtn").addEventListener("click",()=>openModal("incidentModal"));
  document.getElementById("reportBtn").addEventListener("click",()=>openModal("incidentModal"));
  document.getElementById("submitIncident").addEventListener("click",submitIncident);
  document.getElementById("disableResourceBtn").addEventListener("click",()=>{
    const r=state.resources.find(x=>x.id==="RT-03");
    if(r){r.available=false;r.status="Unavailable";toast("RT-03 marked unavailable","warning");addFeed("<b>Resource failure simulated:</b> RT-03 unavailable.");renderAll();}
  });
  document.getElementById("incidentSearch").addEventListener("input",renderIncidentTable);
  document.getElementById("severityFilter").addEventListener("change",renderIncidentTable);
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
  document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));
  document.querySelectorAll(".scenario-card[data-scenario]").forEach(c=>c.addEventListener("click",()=>{
    document.querySelectorAll(".scenario-card[data-scenario]").forEach(x=>x.classList.remove("selected"));
    c.classList.add("selected");state.scenario=c.dataset.scenario;
  }));
  document.querySelectorAll(".scenario-card[data-modal-scenario]").forEach(c=>c.addEventListener("click",()=>{
    document.querySelectorAll(".scenario-card[data-modal-scenario]").forEach(x=>x.classList.remove("selected"));
    c.classList.add("selected");state.scenario=c.dataset.modalScenario;
  }));
  document.getElementById("runScenarioBtn").addEventListener("click",()=>{
    const data=runWhatIfScenario(state.scenario);showScenarioResult(data);toast("Scenario executed and plan re-optimized","success");addFeed(`<b>What-if scenario:</b> ${data.title}`);
  });
  document.getElementById("runWhatIf").addEventListener("click",()=>{
    const data=runWhatIfScenario(state.scenario);showScenarioResult(data,"whatIfResult");toast("Adaptive re-planning completed","success");addFeed(`<b>Adaptive re-planning:</b> ${data.title}`);
  });
  document.getElementById("dashboardRunScenario")?.addEventListener("click",()=>{
    const select=document.getElementById("dashboardScenario");
    state.scenario=select?.value||"resource";
    const data=runWhatIfScenario(state.scenario);
    toast("Adaptive re-planning completed","success");
    addFeed(`<b>Dashboard what-if:</b> ${data.title}`);
    showSection("dashboard");
  });

  renderAll();
  initMap();
  setTimeout(()=>addFeed("<b>System ready.</b> Start the flood simulation for the hackathon demo."),300);
});
