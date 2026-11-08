/* Vancouver Dragons RLFC: site script */
(function(){
  var d=document; d.documentElement.classList.add('js');
  var yr=d.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var nav=d.getElementById('nav'), mb=d.getElementById('menuBtn');
  if(mb){
    mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Close menu':'Open menu');});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.focus();}});
  }

  /* Set of six: the header tally fills as you read the page.
     Tackle names come from Rugby League BC's coaching guide. */
  var bars=d.querySelectorAll('.tally-bars i'), lbl=d.getElementById('tallyLbl');
  var names=[['Kick-off','Set of six'],['Tackle 1','Set the platform'],['Tackle 2','Build momentum'],['Tackle 3','Create opportunities'],['Tackle 4','Apply pressure'],['Tackle 5','Set up the finish'],['Tackle 6','Finish the set']];
  var cur=-1, ticking=false;
  function tally(){
    ticking=false;
    var h=d.documentElement, max=h.scrollHeight-h.clientHeight;
    var p=max>40?Math.min(1,Math.max(0,h.scrollTop/max)):1;
    var n=p<0.03?0:Math.min(6,Math.ceil(p*6));
    if(n===cur) return; cur=n;
    for(var i=0;i<6;i++){bars[i].className=i<n-1?'done':(i===n-1?'now':'');}
    if(lbl) lbl.innerHTML=names[n][0]+'<small>'+names[n][1]+'</small>';
  }
  if(bars.length){tally(); window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(tally);}},{passive:true}); window.addEventListener('resize',tally);}

  /* Reveal on scroll */
  var rvs=d.querySelectorAll('.rv');
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
    rvs.forEach(function(x){io.observe(x);});
  } else { rvs.forEach(function(x){x.classList.add('in');}); }

  /* YouTube: load the player only when someone presses play */
  d.querySelectorAll('button.yt[data-id]').forEach(function(b){
    b.addEventListener('click',function(){
      var f=d.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+b.getAttribute('data-id')+'?autoplay=1&rel=0';
      f.title=b.getAttribute('aria-label')||'Video';
      f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen=true; f.referrerPolicy='strict-origin-when-cross-origin';
      b.innerHTML=''; b.appendChild(f); b.style.cursor='default';
    },{once:true});
  });

  /* Days to Vegas (Feb 25, 2027, Pacific) */
  var start=Date.UTC(2027,1,25,8), end=Date.UTC(2027,1,27,8), now=Date.now();
  d.querySelectorAll('[data-days]').forEach(function(el){
    var wrap=el.closest('[data-days-wrap]');
    if(now<start){el.textContent=Math.ceil((start-now)/864e5);}
    else if(now<end){el.textContent='Game week'; var s=wrap&&wrap.querySelector('[data-days-label]'); if(s) s.textContent='Status';}
    else if(wrap){wrap.style.display='none';}
  });

  /* Schedule filter */
  var seg=d.querySelectorAll('[data-filter]'), rounds=d.getElementById('rounds');
  seg.forEach(function(btn){btn.addEventListener('click',function(){
    seg.forEach(function(b){b.setAttribute('aria-pressed',b===btn?'true':'false');});
    rounds.classList.toggle('only-dragons',btn.getAttribute('data-filter')==='dragons');
  });});

  /* Life members: sortable columns */
  var lm=d.getElementById('lmTable');
  if(lm){
    var tb=lm.tBodies[0];
    lm.querySelectorAll('th').forEach(function(th,ci){
      th.setAttribute('tabindex','0');
      function sort(){
        var asc=th.getAttribute('aria-sort')==='descending';
        lm.querySelectorAll('th').forEach(function(x){x.removeAttribute('aria-sort');});
        th.setAttribute('aria-sort',asc?'ascending':'descending');
        var rows=[].slice.call(tb.rows);
        rows.sort(function(a,b){
          var x=a.cells[ci].getAttribute('data-v')||a.cells[ci].textContent, y=b.cells[ci].getAttribute('data-v')||b.cells[ci].textContent;
          var nx=parseFloat(x), ny=parseFloat(y), r=(!isNaN(nx)&&!isNaN(ny))?nx-ny:x.localeCompare(y);
          return asc?r:-r;
        });
        rows.forEach(function(r){tb.appendChild(r);});
      }
      th.addEventListener('click',sort);
      th.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();sort();}});
    });
  }

  /* Contact form: topic from ?topic=, business field for sponsors, AJAX to Netlify */
  var f=d.getElementById('contactForm');
  if(f){
    var topic=d.getElementById('f-topic'), biz=d.getElementById('bizFld'), st=d.getElementById('fStatus');
    var map={'general':'General inquiry','package':'Sponsoring the 2027 season','vegas-sponsor':"Sponsoring the Vegas 9's trip",'season-sponsor':'Sponsoring the 2027 season','vegas-player':"Playing in the Vegas 9's",'play':'Playing in 2027','volunteer':'Volunteering','merch':'Ordering merchandise'};
    var q=new URLSearchParams(location.search), t=q.get('topic'), item=q.get('item');
    if(t&&map[t]) topic.value=map[t];
    if(item){var m=d.getElementById('f-msg'); m.value='I’d like to order: '+item+'\nSize: \n';}
    if(t==='package'){d.getElementById('f-msg').value='Please send me the 2027 Vancouver Dragons sponsorship package.';}
    function syncBiz(){biz.classList.toggle('show',/Sponsor/i.test(topic.value));}
    topic.addEventListener('change',syncBiz); syncBiz();
    f.addEventListener('submit',function(e){
      e.preventDefault(); st.className='f-status';
      var bad=[].slice.call(f.querySelectorAll('[required]')).filter(function(x){return !x.value.trim()||(x.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.value));});
      if(bad.length){st.className='f-status err';st.textContent='Add your '+bad.map(function(x){return d.querySelector('label[for="'+x.id+'"]').firstChild.textContent.trim().toLowerCase();}).join(', ')+' to send.';bad[0].focus();return;}
      var btn=f.querySelector('button[type=submit]'); btn.disabled=true; st.textContent='Sending…';
      /* Player enquiries go to their own Netlify form so they can be emailed to a different person */
      f.querySelector('[name="form-name"]').value=/^Playing/.test(topic.value)?'dragons-play':'dragons-contact';
      fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()})
        .then(function(r){if(!r.ok)throw 0; f.reset(); syncBiz(); st.className='f-status ok'; st.textContent='Message sent. The club will reply by email.';})
        .catch(function(){st.className='f-status err'; st.innerHTML='Your message didn’t send. Email <a href="mailto:secretary@vancouverdragons.ca">secretary@vancouverdragons.ca</a> instead.';})
        .then(function(){btn.disabled=false;});
    });
  }
})();

