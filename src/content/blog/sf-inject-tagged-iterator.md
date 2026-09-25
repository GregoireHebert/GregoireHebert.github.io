---
title: "[Symfony] Inject a tagged iterator"
description: "Injecting a tagged iterator in a more natural way, without repeating the service definition in your configuration."
pubDatetime: 2022-03-24T22:30:00+01:00
author: "Grégoire Hébert"
ogImage: "/assets/sf-tagged-iterator/tags.jpg"
tags:
  - "symfony"
  - "php"
featured: true
---

## Context

If you happen to read the service tag mechanism in the Symfony documentation, you'll discover that any service can be defined along with a tag.

Service tags are a way to tell Symfony or other third-party bundles that your service should be registered in some special way. Take the following example:

``` yaml
# config/services.yaml
services:
    App\Twig\AppExtension:
        tags: ['twig.extension']
```

Services tagged with the `twig.extension` tag are collected during the initialization of TwigBundle and added to Twig as extensions.\
For most users, this is all you need to know. But you might need to create your own custom tags.\
If you enable autoconfigure, then some tags are automatically applied for you. That's true for the `twig.extension` tag: the container sees that your class extends AbstractExtension (or more accurately, that it implements `ExtensionInterface`) and adds the tag for you.\
If you want to apply tags automatically for your own services, use the `_instanceof` option:

``` yaml
# config/services.yaml
services:
    # this config only applies to the services created by this file
    _instanceof:
        # services whose classes are instances of CustomInterface will be tagged automatically
        App\Security\CustomInterface:
            tags: ['app.custom_tag']
    # ...
```

And for more advanced needs, you can define the automatic tags using the `registerForAutoconfiguration()` method.\
I'll let those of you that are discovering this feature the time to read the <a href="https://symfony.com/doc/current/service_container/tags.html" target="_blank">documentation</a>.\
Now, once a set of services are targeted with the said tag, how does one tend to use it?\
Usually it goes by a compiler pass, to ask the container for any service ids related to the tag. Then we iterate over each one to inject them as a future service thanks to the `Reference` class.

``` php
// example from the documentation
// src/DependencyInjection/Compiler/MailTransportPass.php
namespace App\DependencyInjection\Compiler;

use App\Mail\TransportChain;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class MailTransportPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        // always first check if the primary service is defined
        if (!$container->has(TransportChain::class)) {
            return;
        }

        $definition = $container->findDefinition(TransportChain::class);

        // find all service IDs with the app.mail_transport tag
        $taggedServices = $container->findTaggedServiceIds('app.mail_transport');

        foreach ($taggedServices as $id => $tags) {
            // add the transport service to the TransportChain service
            $definition->addMethodCall('addTransport', [new Reference($id)]);
        }
    }
}
```

So far, so good. Later Symfony introduced a simpler way to inject theses tagged services, so you don't have to write a compiler pass just for that.

In the following example, all services tagged with `app.handler` are passed as first constructor argument to the `App\HandlerCollection` service:

``` yaml
# example from the documentation
# config/services.yaml
    App\HandlerCollection:
        # inject all services tagged with app.handler as first argument
        arguments:
        - !tagged_iterator app.handler
```

Which is nice, but necessitate to add few lines of configuration.

Recently, PHP 8 came with a great deal of features. One of them is <a href="https://www.php.net/manual/fr/language.attributes.overview.php" target="_blank">the attributes</a>.

In Symfony 5.3, thanks to this PHP feature, a more explicit way to express this injection (<a href="https://symfony.com/blog/new-in-symfony-5-3-service-autowiring-with-attributes" target="_blank">read the article</a>) is born by using an attribute inside your constructor, right before the iterable type:

``` php
// example from the documentation
// src/Handler/HandlerCollection.php
namespace App\Handler;

use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;

class HandlerCollection
{
    private $handlers;

    public function __construct(
        #[TaggedIterator('app.handler')] iterable $handlers
    ) {
        $this->handlers = $handlers;
    }
}
```

In the same blog article, Nicolas Grekas introduced a way of selecting autowired aliases with the attributes, using named arguments.\
In the documentation, the example uses the http/client component.\
For example, consider the following scoped HTTP client created to work with GitHub API:

``` yaml
# example from the documentation
# config/packages/framework.yaml
framework:
    http_client:
        scoped_clients:
            githubApi:
                scope: 'https://api\.github\.com'
                headers:
                    Accept: 'application/vnd.github.v3+json'
                    # ...
```

If you want to inject this scoped HTTP client in a service, it's not enough to type-hint the constructor argument with HttpClientInterface. You must use the interface as the type-hint and the autowiring alias (githubApi) as the variable name.

``` php
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GitHubDownloader
{
    private $githubApi;

    public function __construct(HttpClientInterface $githubApi)
    {
        $this->githubApi = $githubApi;
    }

    // ...
}
```

Then the blog continues with the `Target` attribute to change the variable name, but it's not important for this blog post.

## It bothers me...

The thing is, I've never been that much of a fan, having an attribute within my constructor argument declaration. (Taste and colours...)\
And recently during a coaching session, while explaining this very mechanism, a question pops as an evidence:\
Why can't we have an iterable class containing the tagged services, and inject it with an alias for argument?\
I... love the idea! I find it elegant and simple.

Let's try to implement it!

## A solution

I create the class I'll receive in my chain service. The class will contain every services related to the tag I ask for.

``` php
// App\DependencyInjection\TaggedServicesInterface.php

namespace App\DependencyInjection;

interface TaggedServicesInterface
{
}
```

