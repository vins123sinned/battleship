# battleship

Battleship game developed with Test Driven Development (TDD)

Test Driven Development is a *big* thing in the web development world and I am here to test it out (no pun intended!). There are a lot of benefits to TDD ranging from lowering your bugs, making your code much more readable, helping you to think before creating, increasing your code's test coverage, and much, much more. Test driven development is very hot right now, and in order to reap the same benefits this project is designed to help me get a jumpstart on writing code with it and seeing the benefits for myself. There is reason why "seeing is believing" is a proverb after all.

Battleship is a classic guessing game worldwide, where two players are each given their own gameboards and ships to place. By guessing coordinates on where to attack, players try to destroy all of their enemies ship in order to win the game. This is personally a game that I grew up with and is one that I have played many times throughout my life. I'll call it Naval Warfare™ and it will essentially be a ripoff minimalistic battleship game. Enjoy!

This website's design is greatly inspired by [battleship.org's](http://en.battleship-game.org/) battleship game and I highly recommend that you check it out whether it's your first time playing battleship or for old time's sake. It allows you to play against other players and while it might seem barebones, it serves the purpose of letting players around the world play battleship perfectly.

For more information, see the [battleship wikipedia page](<https://en.wikipedia.org/wiki/Battleship_(game)>) or the [project specifications](https://www.theodinproject.com/lessons/node-path-javascript-battleship) on The Odin Project.

![Screenshot_2025-05-08_10-44-15](https://github.com/user-attachments/assets/4ec36229-1a20-4bfe-b2ee-975d34f50d05)

## Features
While the site itself is minimalistic, the real star in the show is the ***logic*** that makes the battleship game runs correctly. With logic being a major part of the project, it creates the perfect opportunity to practice TDD here with all the features that battleship has, including:

* Gameboard that shows the current board status of a specific player
* Differentiation between hit and missed attacks
* Player or computer mode
* Dragging and dropping ships
* Clicking on ship to switch directions
* Randomizing ship button
* Ending turn and passing screen on two player mode
* Gameover and new game functionality
* Smart computer AI
* Clean and intuitive DOM interactions
* Rounded ships (I cut corners, but not ***that*** corner!)
* And much more!

## Lessons Learned
After completing this project (which took me much longer than I wanted), there are three main lessons that I've learned along the way. All of these lessons were amazing learning opportunities that not only led to some revelations about my coding style but also some deep insights into who I am personally. While the last statement might be a bit of a stretch, I've found that completing this project and encountering the many obstacles on the way really did help me learn and grow as a programmer (or coder... whichever you want). As with everything in life it might suck doing something you're uncomfortable with in the moment but you won't ever regret the experience that you've gained looking back after the trial is over. Without further ado these are the three lessons I've learned completing the project:

### Think Before You Do
I know I know, this is a saying that even I have been preaching for a while. However the difference between then and now is that TDD actually ***showed*** me the importance of thinking about your code before actually implementing it in your project. The nature of TDD is that you have to write your tests before writing your code which naturally makes you stop and think before jumping straight into your code. I always had a sense of why it was so important to plan out your code beforehand, but I always eventually slacked off so I can do the more exciting part of writing code. TDD prevents this as you **need** to write your test before writing the code that a specific feature needs. What that did for me was how my code suddenly became a lot more clean, readable, and less buggy. I've noticeably reduced my time in debugging and the biggest part in that was thanks to thinking about the structure and nature of my code before implementing it to my project.

### Divide and Conquer
While TDD reduced my time in the debugger bugs were still bound to occur. My problem here was instead **how** I went on fixing my bugs. I've always jumped first into my code and tried to debug it by trial and error. This worked for the most part since my previous projects were less complex and easier in nature. However, when it came to this code and future projects I came to a daunting realization: **You can't just fix bugs by trial and error anymore**. It was obvious from the beginning as the first bugs I've found took over an hour each to find and fix the root of the problem. This easily turned into over a day for more complex and interconnected bugs. Every single trial and error ended up at a dead end until I tried something else; I decided to divide and conquer just like when I split down my battleship into manageable chunks. Suddenly it all clicked together and fixes to my bugs were pouring in from everywhere, taking just a fraction of the time compared to my old ways of trial and error. At the end of the day, I know my projects will only become more ambitious and complex, so coding purely on instinct is no longer sustainable. Instead, I'll focus on doing things the right way—by breaking problems down into manageable chunks and building from there.

### Take Breaks
This final lesson not only pertains to coding but also to every single thing in your life. Taking breaks is just as important to us as sleeping, eating, walking, and much more. I personally found that my productivity and progress came to a screeching halt after I stay on my computer for too long. This problem was especially prominent when I wanted to finish a feature before the end of the day, although usually nothing ended being done before I called it quits. On the other hand, when I take 30 minutes break for every 1 hour that I'm coding I find my productivity actually increases. This didn't seem to make sense for me at first but this was also the case when I started to exercise or study other things. From now on, I will take more care of my body by taking breaks every now and then which helps both my personal well-being and my coding progress at the same time!
