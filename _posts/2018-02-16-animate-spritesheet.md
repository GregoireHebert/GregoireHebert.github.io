---
layout: default
title:  "SpriteSheet Animation"
date:   2018-02-16 21:30:00 +0100
categories: front
long_description: "Animating a spritesheet, is easy when using a software, but what if I want to do it from scratch ?"
---


Animating spritesheet, is easy when using a software, but what if I want to do it from scratch ?
Alright first of all I need a sprite sheet to move this guy:

![My sheep]({{ "/assets/animate-spritesheet/2.png" | absolute_url }})

Let's start with a walk to stay fit :)

![My spritesheet]({{ "/assets/animate-spritesheet/1.png" | absolute_url }})

and now we are ready to begin our journey.
Let's start display our image.

Ok, my image is 2095x1089 pixels. So my sheep is 419x363px.



{% highlight html %}
<html>
	<head>
		<style type="text/css">
			#sheep {
			  width: 419px;
			  height: 363px;
			  background: url('spritesheets/white_sheep_1/__white_sheep_1_walk.png') left center;
			}
		</style>
	</head>
	<body>
		<div id="sheep"></div>
	</body>
</html>
{% endhighlight %}

![My sheep]({{ "/assets/animate-spritesheet/2.png" | absolute_url }})

Now, I need to display successively each frame.
there is 3 rows of 5 images, 15 frames then !

{% highlight css %}
#sheep {
  width: 419px;
  height: 363px;
  background: url('spritesheets/white_sheep_1/__white_sheep_1_walk.png') left center;
  animation: play 0.8s steps(15) infinite;
}

@keyframes play {
   100% { background-position: -2095px; }
}
{% endhighlight %}

it'll loop for ever thanks to the infinite instruction, and the keyframe allow us to define the width limit.
let's see:

![oops]({{ "/assets/animate-spritesheet/3.gif" | absolute_url }})

ok, here, the loop only contain the first row... it doesn't goes on the second row.
well what if we use a grid and we navigate through it ?
Let's try this full size.

{% highlight css %}
#sheep {
  width: 2095px;
  height: 1089px;
  background: url('spritesheets/white_sheep_1/__white_sheep_1_walk.png') left center;
  position: relative;
}

#sheep:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 363px;
    left: 0px;
    top: 0px;
    border: solid 1px red;
    -webkit-animation: playvertical 2s steps(3) infinite; 
}

@-webkit-keyframes playvertical {
     0% { top:   0px; }
   100% { top: 1089px; }
}
{% endhighlight %}

here we've got our vertical lines.

![vertical Lines]({{ "/assets/animate-spritesheet/4.gif" | absolute_url }})

and we add the same rule for the horizontal lines.

{% highlight css %}
#sheep:after {
    content: "";
    position: absolute;
    width: 419px;
    height: 100%;
    left: 0px;
    top: 0px;
    border: solid 1px red;
    -webkit-animation: playhorizontal 3s steps(5) infinite; 
}

@-webkit-keyframes playhorizontal {
     0% { left:   0px; }
   100% { left: 2095px; }
}
{% endhighlight %}

![Full Grid]({{ "/assets/animate-spritesheet/5.gif" | absolute_url }})

You can see we got here the idea of running through each image.
Let's unite the two seperate animation in the same instruction and border only each frame after another.

{% highlight css %}
#sheep {
  width: 2095px;
  height: 1089px;
  background: url('spritesheets/white_sheep_1/__white_sheep_1_walk.png') left center;
  position: relative;
}

#sheep:before {
    content: "";
    position: absolute;
    width: 419px;
    height: 363px;
    left: 0px;
    top: 0px;
    border: solid 1px red;
    -webkit-animation: playvertical 9s steps(3) infinite, playhorizontal 3s steps(5) infinite;
}

@-webkit-keyframes playvertical {
     0% { top:   0px; }
   100% { top: 1089px; }
}

@-webkit-keyframes playhorizontal {
     0% { left:   0px; }
   100% { left: 2095px; }
}
{% endhighlight %}

![Frame Selection]({{ "/assets/animate-spritesheet/6.gif" | absolute_url }})

Now we can remove the red line and replace the animation directly on the sheep div.
We don't need the left center alignment for the background anymore.
Last thing to change is the keyframe, instead of changing the top or left position of the lines,
we want to move the background position.

{% highlight css %}
#sheep {
  width: 419px;
  height: 363px;
  background: url('spritesheets/white_sheep_1/__white_sheep_1_walk.png');
  position: relative;
  -webkit-animation: playvertical 0.9s steps(3) infinite, playhorizontal 0.3s steps(5) infinite;
}

@-webkit-keyframes playvertical {
     0% { background-position-y:   0px; }
   100% { background-position-y: -1089px; }
}

@-webkit-keyframes playhorizontal {
     0% { background-position-x:   0px; }
   100% { background-position-x: -2095px; }
}
{% endhighlight %}

![Full Animation]({{ "/assets/animate-spritesheet/7.gif" | absolute_url }})

Whouhouu !
We can now apply the same rule to every animation we got.
Little specificity, sometimes you need to stop the animation on the last frame.
The solution is to act as if there was 1 frame less than it should and add the forwards instruction.
The forwards key tells the animation to go one frame further (the last one we want) and stop there.

{% highlight css %}
#die {
  width: 419px;
  height: 363px;
  background: url('spritesheets/white_sheep_1/__white_sheep_1_die.png');
  -webkit-animation: die 0.6s steps(4);
  -webkit-animation-fill-mode: forwards;
}

@-webkit-keyframes die {
     0% { background-position-x:   0px; }
   100% { background-position-x: -1676px; }
}
{% endhighlight %}

Here is the result

![Every Animation]({{ "/assets/animate-spritesheet/8.gif" | absolute_url }})

Thanks !