``` php
// App\DependencyInjection\InjectableTaggedServices.php

namespace App\DependencyInjection;

class InjectableTaggedServices extends \ArrayIterator implements TaggedServicesInterface
{
}
```

Now the logic to make things happen.

``` php
// App\DependencyInjection\TaggedServiceInjectorPass.php

namespace App\DependencyInjection;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter;

class TaggedServiceInjectorPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        $tags = $container->findTags();
        $converter = new CamelCaseToSnakeCaseNameConverter();

        // loop over every declared tags,
        foreach ($tags as $tag) {
            // for the example I chose as convention to store every tagged services, whose tag starts with app.
            if (!str_starts_with($tag, 'app.')) {
                continue;
            }

            // The app.my.tag tag would expect the argument in the constructor to be named $appMyTagServices
            $name = $converter->denormalize(str_replace('.', '_', $tag)).'Services';

            // Prepare the services references
            $taggedServices = array_map(fn($serviceId) => new Reference($serviceId), array_keys($container->findTaggedServiceIds($tag)));

            // Creating a new service and injects the tagged services references
            $container->register($name, InjectableTaggedServices::class)->setArguments([$taggedServices]);

            // Signal symfony to inject the previously created service when encountering an argument with the TaggedServicesInterface and the computed name.
            $container->registerAliasForArgument($name, TaggedServicesInterface::class);
        }
    }
}
```

We need to register this compiler pass:

``` php
// App\Kernel.php

namespace App;

use App\DependencyInjection\TaggedServiceInjectorPass;
use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    protected function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new TaggedServiceInjectorPass());
    }
}
```

Let's imagine a set of services to inject into a chain service:

``` php
// App\MyTaggedServices\FutureTaggedInterface.php

namespace App\MyTaggedServices;

interface FutureTaggedInterface
{
}
```

``` php
// App\MyTaggedServices\FutureTaggedServiceA.php

namespace App\MyTaggedServices;

class FutureTaggedServiceA implements FutureTaggedInterface
{
}
```

``` php
// App\MyTaggedServices\FutureTaggedServiceB.php

namespace App\MyTaggedServices;

class FutureTaggedServiceB implements FutureTaggedInterface
{
}
```

``` php
// App\MyTaggedServices\ChainService.php

namespace App\MyTaggedServices;

use App\DependencyInjection\TaggedServicesInterface;

class ChainService
{
    // Instead of using the attribute, now just this interface plus the named argument does the same job.
    public function __construct(private TaggedServicesInterface $appMyTagServices)
    {
    }

    public function doStuff()
    {
        foreach ($this->appMyTagServices as $service) {
            var_dump($service::class);
        }
    }
}
```

Let's add the tag configuration:

``` yaml
# config/services.yaml
_instanceof:
    App\MyTaggedServices\FutureTaggedInterface:
        tags: ['app.my.tag']
```

And maybe use it in a controller, why not.

``` php
// App\Controller\AnyController.php
namespace App\Controller;

use App\MyTaggedServices\ChainService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AnyController extends AbstractController
{
    public function __construct(private ChainService $chainService)
    {
    }

    #[Route(path: '/', name: 'home')]
    public function index(): Response
    {
        $this->chainService->doStuff();

        return new Response('ok');
    }
}
```

## Bonus

Need more ?

This mechanism works well, but having to use some specific variable names is too rigid for some developers. In Symfony 5.3 you can use any variable name because they introduced a `#[Target]` attribute to select the autowiring alias.

``` php
// App\MyTaggedServices\ChainService.php

namespace App\MyTaggedServices;

use App\DependencyInjection\TaggedServicesInterface;
use Symfony\Component\DependencyInjection\Attribute\Target;

class ChainService
{
    public function __construct(#[Target('appMyTagServices')] private TaggedServicesInterface $services)
    {
    }

    public function doStuff()
    {
        foreach ($this->services as $service) {
            var_dump($service::class); // here are your services :)
        }
    }
}
```

And now, I like you a bit less, since you've reintroduced an attribute 😭

You can find the code <a href="https://github.com/GregoireHebert/sf-tagged-iteraror-injection/commit/12ca3a763ec71640eb319e63317662c883925733" target="_blank">here</a>.

Convinced? Or pass?

Would you like to see this in Symfony? Well you won't.

## Because there is a catch.

If you stop there, like I could have, you could have made a mistake.\
See, this approach is only good within a Symfony Bundle, and nowhere else. Why?\
Because the notion of Tagged Iterator is tied with the symfony framework. In your business code, you always want to avoid any coupling with any framework at all! And with this solution, you find yourself with a code expecting an interface coming from a framework specific feature.\
It won't work on Laravel, because there is no such thing as Tagged Iterator there.

Another downside to consider, is that a Tagged Iterator, when injected through the attribute, is a `\Generator`.\
Which means, that the services injected are loaded lazily.\
It has a non-negligible impact on performance according to what your services are doing.

So, as much as I not a fan of having attributes in the middle of a constructor arguments, I'll admit that it's technically a better solution over the one appearing more natural to me.

And I know all this thanks to <a href="https://github.com/chalasr" target="_blank">Robin Chalas</a>'s perspective.\
If there is something to take from this, is that, no matter how experienced you are, an idea is never good on its own before you've battle tested it with other people.\
An idea, might be a good idea, but not in every situation. Every week there is a moment where I learn, and get better at my work by sharing ideas and thought with my colleagues :) Even bad ones (especially bad ones)\
By others, I mean coworkers, fresh years, old timers in the field, well known OSS community fellows, pick any.\
Anyway, let's have more ideas, try them, fail, and do it again until a great idea comes up ^^.

Thanks for reading me 😃
