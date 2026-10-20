document.addEventListener('DOMContentLoaded',function(){
var els=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
els.forEach(function(el){io.observe(el)});
}else{els.forEach(function(el){el.classList.add('in')});}
document.querySelectorAll('form.dform').forEach(function(f){
f.addEventListener('submit',function(ev){
ev.preventDefault();
if(f.querySelector('.hp input') && f.querySelector('.hp input').value!==''){return;}
f.style.display='none';
var ok=document.getElementById('ok');if(ok){ok.style.display='block';}
window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});
});
});
});
