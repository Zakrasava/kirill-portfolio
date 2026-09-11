(function(){
  var root=document.documentElement, key='theme';
  function apply(t){root.setAttribute('data-theme',t);var b=document.getElementById('theme');if(b)b.setAttribute('aria-label',t==='dark'?'Включить светлую тему':'Включить тёмную тему');}
  var saved=null;try{saved=localStorage.getItem(key)}catch(e){}
  apply(saved||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
  document.addEventListener('click',function(e){
    var b=e.target.closest('#theme');if(b){var t=root.getAttribute('data-theme')==='dark'?'light':'dark';apply(t);try{localStorage.setItem(key,t)}catch(x){}}
    var c=e.target.closest('#copy');if(c){var u=location.href;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(function(){c.querySelector('span').textContent='Скопировано';setTimeout(function(){c.querySelector('span').textContent='Скопировать ссылку'},1600)},function(){prompt('Ссылка на страницу',u)});}
    var img=e.target.closest('.shot img');if(img){var lb=document.getElementById('lb');lb.querySelector('img').src=img.src;lb.classList.add('on');}
    if(e.target.closest('#lb'))document.getElementById('lb').classList.remove('on');
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')document.getElementById('lb').classList.remove('on')});
  // прогресс
  var pr=document.querySelector('.progress');
  function prog(){if(!pr)return;var h=document.documentElement.scrollHeight-innerHeight;pr.style.width=(h>0?scrollY/h*100:0)+'%'}
  // подсветка меню
  var links=[].slice.call(document.querySelectorAll('[data-spy] li')),secs=links.map(function(l){var a=l.querySelector('a');return document.querySelector(a.getAttribute('href'))});
  function spy(){var y=scrollY+100,i=0;secs.forEach(function(s,k){if(s&&s.offsetTop<=y)i=k});links.forEach(function(l,k){l.classList.toggle('on',k===i)})}
  addEventListener('scroll',function(){prog();spy()},{passive:true});prog();spy();
  // появление
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if('IntersectionObserver' in window && !reduced){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12});document.querySelectorAll('.rv').forEach(function(el){io.observe(el)})}else{document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}
  // панель модулей
  var ms=[].slice.call(document.querySelectorAll('#grid .m')),cnt=document.getElementById('cnt');
  if(ms.length){if(reduced){ms.forEach(function(m){m.classList.add('on')});cnt.textContent=ms.length}else{var i=0,id=setInterval(function(){ms[i].classList.add('on');cnt.textContent=++i;if(i>=ms.length)clearInterval(id)},150)}}
  // модули: подсветка активного в боковом списке
  var side=[].slice.call(document.querySelectorAll('.side li')),mods=side.map(function(l){return document.querySelector(l.querySelector('a').getAttribute('href'))});
  if(side.length){function sspy(){var y=scrollY+120,i=0;mods.forEach(function(s,k){if(s&&s.offsetTop<=y)i=k});side.forEach(function(l,k){l.classList.toggle('on',k===i)})}addEventListener('scroll',sspy,{passive:true});sspy();}
})();
