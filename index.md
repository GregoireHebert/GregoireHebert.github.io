---
layout: default
title: home
permalink: /
---

{% highlight php %}
EOF<<<
{% endhighlight %}


{% for post in site.posts %}
  <article class="{% if forloop.first %}first{% elsif forloop.last %}last{% else %}middle{% endif %}">
	<div class="article-head">
		<h2 class="title"><a href="{{ site.url }}{{ post.url }}" class="js-pjax">{{ post.title }}</a></h2>
		<p class="date">{{ post.date | date: "%d/%M/%Y" }}</p>
	</div><!--/.article-head-->
	<div class="article-content">
		{{ post.long_description }}
	</div><!--/.article-content-->
	<a href="{{site.url}}{{ post.url }}" class="full-post-link js-pjax">Read more</a>
	<hr/>
</article>
{% endfor %}


{% highlight php %}
EOF;
{% endhighlight %}