/* Looping videos: play only while on screen, never with reduced motion; every video can be paused */
(function(){
  var vids=[].slice.call(document.querySelectorAll('video[data-autoplay]')); if(!vids.length) return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  vids.forEach(function(v){
    v.userPaused=reduce;
    var box=v.closest('.vbox')||v.closest('.phero'), btn=box?box.querySelector('.vid-toggle'):null;
    var sec=v.closest('.vband'), bandBtn=sec?sec.querySelector('.vband-toggle'):null;
    function label(){
      if(btn){btn.setAttribute('aria-label',v.paused?'Play video':'Pause video');btn.classList.toggle('paused',v.paused);}
      if(bandBtn){bandBtn.textContent=v.paused?'Play video':'Pause video';bandBtn.setAttribute('aria-pressed',v.paused?'true':'false');}
    }
    function toggle(){ if(v.paused){v.userPaused=false;v.play().catch(function(){});} else {v.userPaused=true;v.pause();} setTimeout(label,60); }
    if(btn) btn.addEventListener('click',toggle);
    if(bandBtn) bandBtn.addEventListener('click',toggle);
    v.addEventListener('play',label); v.addEventListener('pause',label);
    label();
  });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      var v=e.target;
      if(e.isIntersecting&&!v.userPaused){v.preload='auto';v.play().catch(function(){});} else {v.pause();}
    });},{threshold:.2});
    vids.forEach(function(v){io.observe(v);});
  }
})();
