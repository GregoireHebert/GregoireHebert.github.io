---
title: "A prime constant"
description: "A prime constant has been calculated to generate a suite of prime numbers. Does it hold up?"
pubDatetime: 2020-11-28T09:30:00+01:00
lang: "en"
author: "Grégoire Hébert"
ogImage: "/assets/blog/a-prime-constant.png"
tags:
  - "mathématiques"
---

A new constant `2.920050977316...` has been calculated to find the exact serie that represent the known prime numbers.\
<a href="https://www.tandfonline.com/doi/abs/10.1080/00029890.2019.1530554" target="_blank">https://www.tandfonline.com/doi/abs/10.1080/00029890.2019.1530554</a>\
Before this constant in a language such as PHP here, you would have to execute a pair of loops.

```

        $number = 2 ; // first prime.
        while ($number < 100 )
        {
            $count=0;
            for ($i=1;$i<=$number;$i++) {
                if (($number%$i)==0) {
                    $count++;
                }
            }

            if ($count<3) {
                echo "$number, ";
            }

            $number=$number+1;
        }

```

```
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
```

Or with a mathematical extension

```

        $prime = 2;
        do {
            echo "$prime, ";
            $prime = gmp_nextprime($prime);
        } while ($prime<100);

```

```
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
```

This time, PHP uses the Miller-Rabin method. This method is capable to determine if a number is composite, probably prime, or is a prime.\
They discovered that a composite number is linked to a certain number of "witness numbers" https://en.wikipedia.org/wiki/Witness\_(mathematics)\
If the comparison shows a high number of them, the our number is not a prime.\
And again, here, the complexity of the algorithm is $O(k log3n)$, where `n` is the number of iterations.\
Add this to our do_while loop, and in the long run, it's not that efficient either to print a suite.\
The quickest being of course, picking the numbers of a table.

For a defined space, you would also use the `sieve of Eratosthenes` method, to eliminate the non prime numbers.

As for the constants.\
There is the Mill's constant A = `1.30637788386...` in the formula ${A^3}^n$ it gives you prime numbers, but with gaps. Big gaps.\
2, 11, 1 361, 2 521 008 887, etc.

This new constant on the other hand, does not miss any of our known primes, in ascending order.\
It has been calculated from our known primes so obviously, it won't cover primes we don't know about yet.\
You can learn of the mathematics behind on numberphile Youtube channel [](https://www.youtube.com/watch?v=_gCKX6VMvmU)

In the meantime, the constant works with this simple formula. Take the first prime number (which is 2)\
or the previous found number, then round it down (the floor function), multiplied by the previous number, subtracting the integer part to keep only the decimal part plus 1.\
$fn+1 = \lfloor fn \rfloor \times (fn- \lfloor fn \rfloor + 1)$

``` php
        const BUENOS_AIRES_CONSTANT = 2.920050977316134712092562917112019;
        $prime = BUENOS_AIRES_CONSTANT;
        do {
            $prime = floor($prime)*(($prime-floor($prime))+1);
            echo sprintf('%d, ', floor($prime));
        } while ($prime<100);
```

But it's too good to be true, at least in PHP\
where you can't store even a 33 decimal part of an infinite constant, without losing data.

```

        const BUENOS_AIRES_CONSTANT = 2.920050977316134712092562917112019;
        echo number_format(BUENOS_AIRES_CONSTANT, 33)."\n\n";

```

```
2.920050977316134499517374933930114
```

You'll probably need to create a pull request in PHP source code to use this new constant :)\
Or by using FFI.

Thanks for reading !
