
Vue.component('nav-blog', {
	template: ' <li  class="active"><a href="/blog/list"><span class="tt">BLOG</span></a></li>'+
	'<li><a href="/wea/index"><span class="tt">WEATHER</span></a></li>'+
	'<li><a href="/blue/index"><span class="tt">BLUEPRINT</span></a></li>'+
	'<li><a href="/todo/index"><span class="tt">SOCKET</span></a></li>'
});

Vue.component('nav-weather', {
	template: '  <li ><a href="/blog/list"><span class="tt">BLOG</span></a></li>'+
	'<li class="active"><a href="/wea/index#"><span class="tt">WEATHER</span></a></li>'+
	'<li><a href="/blue/index"><span class="tt">BLUEPRINT</span></a></li>'+
	'<li><a href="/todo/index"><span class="tt">SOCKET</span></a></li>'
});

Vue.component('nav-blue', {
	template: ' <li ><a href="/blog/list"><span class="tt">BLOG</span></a></li>'+
	'<li><a href="/wea/index"><span class="tt">WEATHER</span></a></li>'+
	'<li class="active"><a href="/blue/index"><span class="tt">BLUEPRINT</span></a></li>'+
	'<li><a href="/todo/index"><span class="tt">SOCKET</span></a></li>'
});

Vue.component('nav-todo', {
	template: ' <li ><a href="/blog/list"><span class="tt">BLOG</span></a></li>'+
	'<li><a href="/wea/index"><span class="tt">WEATHER</span></a></li>'+
	'<li><a href="/blue/index"><span class="tt">BLUEPRINT</span></a></li>'+
	'<li class="active"><a href="/todo/index"><span class="tt">TODO</span></a></li>'
});

new Vue({
	el:'nav-comp'
});