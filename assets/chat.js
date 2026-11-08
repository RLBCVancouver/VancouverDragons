/* Vancouver Dragons: site help chat.
   Answers come only from what's published on this website (no AI service, nothing stored).
   Anything it can't answer goes to the club through the contact form.
   To edit an answer, change the text in the TOPICS list below. */
(function(){
  var d=document;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SEC='secretary@vancouverdragons.ca';
  var PKG='/assets/docs/vancouver-dragons-2027-sponsorship.pdf';
  function a(href,txt,ext){return '<a href="'+href+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+txt+'</a>';}

  /* Each topic: words that trigger it, the answer, and follow-up buttons [label, link]. */
  var TOPICS=[
    {id:'join',label:'How do I join?',
     keys:['join','sign up','signup','register','registration','new player','try out','tryout','trial','start playing','want to play','play for','get involved','beginner','never played'],
     a:'Great to have you. Registration runs through Rugby League BC at '+a('https://www.rugbyleaguebc.ca/','rugbyleaguebc.ca',1)+'. New and returning players are welcome, and many of our players come from rugby union. Put your hand up through the form and the club will be in touch.',
     go:[['New players start here','/play/'],['Tell the club you want to play','/contact/?topic=play']]},
    {id:'train',label:'When does training start?',
     keys:['training','train','practice','practise','pre-season','preseason','session','when start','start date'],
     a:'Practice for the 2027 season is expected to begin in April 2027. Training dates and location are announced closer to pre-season. Follow '+a('https://www.instagram.com/vancouver_dragons_/','@vancouver_dragons_',1)+' or email '+a('mailto:'+SEC,SEC)+'.',
     go:[['How the season runs','/schedule/']]},
    {id:'sched',label:'2027 schedule',
     keys:['schedule','fixture','fixtures','games','game day','match','matches','season','when do','dates','draw','calendar','finals','grand final'],
     a:'Rugby League BC is finalising the 2027 fixtures, and the full schedule goes up on the site as soon as it\'s confirmed. The season usually runs: pre-season training from April, the RLBC 9s in late May or early June, the regular season in June and July, then semifinals and the Grand Final.',
     go:[['See the schedule page','/schedule/']]},
    {id:'where',label:'Where do you play?',
     keys:['where','location','brockton','stanley park','oval','ground','field','venue','home games','address','parking'],
     a:'Home games are at Brockton Oval in Stanley Park, Vancouver. Training location for 2027 is announced closer to pre-season.',
     go:[['Schedule','/schedule/']]},
    {id:'cost',label:'How much does it cost?',
     keys:['cost','fee','fees','price to play','how much to play','pay to play','membership','insurance'],
     a:'Fees for 2027 are set by Rugby League BC and vary by club and competition. They typically cover the 9s tournament, regular season games and playoff fixtures. The club is fully amateur. Players need their own playing health insurance, such as MSP or travel insurance that covers amateur sport.',
     go:[['Rugby League BC','https://www.rugbyleaguebc.ca/',1]]},
    {id:'union',label:'I play union. Can I play league?',
     keys:['union','rugby union','15s','sevens','7s','difference','positions','position'],
     a:'Yes. Many Dragons players come from rugby union. The club was set up so players can play union in the winter and league for the Dragons in the summer. The Play page has a chart showing where union positions fit in league.',
     go:[['Union to league guide','/play/']]},
    {id:'intl',label:'Can international players join?',
     keys:['international','visa','overseas','abroad','working holiday','moving to vancouver','new to vancouver','accommodation','work in vancouver','expat'],
     a:'Yes, there are no restrictions on international players. The club is fully amateur so there is no payment, but it has contacts for work and accommodation in Vancouver. You\'ll need your own playing health insurance.',
     go:[['Get in touch','/contact/?topic=play']]},
    {id:'vegas',label:'Vegas 9\'s',
     keys:['vegas','las vegas','nevada','nines','9s','9\'s','february','feb','tournament','trip'],
     a:'The Dragons are taking a 9s squad to the Rugby League Vegas 9\'s in Las Vegas, Feb 25–26, 2027. We\'re looking for players and sponsors.',
     go:[['Vegas page','/vegas/'],['I want to play in Vegas','/contact/?topic=vegas-player'],['Sponsor the trip','/contact/?topic=vegas-sponsor']]},
    {id:'spon',label:'Sponsorship',
     keys:['sponsor','sponsorship','sponsoring','advertise','advertising','logo on','partner','partnership','support the club','donate','donation','business'],
     a:'Thanks for thinking of us. You can back the Vegas 9\'s trip (promotion on our socials and website, a 2027 Dragons jersey, hats and coozies, and a training shirt with your logo) or the 2027 season, where jersey sponsorships run from $500 matchday to $5,000 platinum. The package sets out every option.',
     go:[['2027 sponsorship package (PDF)',PKG,1],['Talk sponsorship','/contact/?topic=season-sponsor'],['Our sponsors','/sponsors/']]},
    {id:'merch',label:'Merch & jerseys',
     keys:['merch','merchandise','shop','store','jersey','jerseys','hoodie','cap','hat','singlet','polo','shorts','tracksuit','buy','order','charity'],
     a:'The club shop has the new charity jersey ($100, half of every sale goes to MADD Canada), plus the throwback jersey, hoodie, cap, singlet, polo and tracksuit jacket. Prices are in CAD. Pick an item and the club confirms sizes, availability and payment by email.',
     go:[['Club shop','/shop/'],['Ask about merch','/contact/?topic=merch']]},
    {id:'vol',label:'Volunteering',
     keys:['volunteer','volunteering','help out','helping','non player','not playing','coach','coaching','manager','ref','referee'],
     a:'Yes please. The club always needs volunteers for home game duties, team management and general club tasks.',
     go:[['Volunteer with the club','/contact/?topic=volunteer']]},
    {id:'league',label:'Who\'s in the league?',
     keys:['league','clubs','teams','opponents','rlbc','rugby league bc','competition','who do you play'],
     a:'Five clubs compete in Rugby League BC for 2027: Point Grey Thunder, Valley Warriors, Vancouver Dragons, Vancouver Valley Vipers and Whistler Wolves.',
     go:[['Rugby League BC','https://www.rugbyleaguebc.ca/',1]]},
    {id:'club',label:'About the club',
     keys:['about','history','founded','since','club','champions','won','awards','board','president','treasurer','committee'],
     a:'The Dragons have played rugby league in Vancouver since 2012. In 2026 we won the RLBC 9s, and the Reserves won the first-ever RLBC Reserve Grade championship. The Club page has our history, board and 2026 awards.',
     go:[['Club page','/club/']]},
    {id:'contact',label:'Contact the club',
     keys:['contact','email','phone','call','reach','instagram','facebook','dm','message','talk to','speak to','human','person'],
     a:'Email '+a('mailto:'+SEC,SEC)+', DM '+a('https://www.instagram.com/vancouver_dragons_/','@vancouver_dragons_',1)+' on Instagram, or send a message through the form and the club will reply by email.',
     go:[['Contact form','/contact/']]},
    {id:'hi',keys:['hi','hello','hey','gday','g\'day','yo','sup','morning','evening'],
     a:'Hey! What can I help with? Pick a topic below or type a question.',go:[]},
    {id:'thanks',keys:['thanks','thank you','cheers','ta','legend','awesome','great'],
     a:'No worries. Anything else, just ask. 🐉',go:[]}
  ];
  var MENU=['join','train','vegas','spon','merch','contact'];
  var FALLBACK='I don\'t have an answer for that one on the website. Send it to the club and someone will reply by email.';

  function norm(t){return ' '+t.toLowerCase().replace(/[’']/g,'\'').replace(/[^a-z0-9'\s-]/g,' ').replace(/\s+/g,' ').trim()+' ';}
  function match(q){
    var t=norm(q), best=null, score=0;
    TOPICS.forEach(function(tp){
      var s=0;
      tp.keys.forEach(function(k){ if(t.indexOf(' '+k+' ')>-1||(k.length>4&&t.indexOf(k)>-1)) s+=k.indexOf(' ')>-1?2:1; });
      if(s>score){score=s;best=tp;}
    });
    return best;
  }
  function byId(id){for(var i=0;i<TOPICS.length;i++) if(TOPICS[i].id===id) return TOPICS[i];}

  /* Build the widget */
  var root=d.createElement('div'); root.className='dchat';
  root.innerHTML=
    '<button class="dchat-launch" type="button" aria-expanded="false" aria-controls="dchatPanel">'+
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3 6.5a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01z"/></svg>'+
      '<span>Questions?</span></button>'+
    '<div class="dchat-panel" id="dchatPanel" role="dialog" aria-label="Ask the Dragons" hidden>'+
      '<div class="dchat-head"><img src="/assets/img/crest-160.png" alt="" width="25" height="31"><div><b>Ask the Dragons</b><small>Quick answers from this site</small></div>'+
      '<button class="dchat-x" type="button" aria-label="Close chat"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6z"/></svg></button></div>'+
      '<div class="dchat-log" role="log" aria-live="polite"></div>'+
      '<form class="dchat-in" autocomplete="off"><label class="sr" for="dchatQ">Type your question</label>'+
      '<input id="dchatQ" type="text" placeholder="Ask about playing, Vegas, sponsoring…" maxlength="200">'+
      '<button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 20.5 21 12 3 3.5v6.6l12 1.9-12 1.9z"/></svg></button></form>'+
    '</div>';
  d.body.appendChild(root);
  var btn=root.querySelector('.dchat-launch'), panel=root.querySelector('.dchat-panel'), log=root.querySelector('.dchat-log'),
      form=root.querySelector('.dchat-in'), input=root.querySelector('#dchatQ'), started=false;

  function scroll(){log.scrollTop=log.scrollHeight;}
  function say(html,who){var m=d.createElement('div');m.className='dchat-msg '+(who||'bot');if(who==='me')m.textContent=html;else m.innerHTML=html;log.appendChild(m);scroll();return m;}
  function chips(list){
    if(!list.length) return;
    var w=d.createElement('div'); w.className='dchat-chips';
    list.forEach(function(c){
      var el;
      if(typeof c==='string'){var tp=byId(c); el=d.createElement('button'); el.type='button'; el.textContent=tp.label; el.addEventListener('click',function(){ask(tp.label,tp);});}
      else {el=d.createElement('a'); el.href=c[1]; el.textContent=c[0]+(c[2]?' ↗':' →'); if(c[2]){el.target='_blank';el.rel='noopener';}}
      w.appendChild(el);
    });
    log.appendChild(w); scroll();
  }
  function reply(tp){
    var go=function(){
      if(tp){ say(tp.a); chips(tp.go.concat(tp.id==='hi'?MENU:[])); }
      else { say(FALLBACK); chips([['Send it to the club','/contact/?topic=general'],'join','vegas','spon']); }
    };
    if(reduce) return go();
    var t=say('<span class="dots" aria-label="Typing"><i></i><i></i><i></i></span>'); t.classList.add('typing');
    setTimeout(function(){t.remove();go();},420);
  }
  function ask(text,tp){ say(text,'me'); reply(tp||match(text)); }
  function start(){
    if(started) return; started=true;
    say('G’day! 🐉 I can answer common questions about playing, the Vegas 9’s, sponsorship, merch and the club. For anything else, I’ll point you to the club.');
    chips(MENU);
  }
  function open(){panel.hidden=false;btn.setAttribute('aria-expanded','true');root.classList.add('open');start();setTimeout(function(){input.focus();},30);}
  function close(){panel.hidden=true;btn.setAttribute('aria-expanded','false');root.classList.remove('open');btn.focus();}
  btn.addEventListener('click',function(){panel.hidden?open():close();});
  root.querySelector('.dchat-x').addEventListener('click',close);
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden)close();});
  form.addEventListener('submit',function(e){e.preventDefault();var q=input.value.trim();if(!q)return;input.value='';ask(q);});
})();
