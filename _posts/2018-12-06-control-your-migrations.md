---
layout: post
title:  "Control your migrations"
date:   2018-06-12 11:00:00 +0100
categories: php, symfony, doctrine, migrations
long_description: "Do you really think you handle doctrine migrations properly?"
---

It's been a while that I am using doctrine now.
And the first you learn after how the ORM itself works, is that you should never use the command `doctrine:database:update` in production.
This not a coincidence if this command must be executed with a `--force` flag.
So as I did before, you start digging and find a nice tool attached to the doctrine ecosystem.

The Doctrine Migrations bundle.

Ok so you open the github page of this project and see this little abstract:

{% highlight text %}
Database migrations help you version the changes in your database schema and apply them in a predictable way on every server running the application.
{% endhighlight %}

This is perfect, I have now a way to update in a better way my schemas!
So I click on the documentation link that directly leads into symfony's website and It shows how I can put this it in place into my project.
Then I opened the project documentation to find use cases.

And I find this:

{% highlight php %}
public function up(Schema $schema) : void
{
    $users = [
        ['name' => 'mike', 'id' => 1],
        ['name' => 'jwage', 'id' => 2],
        ['name' => 'ocramius', 'id' => 3],
    ];

    foreach ($users as $user) {
        $this->addSql('UPDATE user SET happy = true WHERE name = :name AND id = :id', $user);
    }
}
{% endhighlight %}

But... There is no schema update at all!
This is data update. At first, I found it convenient and I tend to over use it. I wasn't so concerned about it, and few month ago it hit me.
You see, every time you need to update you schema, you use a migration. a new set of data or updating a set of data, you use a migration.
It's been 6 month since your project has started, and you now have like 80 files of migrations.
Maybe you were thoughtful and splitt your files into subdirectories but still, this is a lot of dead code you've got here. You probably won't use them ever again.
And even if you need thelm, it's a lot of files to open, parse, and each time a new set of queries to execute separately.

So, why not, after a release, remove them all just to keep one that could summarize them all?
Then you'd have a single file to open and a single set of queries to execute.
Fortunately someone had [the idea before me](https://github.com/doctrine/migrations/issues/662) and proposed a rollup command.
If you look at the different discussions around this feature, you'd see some comments like:

{% highlight text %}
I think that it's impossible to guarantee that an automatic process like that wouldn't loose data.
From what you describe, to me the only solution is to generate those migrations manually.
{% endhighlight %}

{% highlight text %}
Well if it's only for the schema, it looks like a hard feature to provide and it would probably be easier to do it by hand.
{% endhighlight %}

and from Stof:

{% highlight text %}
Well, there is a way to generate such migrations: get a database which is at version 1, and then run the diff command. This will give you the schema migration from v1 to v2, and it is much simpler than trying to parse old migrations to infer the old schema to build the migration.
Btw, be careful that a real migration involves migration data too, and you would have to redo all the work there in your big migration. [...]
{% endhighlight %}

Exactly! What happens to my data changes? It cannot reliably just copy and paste my code nor guess what changes I wanted to apply without risks!
Unless my migrations files only contains schema updates.

Unfortunately, this, is not possible.
You cannot, because the configuration of doctrine-migration if it does allow multiple directories, will always try to use them all.
and during the rollup, remove them all.

So the idea, is to add a new configuration to separate the two.
Then you could have migrations for your schema and migrations for your data.
Let me bring this to you :)

[gheb/data-migrations-bundle](https://github.com/GregoireHebert/data-migrations-bundle)

This bundle has exactly the same behaviour than the doctrine migration bundle.
The same configuration and the same commands. So the best part is, you already know how to use it!
It is following the exact same tags than doctrine-migrations-bundle so you already know which one you can use on your project.

So from now on, I strongly encourage you to split your migrations.

Next step?
would you like to have this directly inside your doctrine-migrations-bundle ?
