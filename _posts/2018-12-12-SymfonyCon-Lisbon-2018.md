---
layout: post
title:  "SymfonyCon Lisbon 2018"
date:   2018-12-12 13:00:00 +0100
categories: php symfony events
long_description: "If you've missed the SymfonyCon this year, and waiting for the video replays, here are my impressions!"
---

As every year, is beginning the SymfonyCon!

## We start this huge conference with Fabien Potencier's keynote.

So first question asked, what are your servers environment? The state is that every one of these are difficult to maintain and you want a fast and convenient develop and deploy.
When you are using your php built-in server there is only one connection at a time, no http2, no ssl, etc. Well a new symfony binary is now available. it's coming along with the `SymfonyCloud` platform offer and has no dependency (even php). It come with a lot of new shortcuts to test in a local environment. It uses now `php-fpm` when available otherwise `fastcgi` , `http2`, `http links/pre-load/push` and works with any php project. It's managing multiple versions of php, because usually you have multiple version on your computer.
It is fully integrated with symfony cloud. The expectations are, if you can manage to make your project work in your local environment, you should be able to make it running in you hosted environment without any other ops configuration.

Here are some console commands:

-   `symfony local:php:list` allows you to find what php you can use. If you want to change, just set a `.php-version` file in your project root directory containing the version you want to use. You can create a php.ini file on your project root directory if you want to specify some configuration only for your current project.
-   `symfony server:log` to tail your logs. they are parsed and converted into json. This way you can have something way cleaner on your console. If your project is using TLS (and if not it should) you should have it in your development environment.
-   `symfony ca:install` create for you a certificate for `localhost` / `127.0.0.1` / ..., register it in firefox for you. you'll be able to find them in `~/.symfony/certs`. So from now on you've got https in no time.
-   `symfony proxy:start` is meant to help you if you are running with specific domain names, subdomains names. it works with the next command.
-   `symfony proxy:domain:attach example.com --dir=/some/dir` by default it's supporting .wip tld. You can run with symfony run different commands in the server. Add -d and you have it in background.
-   `symfony env:create some-bug` opens a branch in local
-   `symfony open:remote` copy your production env in a new url.
-   `symfony log` allow you to check your logs and symfony debug allow you to switch in dev mode.
-   `symfony tunnel:open` allows you to work locally with your debug environment database freshly created.

## Tobias Nyholm is replacing Michelle Sanver to talk about graphs

Unfortunately we could not attends to Michelle’s talk about workflow in e-commerce websites. Anyhow, Tobyas has showed us once again the almighty power of graphs and that you can always think of a workflow for your actions. We can assist at an already seen but always nice to hear talk of how the workflow component works and how you can leverage its power in the best ways possible.
Definitely a component you should take a look at if you did not already.

## Next speaker I’ve seen is Samuel Roze with the Messenger Component

Samuel already did some talks about messenger in the past. The first one was 6 month ago.
What happened in 6 month? Well the real troubles start when your open source project is released and used in real projects, and mostly when it is used on any other project than yours. In 6 month new needs emerged and a lot of new possibilities were added in the meantime.
Ok, now, what is the Messenger component about? If you want to add some structure separation in your code. Let’s say cqs pattern or hexagonal pattern, you definitely need a way to let your differents domains to be able to speak to each other. But you don’t want to have any strong bounds between them.
Messenger is the king of component you would use.
whether you use a monolithic application or a micro-services based application does not matter. It has been designed to be used with differents services and even with some message queues (rabbitmq, kaf, etc).
I strongly encourage you to give it a try !

## The first speaker in the afternoon is Nicole Cordes and will present static php analyses tools.

If you want to improve drastically you code base, it’s quality, it’s maintainability and avoid some basics mistakes, there are some tools for you. Nicole is giving us a full tour. The first one is `PHPSTAN`. This tool is able to analyse your code and detect according to different levels of configuration the flaws in your code, starting from bad method or variable usages and declaration to bad architectural designs.
Second one is `PHPMD`. This one allows you to analyse you code structure and extract some measurements.
Third one is `Code Climate`, to grab for you the number of line of codes and it’s complexity, Although I would recommend using `PHP Metrics`, which is in my opinion more complete and is not a service. One cool thing of cool of code climate is that it has some integration with most of CI systems.
Next one is `SonarCloud`. If it happens that you already know `Sonar Cube` this one is the saas version. It allows you to find so flaws on your code complexity.
I would add myself some names to this, as for example `php-cs-fixer`, and `symfony security checker`.

## Jordy Borgiano is bringing to us his experience about servers availability.

Developers and technical teams usually don’t feel any side effect concerning latency or availability. Indeed you often work on private environment which is not reached by thousand of persons, because sometimes (usually?) theys uses servers in the same geographical region. Their customers in the other hand can be disappointed when it comes to crossing an ocean. The solution can be to scale up you architecture but you should do it with some minimal intelligence for instance you can start using a CDN which can serve your data from different regions.

### First iteration

the use of `Terraform` with `AWS` + `Redis sessions`. The architecture is simple one primary region which is used for write, and read were handled by replicas. But it was quite slow.

### Second Iteration

Came with the idea of proxying the write requests from the local replica to primary region
session forwarded in HTTP headers. Client IP forwarding using proxy headers in HTTPS and VPC peering for security. Of course with signed request/response. Finally a failover to replica processing if proxying fails.
Problem is the proxies had to create a new connexion every times. Which were slowing down the process, but creating connection pooling is a workaround. Downsides are that network sometime fail random requests, as well with `AWS ELB` which somehow times out on random requests. Session size is limited in headers, and if the primary is down, it only leaves you read-only capabilities.
With this solution you could achieve 99,5% availability with a TTFB of 120ms.
To achieve a 100% (is it possible?) you could think of having a multi master postgres/mysql network.

Nice to see some real use cases of multi-region architecture.

## Next topic is API Platform with Antoine Bluchet.

This time it’s not Kevin Dunglas talking about api-platform but Antoine, which is nice.
You might already know api-platform, maybe you even used it on a project. But here Antoine is demonstrating that you can leverage a lot of symfony component into api-platform. For instance the workflow component or the messenger component. With the help of symfony 4 and recipes, you have almost nothing to do. Everything is pre-configured, you only need to tweek the configuration to fit your needs. After seeing a demonstration of a pizza delivery system with these two component, the thing to have in mind is, do not get stuck only with a solution when you can combine them.

## It’s now time to talk about Webpack Encore

Ryan Weaver is the creator of `Encore`. This tool exist to combine the best of two worlds, meaning you can now use your favorite javascript framework with Symfony. The component let you define a webpack configuration in no time. Ryan gives us the best practices, such as make your css a dependency of your app. make each component independent and create one entry that is included in your layout per component. Definitely a great tool!

## Last talk I’ve seen is one from Kévin Dunglas about Mercure

Mercure is a protocol allowing to push data updates to web browsers and other HTTP clients leveraging the strength of http2, (which websocket can’t and won’t do), bringing to you a secure and fast multiplexed pub/sub system. Kévin did a demonstration through a application available at (symfonycon.les-tilleuls.coop)[symfonycon.les-tilleuls.coop] which is a joined-in clone where you can comment and rate talks during a conference and interact by pushing smiley buttons. These buttons would trigger an animation that you can see on every screen subscribed to the mercure hub. A tool to keep a eye on!


Feel free to contact me if you've got any question :)
See you on next conference!
