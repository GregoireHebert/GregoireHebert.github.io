---
layout: post
title:  "A Docker story"
date:   2018-06-06 18:20:00 +0100
categories: devops
long_description: "Docker can be greedy when using your host memory, particularly through time. Is there a radical solution to free some space ?"
---

Recently my hard drive and the `/` partition in particular went south, I had the wonderful following message:
HardDrive Full, no more space disk available. 
And of course it was during a masterclass demonstration, And it froze my laptop :(

I then cleared my computer (chrome, tmp, download) thanks to BleachBit.
It did some work and cleaned a bit of unused filed.
Then I realised most of it were on `/home`, so not really the same partition in my case.
So I digged a bit more and found out that docker was the troublemaker.

So I began with a sweet `docker system prune` then `docker volumes prune`
The first one remove every dangling image, container, network etc.
The second one remove the volumes (shit I'll have to reconstruct my databases again...)
It did the job removing almost 6Go !

But still... it's leaving me with more or less 22G coming from nowhere.

I started playing with `du ./* | grep --regexp="[0-9]G"` on different folders from the `/` partition.
And surprisingly the biggest directory was owned by docker again !! 22G of data he is not able to clean. 
He can't clean it anymore because it's file system somehow evolved with time and for any reason could not delete these files
at the time I used to work on them. Now that the system changed it can't delete them and I assume has no idea it even exits anymore !
A little `ls -al` on the `var/lib/docker` directory leads us to:

{% highlight shell %}
```
drwx------ 5 root root 4,0K sept.  9  2017 aufs
drwx------ 2 root root 4,0K sept. 27  2017 builder
drwx--x--x 3 root root 4,0K déc.  30 16:18 containerd
drwx------ 2 root root  20K juin   6 07:22 containers
drwx------ 3 root root 4,0K sept.  9  2017 image
drwxr-xr-x 3 root root 4,0K sept. 22  2017 network
-rwxr-xr-x 1 root root 1,5K sept. 22  2017 nuke-graph-directory.sh
drwx------ 4 root root 4,0K sept. 22  2017 plugins
drwx------ 2 root root 4,0K juin   6 07:48 runtimes
drwx------ 2 root root 4,0K sept.  9  2017 swarm
drwx------ 2 root root 4,0K juin   6 07:48 tmp
drwx------ 2 root root 4,0K sept.  9  2017 trust
drwx------ 2 root root  12K juin   6 07:23 volumes
```
{% endhighlight %}

***WTF is nuke-graph-directory.sh***  
After a little research, this script has been created to remove those dangling files when docker can't do it by itself.
Basically it's a "safe" `rm -rf`  
The way to use it is:

{% highlight shell %}
```
service docker stop
sudo ./nuke-graph-directory.sh /var/lib/docker
service docker start
```
{% endhighlight %}

Here you go girl !!!
22G back in the pocket :)

Not so hard to free some space xD
And please don't do this unless you know what you are doing :)

Have a great day ^^.