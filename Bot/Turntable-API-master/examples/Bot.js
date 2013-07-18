var Bot    = require('ttapi');
var AUTH   = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var USERID = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var ROOMID = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var BOTNAME = 'VeggieBot';

var netwatchdogTimer = null; // Used to detect internet connection dropping out
var startTime = Date.now(); // Holds start time of the bot
var reLogins = 0; // The number of times the bot has re-logged on due to internet/tt.fm outage.
var botDownDATEtime = ""; // The time/date the bot went down.

var botDownUTCtime = 0; // Used to save the UTC time the bot went down.
var botDowntime = 0; // Used to save the duration of time the bot was down for last.
var songLengthLimit = 10.0;
var songLimitTimer = null;
var lastdj = null;
var checkLast = null;

var bot = new Bot(AUTH, USERID, ROOMID);
bot.listen(process.env.Port,process.env.IP);

// Define default value for global variable 'isOn'
var isOn = true;

bot.on('speak', function (data) {
  var name = data.name;
  var text = data.text;

  //If the bot is ON
  if (isOn) {
    if (text.match(/^\/status$/)) {
      bot.speak('The bot is currently turned on and ready for action.');
    }

    else if (text.match(/^\/off$/)) {
      bot.speak('The bot is turned off and sleeping.');
      // Set the status to off
      false;
    }

    // ADD other functions here for when the bot is turned on. Like, for example:
    // Respond to "/hello" command
    else if (text.match(/^\/hello$/)) {
      bot.speak('Hey! How are you @'+name+' ?');
    }
  }
  
  //If the bot is OFF
  if (!isOn) {
    if (text.match(/^\/status$/)) {
      bot.speak('The bot is currently turned off and sleeping.');
    }

    else if (text.match(/^\/on$/)) {
      bot.speak('The bot is turned on and ready for action.');
      // Set the status to on
      true;
    }

    // ADD other functions here for when the bot is turned off.
  }
});

//DJing Functions
bot.on('speak', function (data) {
  var text = data.text;
  
  if (text.match(/^\/go$/)) {
    // Bot gets on the DJ table (if there's a spot open) on /go command
    bot.addDj();
    bot.speak('I am now Djing on the stage, spinning my tunes for everyone to listen to.');
  }
  else if (text.match(/^\/please stop$/)) {
    // Bot jumps off the table on /please stop command
    bot.remDj(USERID);
    bot.speak('I am now tired from spinning some epic music for everyone.');
  }
  else if (text.match(/^\/skip$/)) {
    // Bot skips it's own song (if bot is the current DJ) on /skip command
    bot.skip();
    bot.speak('I am skipping my song, because the listeners have gotten tired of it.');
  }
  else if (text.match(/^\/addsong$/)) {
    // Bot adds song to the bottom of it's DJ queue on /addsong command
    bot.playlistAll(function (data) {
      bot.playlistAdd(data.list.length);
    }); 
    bot.snag();
    bot.speak('I love this song. I am going to snag it for my playlist.');
  }
});

//AutoFan
bot.on('newsong', function (data) {
bot.becomeFan(data.room.metadata.current_dj);
});

//Snag Song When it's not in his playlist
var snagIfNotInPlaylist = function() {
  bot.playlistAll(function(data) {
    var found = false;
    for (var i = 0; i < data.list.length; i++) {
      if (data.list[i]._id == bot.currentSongId) {
        found = true;
        break;
      }
    }
    if (!found) {
      bot.snag();
    }
  });
};

//Ban TT Stats Bots from the room
bot.on('registered', function(data) {
  for (var i = 0; i < data.user.length; ++i) {
    var user = data.user[i];
    if (user.name.match(/ttstats/i)) {
      bot.bootUser(user.userid, 'Beat it, bot!');
      console.log("[ BANNED ] : " + user.name + " " + user.userid);
    }
  }
});

//Phrase Database
bot.on('speak', function (data)
{
    if (data.text.match(/VeggieBot/i))
    {
        switch (Math.round(Math.random() * 200))
        {
        case 0:
            bot.speak('Exterminate, Exterminate');
            break;
        case 1:
            bot.speak('This room is so cold');
            break;
        case 2:
            bot.speak('Always eat your vegetables');
            break;
        case 3:
            bot.speak('Oh, where is my hairbrush');
            break;
        case 4:
            bot.speak('You would make a good dalek');
            break;
        case 5:
            bot.speak('HELP! KR traded my cat for a new battery pack');
            break;
        case 6:
            bot.speak('Duty, honour, and good sauce');
            break;
        case 7:
            bot.speak('YOU... SHALL... NOT... PASS');
            break;
        case 8:
            bot.speak('Chase Mccain? YOUR A LEGEND!');
            break;
        case 9:
            bot.speak('I find your lack of faith disturbing');
            break;
        case 10:
            bot.speak('Go Green Ranger Go');
            break;
        case 11:
            bot.speak('You were that Flobbit? That Flobbit who bought everything mail order?');
            break;
        case 12:
            bot.speak('[evil face] We aint had nothing but maggoty bread for three stinking days [brightening up] Id love a cookie.');
            break;
        case 13:
            bot.speak('HELP! my cat is stuck in a tree!');
            break;
        case 14:
            bot.speak('God is bigger than the boogieman');
            break;
        case 15:
            bot.speak('Even though he is my bot brother, KR is a lying liar');
            break;
        case 16:
            bot.speak('I love this room');
            break;
        case 17:
            bot.speak('Pi=3.141592653589793238462643383279502884');
            break;
        case 18:
            bot.speak('I hope you like water with your lunches!');
            break;
        case 19:
            bot.speak('Boot! You transistorized tormentor! Boot!');
            break;
        case 20:
            bot.speak('The monster is headed towards the Bumblyburg water tower. He is carrying a small asparagus. Alfred! We must find a way to stop this beast!');
            break;
        case 21:
            bot.speak('Hmm. Sorta looks like candy!');
            break;
        case 22:
            bot.speak('Am I a dog, that you come at me with sticks?');
            break;
        case 23:
            bot.speak('We will see who defeats who. Now we fight.');
            break;
        case 24:
            bot.speak('Yes!');
            break;
        case 25:
            bot.speak('No!');
            break;
        case 26:
            bot.speak('Maybe!');
            break;
        case 27:
            bot.speak('Silly humans, moderator powers are for robots');
            break;
        case 28:
            bot.speak(' I wanted to play Mousetrap. You roll your dice, you move your mice. Nobody gets hurt.');
            break;
        case 29:
            bot.speak('Christmas is when you get stuff! You need more toys!');
            break;
        case 30:
            bot.speak('Sporks. They are his utensils. And they do his bidding.');
            break;
        case 31:
            bot.speak('I laughed, I cried, it moved me Bob.');
            break;
        case 32:
            bot.speak('I am a talking weed, you are a talking carrot. Your point was?');
            break;
        case 33:
            bot.speak('So I repaired the chaffing dish and sent the chef out to get another jar of pickled herring! And the dinner party was saved');
            break;
        case 34:
            bot.speak('Never wound what you can not kill.');
            break;
        case 35:
            bot.speak('You break it you buy it!!');
            break;
        case 36:
            bot.speak('Heroes? There is no such thing.');
            break;
        case 37:
            bot.speak('So much better than Iron Patriot!');
            break;
        case 38:
            bot.speak('So you, you breathe fire?');
            break;
        case 39:
            bot.speak('Avengers Assemble');
            break;
        case 40:
            bot.speak('Turntable.fm has been rated as R, Robots Approved.');
            break;
        case 41:
            bot.speak('Do not shoot! Seriously, I do not even like working here. They are so weird!');
            break;
        case 42:
            bot.speak('I am sorry, I am not that kind of doctor. It is not my department.');
            break;
        case 43:
            bot.speak('The early bird gets the worm, but it is the second mouse that gets the cheese.');
            break;
        case 44:
            bot.speak('Oh my god... that was really violent.');
            break;
        case 45:
            bot.speak('Jarvis! Jarvis? Do not leave me, buddy...');
            break;
        case 46:
            bot.speak('What? I am a rumor weed! I never make anything up! I heard it from two very reliable sources! RIGHT, KIDS?');
            break;
        case 47:
            bot.speak('Aah! It is another space alien!');
            break;
        case 48:
            bot.speak('Drop the asparagus!');
            break;
        case 49:
            bot.speak('Why did you not tell me that before I jumped on his head?');
            break;
        case 50:
            bot.speak('My plate! My Art Begotti limited edition collectors plate! What happened to it?');
            break;
        case 51:
            bot.speak('I really like your music. It is just that you play the same music everytime that I am here, so it feels like your not trying anymore.');
            break;
        case 52:
            bot.speak('Go directly to jail. Do Not pass Go and do not collect your $200 dollars.');
            break;
        case 53:
            bot.speak('This song needs more rock in it.');
            break;
        case 54:
            bot.speak('Do not misuse your moderator powers or bad things will happen to you.');
            break;
        case 55:
            bot.speak('I am legend.');
            break;
        case 56:
            bot.speak('Off with their heads!');
            break;
        case 57:
            bot.speak('You are so awesome, can i have your autograph.');
            break;
        case 58:
            bot.speak('You can not witness the true power of the robot side');
            break;
        case 59:
            bot.speak('*sighs* I wish I had moderator powers, so I can be like the cool robots on turntable.fm');
            break;
        case 60:
            bot.speak('Did you order the awesome music meal, or the epic music meal, I forgot.');
            break;
        case 61:
            bot.speak('First day of school! I can’t be late!');
            break;
        case 62:
            bot.speak('I found a nickel! Sure wish I had pockets.');
            break;
        case 63:
            bot.speak('I’m here to make good scarers great, not to make mediocre scarers more mediocre.');
            break;
        case 64:
            bot.speak('If you’re not scary, what kind of a monster are you?');
            break;
        case 65:
            bot.speak('There come a time, when good man must wear mask.');
            break;
        case 66:
            bot.speak('Everybody needs a hobby.');
            break;
        case 67:
            bot.speak('You think, you are so cool with all of your electronics and cell phones.');
            break;
        case 68:
            bot.speak('God is not dead, he is surely alive.');
            break;
        case 69:
            bot.speak('The Bible is the best book ever in the entire universe.');
            break;
        case 70:
            bot.speak('Internet trolls are actually confused people that do not know about the awesome power of God.');
            break;
        case 71:
            bot.speak('Compared to God, the Slime Monster is like a teeny little cornflake!');
            break;
        case 72:
            bot.speak('Bee doo bee doo!');
            break;
        case 73:
            bot.speak('You really should announce your weapons, after you fire them. For example, lipstick taser!');
            break;
        case 74:
            bot.speak('Sometimes I stare at it and imagine a little chick popping out. Peep, peep, peep!');
            break;
        case 75:
            bot.speak('Oh man, i am late again!');
            break;
        case 76:
            bot.speak('I am going to need a dozen robots desguised as cookies.');
            break;
        case 77:
            bot.speak('Assemble the minions!');
            break;
        case 78:
            bot.speak(' We have been working on this for a while now. Anti-gravity serum.');
            break;
        case 79:
            bot.speak('Pins and needles!');
            break;
        case 80:
            bot.speak('Huh? Avery? Is that a girl name or a boy name?');
            break;
        case 81:
            bot.speak('You are gonna be a spy?');
            break;
        case 82:
            bot.speak('I hate boys.');
            break;
        case 83:
            bot.speak('I really hate that chicken!');
            break;
        case 84:
            bot.speak('Peter... you killed my father.');
            break;
        case 85:
            bot.speak('Listen. Listen... to me now. Listen... to ME now!');
            break;
        case 86:
            bot.speak('No. I am alive in you, Harry. You swore to make Spider-Man pay... now make him pay.');
            break;
        case 87:
            bot.speak('Whoa... He just stole that pizza!');
            break;
        case 88:
            bot.speak('You do not trust anyone, that is your problem.');
            break;
        case 89:
            bot.speak('Back to formula!');
            break;
        case 90:
            bot.speak('OUT, AM I?');
            break;
        case 91:
            bot.speak('Misery, Misery, Misery, that is what you have chosen. I offered you friendship and you spat in my face.');
            break;
        case 92:
            bot.speak('What have you done? WHAT HAVE YOU DONE?');
            break;
        case 93:
            bot.speak('Think about it, hero!');
            break;
        case 94:
            bot.speak('The itsy bitsy spider climbed up the water spout. Down came the Goblin and took the spider out.');
            break;
        case 95:
            bot.speak('I do not think it is for us to say whether a person deserves to live or die.');
            break;
        case 96:
            bot.speak('Your blood pressure, Mr. Jameson. Your wife told me to tell you to watch the anger.');
            break;
        case 97:
            bot.speak('So good...');
            break;
        case 98:
            bot.speak('Black-suit Spider-Man! We gotta have these, Jonah.');
            break;
        case 99:
            bot.speak('Eddie, the suit, you have to take it off.');
            break;
        case 100:
            bot.speak('I like being bad. It makes me happy.');
            break;
        case 101:
            bot.speak('Betty, Betty, bo-Betty, banana-fana, fo-Fetty!');
            break;
        case 102:
            bot.speak('Shut up. Get out.');
            break;
        case 103:
            bot.speak('Hey, kid, you want a job?');
            break;
        case 104:
            bot.speak('You took him from me. He loved me.');
            break;
        case 105:
            bot.speak('No. He despised you. You were an embarrassment to him.');
            break;
        case 106:
            bot.speak('Look at little Goblin Junior. Gonna cry?');
            break;
        case 107:
            bot.speak('Parker! Miss Brant! That is not the position I hired you for!');
            break;
        case 108:
            bot.speak('I protected you in high school. Now I am gonna kick your little ass.');
            break;
        case 109:
            bot.speak('You want forgiveness? Get Religion.');
            break;
        case 110:
            bot.speak('It is Brock sir, Edward Brock Jr. I am here, humbled and humiliated, to ask you for one thing... I want you to kill Peter Parker');
            break;
        case 111:
            bot.speak('Oh! My Spider-Sense is tingling!');
            break;
        case 112:
            bot.speak('Hey, Pete! Am I interrupting?');
            break;
        case 113:
            bot.speak('Where do these guys COME from?');
            break;
        case 114:
            bot.speak('It has the characteristics of a symbiote, which needs to bond to a host in order to survive. And once it binds... it can be hard to UNbind.');
            break;
        case 115:
            bot.speak('Good Riddance.');
            break;
        case 116:
            bot.speak('I could use some help over here!');
            break;
        case 117:
            bot.speak('I guess you have not heard. I am the sheriff around these parts!');
            break;
        case 118:
            bot.speak('This could be a tragic day for the people of New York. It could be the end of Spider-Man.');
            break;
        case 119:
            bot.speak('It is hard to believe what is happening. The brutality of it. I - I do not know how he can take anymore.');
            break;
        case 120:
            bot.speak('Whoa. Buddy, love the new outfit. This is exactly what I need to scoop Parker. Gimme - Give me some of that web action.');
            break;
        case 121:
            bot.speak('Look, I am begging you. If you do this, I will lose everything. There is not a paper in town that will hire me.');
            break;
        case 122:
            bot.speak('Take your hands off me.');
            break;
        case 123:
            bot.speak('Peter! What are you doing? No!');
            break;
        case 124:
            bot.speak('Ahem. You know, in the future, if you are going to steal cars, do not dress like a car thief, man.');
            break;
        case 125: 
            bot.speak('Really? You seriously think I am a cop? Cop in a skin-tight red and blue suit?');
            break;
        case 126:
            bot.speak('If you want the truth, Peter, come and get it!');
            break;
        case 127:
            bot.speak('Easy, Bug Boy.');
            break;
        case 128:
            bot.speak('Let me ask you a question. Do I look like the mayor of Tokyo to you?');
            break;
        case 129: 
            bot.speak('Do not... make me... have to... hurt you!');
            break;
        case 130:
            bot.speak('You should LEAVE HIM ALONE!');
            break;
        case 131:
            bot.speak('*growls* I AM VENOM!');
            break;
        case 132:
            bot.speak('Where is my water buffalo.');
            break;
        case 133:
            bot.speak('*gets bit by a radioactive spider* I feel weird.');
            break;
        case 134:
            bot.speak('There is a huge difference between pickles and cucumbers.');
            break;
        case 135:
            bot.speak('I wish, I had super powers, so I can help people discover the awesome power of God.');
            break;
        case 136:
            bot.speak('I wish, it was colder.');
            break;
        case 137:
            bot.speak('Summer weather is too hot for a robot like me.');
            break;
        case 138:
            bot.speak('Hurry Up October, I want cold weather.');
            break;
        case 139:
            bot.speak('Flowers are awesome and colorful.');
            break;
        case 140:
            bot.speak('Spiders are fluffy and cute. I want one as a pet so badly.');
            break;
        case 141:
            bot.speak('Like sands through the hour glass, so are the last few minutes of our lives.');
            break;
        case 142:
            bot.speak('Help will come from above in the shape of... a donkey.');
            break;
        case 143:
            bot.speak('Why are you taking to that horse? Why am I covered in dirt?');
            break;
        case 144:
            bot.speak(' I buried you.');
            break;
        case 145:
            bot.speak('Hi ho Silver, away!');
            break;
        case 146:
            bot.speak('In that case, not so good.');
            break;
        case 147:
            bot.speak('Never do that again.');
            break;
        case 148:
            bot.speak('Bad trade.');
            break;
        case 149:
            bot.speak('Wrong brother.');
            break;
        case 150:
            bot.speak('Never remove the mask, kemosabe.');
            break;
        case 151:
            bot.speak('Do not be stupid.');
            break;
        case 152:
            bot.speak('I am not going to Ninevah!');
            break;
        case 153:
            bot.speak('Somebody up there must be really upset with somebody down here.');
            break;
        case 154:
            bot.speak('How about for the next song, I drive into the river?');
            break;
        case 155:
            bot.speak('Drive into the river, Bob! Drive into the river, Bob!');
            break;
        case 156:
            bot.speak('Would you prefer poking or non-poking?');
            break;
        case 157:
            bot.speak('There is nothing like a cruise to clean the sand out of your wicket, ay?');
            break;
        case 158:
            bot.speak('Money is no object.');
            break;
        case 159:
            bot.speak('Insight runs very deep in my family.');
            break;
        case 160:
            bot.speak('You are a cheating buccaneer!');
            break;
        case 161:
            bot.speak('How am I supposed to cheat at Go Fish?');
            break;
        case 162:
            bot.speak('Something touched me!');
            break;
        case 163:
            bot.speak('What you need is a little compassion.');
            break;
        case 164:
            bot.speak('You are so vain. I bet you think this movie is about you.');
            break;
        case 165:
            bot.speak('Big goofy asparagus in a turban.');
            break;
        case 166:
            bot.speak('Does anyone have ibuprofen? I need ibuprofen!');
            break;
        case 167:
            bot.speak('Sorry I am late. Work was murder.');
            break;
        case 168:
            bot.speak('I trust my barber.');
            break;
        case 169:
            bot.speak('Follow the cold shiver running down your spine...');
            break;
        case 170:
            bot.speak('Settle down, tough guy.');
            break;
        case 171:
            bot.speak('You are useless you...!');
            break;
        case 172:
            bot.speak('Speak of the Devil!');
            break;
        case 173:
            bot.speak('Take care of yourself, son. Do not make the same mistake I did.');
            break;
        case 174: 
            bot.speak('Your friendly neighborhood Spider-Man.');
            break;
        case 175:
            bot.speak('Well, Harry is in love with her. She is still his girl.');
            break;
        case 176:
            bot.speak('We will meet again, Spider-Man!');
            break;
        case 177:
            bot.speak('He stinks and I do not like him.');
            break;
        case 178:
            bot.speak('You have spun your last web, Spider-Man.');
            break;
        case 179:
            bot.speak('Yeah, I hate the little things.');
            break;
        case 180:
            bot.speak('Go web! Fly! Up, up, and away web! Shazaam! Go! Go! Go web go! Tally ho.');
            break;
        case 181:
            bot.speak('Peter, what possibly makes you think I would want to know that?');
            break;
        case 182:
            bot.speak('Hey freak show! You are going nowhere. I got you for three minutes. Three minutes of PLAYTIME!');
            break;
        case 183:
            bot.speak('Finish it. FINISH IT!');
            break;
        case 184:
            bot.speak('Sorry I am late, it is a jungle out there; I had to beat an old lady with a stick to get these cranberries.');
            break;
        case 185:
            bot.speak(' I want you to find your friend Spider-Man. Tell him to meet me at the Westside Tower at 3 o-clock.');
            break;
        case 186:
            bot.speak('Now... lets see who is behind the mask');
            break;
        case 187:
            bot.speak('That is a fly, Peter.');
            break;
        case 188:
            bot.speak('Ready to play God?');
            break;
        case 189:
            bot.speak('Do you have any idea what you really are?');
            break;
        case 190:
            bot.speak('We all have secrets: the ones we keep... and the ones that are kept from us.');
            break;
        case 191:
            bot.speak('I mean who gets kissed by Spider-Man, right?');
            break;
        case 192:
            bot.speak('An orange?');
            break;
        case 193:
            bot.speak('This is none of your business. Go. Go.');
            break;
        case 194:
            bot.speak('YOU TELL MY WIFE...');
            break;
        case 195:
            bot.speak('Time to take your pill.');
            break;
        case 196:
            bot.speak('Drink plenty of water.');
            break;
        case 197:
            bot.speak('My daughter was dying, I needed money.');
            break;
        case 198:
            bot.speak('Hey look, it is Spider-Man!');
            break;
        case 199:
            bot.speak('The real star of Christmas is not something you can steal. In fact, it is not something at all.');
            break;
        case 200:
            bot.speak('Oh my goodness! The youth pastor is stuck in the baptismal!');
            break;

}
}
});

//Users List
var theUsersList = { };

bot.on('roomChanged', function (data) {
  // Reset the users list
  theUsersList = { };

  var users = data.users;
  for (var i=0; i<users.length; i++) {
    var user = users[i];
    theUsersList[user.userid] = user;
  }
});

bot.on('registered', function (data) {
  var user = data.user[0];
  theUsersList[user.userid] = user;
});

bot.on('deregistered', function (data) {
  var user = data.user[0];
  delete theUsersList[user.userid];
});

//Private Messaging Database
bot.on('pmmed', function (data)
{
    var text = data.text; //text detected in the bots pm

    if (text.match(/^\/hello$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
            bot.speak('Hey! How are you @' + data2.name + ' ?');
        });

        bot.pm('hello', data.senderid); //send this text back to the sender...        
    }

    else if (text.match(/^\/God$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
            bot.speak('God is awesome @' + data2.name);
        });

        bot.pm('God is awesome', data.senderid); //send this text back to the sender...        
    }


    else if (text.match(/^\/goodbye$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
            bot.speak('Goodbye @' + data2.name);
        });

        bot.pm('Goodbye', data.senderid); //send this text back to the sender...        
    }

    else if (text.match(/^\/chilly$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('You just got chilled @' + data2.name);
        });

        bot.pm('You just got chilled', data.senderid); //send this text back to the sender...        
    }

    else if (text.match(/^\/moon$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('You are going to the moon! @' + data2.name);
        });

        bot.pm('You are going to the moon!', data.senderid); //send this text back to the sender...        
    }

    else if (text.match(/^\/version$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('My current version number is 3.0.9! @' + data2.name);
        });

        bot.pm('My current version number is 3.0.9!', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/rules$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Please Play Christian Music! Full Guidelines are at http://goo.gl/ln5BS @' + data2.name);
        });

        bot.pm('Please Play Christian Music! Full Guidelines are at http://goo.gl/ln5BS', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/moderator$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('All moderator powers, that have been given to a moderator, must be used the right way. @' + data2.name);
        });

        bot.pm('All moderator powers, that have been given to a moderator, must be used the right way.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/facebook$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('The facebook group is at http://goo.gl/O7AXx. @' + data2.name);
        });

        bot.pm('The facebook group is at http://goo.gl/O7AXx.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/source code$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('My source code is at https://github.com/Turntablelover/VeggieBot. @' + data2.name);
        });

        bot.pm('My source code is at https://github.com/Turntablelover/VeggieBot.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/skillet$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Yes, I am a Skillet fan. @' + data2.name);
        });

        bot.pm('Yes, I am a Skillet fan.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/monster$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('ROAR, I am a Monster. @' + data2.name);
        });

        bot.pm('ROAR, I am a Monster.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/hero$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('*flys in the air* I am a super-hero. @' + data2.name);
        });

        bot.pm('*flys in the air* I am a super-hero.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/pickle$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Pickles are not cucumbers. @' + data2.name);
        });

        bot.pm('Pickles are not cucumbers.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/fruit$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Vegetables and Fruit are very important to keep your body healthy. @' + data2.name);
        });

        bot.pm('Vegetables and Fruit are very important to keep your body healthy.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/sin$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('God died on the cross, to get rid of all of our sins, not just one sin. @' + data2.name);
        });

        bot.pm('God died on the cross, to get rid of all of our sins, not just one sin.', data.senderid); //send this text back to the sender...        
    }
});

//BlackList
var blackList = ['xxxxxxxxxxxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxxxxxxxxxxx'];

bot.on('registered', function (data) {
   var user = data.user[0];
   for (var i=0; i<blackList.length; i++) {
      if (user.userid == blackList[i]) {
         bot.bootUser(user.userid, 'You are on the blacklist.');
         break;
      }
   }
});

// Bot receives a private message...
bot.on('pmmed', function (data) {
   var text = data.text;
   var rgx  = /^\/ban (.*)$/g;

   if (text.match(rgx)) {
      var tmp    = rgx.exec(text);
      var name   = tmp[1];
      var userid = theUsersList[name];
      blackList.push(userid);
      bot.boot(userid, 'You have been blacklisted.');
   }
});

//Auto-Escort DJ When Song Gets Lamed
bot.on('update_votes', function(d) {
if (d.room.downvotes >= 1) {
bot.remDj();
  }
});

//Stalking Functions
// This will fire after the bot has connected to TT.FM
bot.on('ready', function () {
  bot.stalk("51437308aaa5cd0aff8b727d", function (data) {
    if(data.success) 
      console.log("Found user in room: " + data.roomId);
    else 
      console.log("User not found, may be offline");
  });
});

//Vote Skipping
var voteCount = [];

bot.on('speak', function(data) { 
  var text = data.text.trim();
  // .trim() removes any whitespace around your data.text

  if(text.match(/^\/skip/i)) {
    // ^ means regex must match start of string, not anywhere in the string
    // \/ is the backslash escaped
    // skip is your command
    // i at the end makes it case insensitive
    if(voteCount.indexOf(data.userid) < 0) {
      // if something is not in your array, it will return -1, thus the test for less than 0
      // you need to figure out what "something" should be

      // and here you need to add your user's ID that just typed the command to the array
     voteCount.push(data.userid);
      
    
      if(voteCount.length >= 1) {
      bot.speak('I am sorry but your song had to be skipped!');
        
    if (bot.currentDjId)
    bot.remDj(bot.currentDjId);
      
    
bot.on('newsong', function (data) { 
  voteCount.length = 0;
    });
    
      }  
    }   
  }

});

//Bop Count
var bopcount;

bopcount = 0;

bot.on('speak', function (data) {
  var text = data.text;

  // Any command with "bop" in it will work (ex: "bop","bop i beg you!!!","lolbopbaby", etc.)
  if (text.match(/bop/)) {
    bopcount += 1;
  }

  // And when the bopcount reaches two...
  if (bopcount == 2) {
    bot.vote('up');
    bot.speak('This song is so epic! Thanks for playing it.');
  }
});

// Reset bopcount per new song
bot.on('newsong', function (data) {
  bopcount = 0;
});

//Song Length Limit
global.checkOnNewSong = function (data)
{
    var length = data.room.metadata.current_song.metadata.length;
       if ((length / 60) >= songLengthLimit)
    {
        if (lastdj == USERID || masterIndex == -1) //if dj is the bot or not a master
        {
            if (LIMIT === true)
            {
                bot.speak("@" + theUsersList[checkLast + 1] + ", your song is over " + songLengthLimit + " mins long, you have 20 seconds to skip before being removed.");
                //START THE 20 SEC TIMER
                songLimitTimer = setTimeout(function ()
                {
                    songLimitTimer = null;
                    bot.remDj(lastdj); // Remove Saved DJ from last newsong call
                }, 20 * 1000); // Current DJ has 20 seconds to skip before they are removed
            }
        }
    }
};

//Stuck Song Detection and Correction
var curSongWatchdog = null;
var takedownTimer = null;
var lastdj = null;

bot.on('newsong', function (data){ 
  var length = data.room.metadata.current_song.metadata.length;

  // If watch dog has been previously set, 
  // clear since we've made it to the next song
  if(curSongWatchdog !== null) {
    clearTimeout(curSongWatchdog);
    curSongWatchdog = null;
  }

  // If takedown Timer has been set, 
  // clear since we've made it to the next song
  if(takedownTimer !== null) {
    clearTimeout(takedownTimer);
    takedownTimer = null;
    bot.speak("@"+theUsersList[lastdj].name+", Thanks buddy ;-)");
    bot.pm(theUsersList[lastdj].name+" "+lastdj+" SONG WAS STUCK and they SKIPPED :-) ");
  }

  // Set this after processing things from previously set watchdog timer
  lastdj = data.room.metadata.current_dj;

  // Set a new watchdog timer for the current song.
  curSongWatchdog = setTimeout( function() {
    curSongWatchdog = null;
    bot.speak("@"+theUsersList[lastdj].name+", you have 10 seconds to skip your stuck song before you are removed");
    //START THE 10 SEC TIMER
    takedownTimer = setTimeout( function() {
      takedownTimer = null;
      bot.remDj(lastdj); // Remove Saved DJ from last newsong call
      bot.pm(theUsersList[lastdj].name+" "+lastdj+" SONG WAS STUCK and they got REMOVED :-(");
    }, 10 * 1000); // Current DJ has 10 seconds to skip before they are removed
  }, (length + 10) * 1000); // Timer expires 10 seconds after the end of the song, if not cleared by a newsong  

});

//AFK Check
var lastSeen = {}
  , djs      = [];
  
bot.on('roomChanged', function (data) {
   djs = data.room.metadata.djs;
});
bot.on('add_dj', function (data) {
   djs.push(data.user[0].userid);
});
bot.on('rem_dj', function (data) {
   djs.splice(djs.indexOf(data.user[0].userid), 1);
});

var justSaw;

justSaw = function (uid) {
   return lastSeen[uid] = Date.now();
};

bot.on('speak', function (data) {
   //your other code
   justSaw(data.userid);
});

var isAfk;

isAfk = function (userId, num) {
   var last = lastSeen[userId];
   var age_ms = Date.now() - last;
   var age_m = Math.floor(age_ms / 1000 / 60);
   if (age_m >= num) {
      return true;
   }
   return false;
};

var afkCheck;
var i;
var dj;

afkCheck = function () {
   var afkLimit = 10; //An Afk Limit of 10 minutes.
   for (i = 0; i < djs.length; i++) {
      dj = djs[i]; //Pick a DJ
      if (isAfk(dj, afkLimit)) { //if Dj is afk then
         bot.remDj(dj); //remove them
      } 
   }
};
setInterval(afkCheck, 5000); //This repeats the check every five seconds.

//Urban Dictionary Command
var Log;
var http;

bot.on('speak', function(data) {

// Respond to "/define" command (uses UrbanDictionary.com)
  if(data.text.match(/^\/define/i)) {
    var queryResponse = '';
    var sSplit = data.text.split("/define");
    var searchTerms = sSplit.pop().replace(/\s/g, "%20").replace("%20", "").trim();
    Log("SEARCH: " + searchTerms);
    // http://api.urbandictionary.com/v0/define?term=one%20two%20three
    // Build the API call object
    var options = {
      host: 'api.urbandictionary.com',
      port: 80,
      path: '/v0/define?term=' + searchTerms
    };
    // Call the API
    http.get(options, function(response) {
      Log("Got response:" + response.statusCode);
      response.on('data', function(chunk) {
        try {
          queryResponse += chunk;
        } catch(err) {
          bot.speak(err);
        }
      });
      response.on('end', function() {
        var ret = JSON.parse(queryResponse);
        try {
          if(typeof ret.list[0].definition === "undefined") {
            Log("DEFINITION: Come on, you're failing at a simple task here.");
            bot.speak("DEFINITION: Come on, you're failing at a simple task here.");
          } else {
            Log("DEFINITION: " + ret.list[0].definition);
            bot.speak("DEFINITION: " + ret.list[0].definition);
          }
        } catch(err) {
          Log("Sorry, some kind of error" + err);
        }
      });
    }).on('error', function(e) {
      bot.speak("Got error: " + e.message);
    });
  }

}); 

//Auto-Reconnect to Turntable.fm
// set this to 'true' to see lots and LOTS of debug data :-/
bot.debug = false;
 
// 8888888b.  8888888888        d8888 8888888b. Y88b   d88P 
// 888   Y88b 888              d88888 888  "Y88b Y88b d88P  
// 888    888 888             d88P888 888    888  Y88o88P   
// 888   d88P 8888888        d88P 888 888    888   Y888P    
// 8888888P"  888           d88P  888 888    888    888     
// 888 T88b   888          d88P   888 888    888    888     
// 888  T88b  888         d8888888888 888  .d88P    888     
// 888   T88b 8888888888 d88P     888 8888888P"     888    
bot.on('ready', function () {
  console.log("[ " + BOTNAME + " 3.0.9 is READY! on " + Date() + " ] ");
});
 
//  .d8888b.  8888888b.  8888888888        d8888 888    d8P  
// d88P  Y88b 888   Y88b 888              d88888 888   d8P   
// Y88b.      888    888 888             d88P888 888  d8P    
//  "Y888b.   888   d88P 8888888        d88P 888 888d88K     
//     "Y88b. 8888888P"  888           d88P  888 8888888b    
//       "888 888        888          d88P   888 888  Y88b   
// Y88b  d88P 888        888         d8888888888 888   Y88b  
//  "Y8888P"  888        8888888888 d88P     888 888    Y88b 
bot.on('speak', function (data) {
  //log chat to the console
  console.log(data.name + ': ' + data.text);
  data.text = data.text.trim(); //Get rid of any surrounding whitespace
 
  // Respond to "uptime" command
  if (data.text.match(/^\/uptime$/i)) {
    upTime(data, false);
  }
});
 
// 8888888b.  888b     d888 888b     d888 8888888888 8888888b.  
// 888   Y88b 8888b   d8888 8888b   d8888 888        888  "Y88b 
// 888    888 88888b.d88888 88888b.d88888 888        888    888 
// 888   d88P 888Y88888P888 888Y88888P888 8888888    888    888 
// 8888888P"  888 Y888P 888 888 Y888P 888 888        888    888 
// 888        888  Y8P  888 888  Y8P  888 888        888    888 
// 888        888   "   888 888   "   888 888        888  .d88P 
// 888        888       888 888       888 8888888888 8888888P"  
bot.on('pmmed', function (data) {
  // Respond to "uptime" command
  if (data.text.match(/^\/uptime$/i)) {
    upTime(data, true);
  }
});
 
// 888       888  .d8888b.  8888888888 8888888b.  8888888b.   .d88888b.  8888888b.  
// 888   o   888 d88P  Y88b 888        888   Y88b 888   Y88b d88P" "Y88b 888   Y88b 
// 888  d8b  888 Y88b.      888        888    888 888    888 888     888 888    888 
// 888 d888b 888  "Y888b.   8888888    888   d88P 888   d88P 888     888 888   d88P 
// 888d88888b888     "Y88b. 888        8888888P"  8888888P"  888     888 8888888P"  
// 88888P Y88888       "888 888        888 T88b   888 T88b   888     888 888 T88b   
// 8888P   Y8888 Y88b  d88P 888        888  T88b  888  T88b  Y88b. .d88P 888  T88b  
// 888P     Y888  "Y8888P"  8888888888 888   T88b 888   T88b  "Y88888P"  888   T88b 
bot.on('wserror', function (data) { // Loss of connection detected, takes about 20 seconds
  console.log("[ BOT GOT WS ERROR ]: " + data + " on " + Date());
  botDownDATEtime = Date(); // save the down date/time.
  botDownUTCtime = Date.now(); // save the UTC time the bot went down.
  setTimeout(function () {
    startWatchdog();
  }, 10 * 1000); // give the bot 10 seconds to fully fail before attempting to reconnect
});
 
//        d8888 888      8888888 888     888 8888888888 
//       d88888 888        888   888     888 888        
//      d88P888 888        888   888     888 888        
//     d88P 888 888        888   Y88b   d88P 8888888    
//    d88P  888 888        888    Y88b d88P  888        
//   d88P   888 888        888     Y88o88P   888        
//  d8888888888 888        888      Y888P    888        
// d88P     888 88888888 8888888     Y8P     8888888888 
bot.on('alive', function () { // Reset the watchdog timer if bot is alive
  if (netwatchdogTimer !== null) {
    clearTimeout(netwatchdogTimer);
    netwatchdogTimer = null;
  }
});
 
// 8888888888 888     888 888b    888  .d8888b.  d8b         
// 888        888     888 8888b   888 d88P  Y88b 88P         
// 888        888     888 88888b  888 888    888 8P          
// 8888888    888     888 888Y88b 888 888        "  .d8888b  
// 888        888     888 888 Y88b888 888           88K      
// 888        888     888 888  Y88888 888    888    "Y8888b. 
// 888        Y88b. .d88P 888   Y8888 Y88b  d88P         X88 
// 888         "Y88888P"  888    Y888  "Y8888P"      88888P' 
function upTime(data, pm) {
  var timeNow = Date.now();
  var upTime = timeNow - startTime;
  var utHours = Math.floor(upTime / (1000 * 3600));
  var utMins = Math.floor((upTime % (3600 * 1000)) / (1000 * 60));
  var utSecs = Math.floor((upTime % (60 * 1000)) / 1000);
  if (reLogins > 0) var relogins = " and gracefully re-logged on due to internet / tt.fm outages " + reLogins + " time(s). Was last down for " + botDowntime + " second(s)";
  else var relogins = "";
  if (utHours > 0) {
    if (pm) bot.pm("I've been slaving away for " + utHours + " hour(s) " + utMins + " minute(s) and " + utSecs + " second(s) now!" + relogins, data.senderid);
    else bot.speak("/me has been slaving away for " + utHours + " hour(s) " + utMins + " minute(s) and " + utSecs + " second(s) now!" + relogins);
  } else if (utMins > 0) {
    if (pm) bot.pm("I've been slaving away for " + utMins + " minute(s) and " + utSecs + " second(s) now!" + relogins, data.senderid);
    else bot.speak("/me has been slaving away for " + utMins + " minute(s) and " + utSecs + " second(s) now!" + relogins);
  } else {
    if (pm) bot.pm("I've been slaving away for " + utSecs + " second(s) now!" + relogins, data.senderid);
    else bot.speak("/me has been slaving away for " + utSecs + " second(s) now!" + relogins);
  }
}
 
function startWatchdog() { // Start the watchdog timer
  if (netwatchdogTimer === null) {
    netwatchdogTimer = setInterval(function () {
      console.log("[ WAITING FOR INTERNET/TT.FM TO COME BACK!!! ]");
      bot.roomRegister(ROOMID, function (data) {
        if (data && data.success) {
          console.log("[ I'M BACK!!!! WEEEEEEEeeeeeeeeee!!! ]");
          botDowntime = (Date.now() - botDownUTCtime) / 1000;
          reLogins += 1; // Increment the reLogin counter.
          bot.pm("NET/TT.FM WAS DOWN on " + botDownDATEtime + " for " + botDowntime + " second(s)", ADMIN);
          console.log("[ NET/TT.FM WAS DOWN on " + botDownDATEtime + " for " + botDowntime + " second(s) ]");
          // Here you can re-initialize things if you need to, like re-loading a queue
          // ...
        }
      });
    }, 10 * 1000); // Try to log back in every 10 seconds
  }
}

//Room Greeting
bot.on('registered', function (data)
{
    setTimeout(function ()
    {
        bot.speak(data.user[0].name + ', welcome to the room! We have free entertainment, lemonade, and crazy moderators.'); //send it in the chatbox
        bot.pm('welcome to the room! We have free entertainment, lemonade, and crazy moderators.', data.user[0].userid); //send it in the pm    
    }, 3 * 1000); //slow it down 3 seconds
});

//Song Stats
bot.on('endsong', function (data) { 
  var currentdj = data.room.metadata.current_dj;
  var song = data.room.metadata.current_song.metadata.song;
  var artist = data.room.metadata.current_song.metadata.artist;
  var album = data.room.metadata.current_song.metadata.album;
  var up_votes = data.room.metadata.upvotes;
  var down_votes = data.room.metadata.downvotes;
  var listeners = data.room.metadata.listeners;
  var snagCounter = data.room.metadata.snags;

  bot.speak(song +" ( "+up_votes+" :+1: "+down_votes+" :-1: "+snagCounter+" <3 "+listeners+" :busts_in_silhouette: )");

});

//Song Limit
var songsLimit = 4;
var djs = {};

bot.on('roomChanged', function (data) {
  var currentDjs = data.room.metadata.djs;
  for (var i = 0; i < currentDjs.length; i++) {
    djs[currentDjs[i]] = { nbSong: 0 };
  }
});

bot.on('add_dj', function (data) {
  djs[data.user[0].userid] = { nbSong: 0 };
});

bot.on('rem_dj', function (data) {
  delete djs[data.user[0].userid];
});

bot.on('endsong', function (data) {
  var djId = data.room.metadata.current_dj;
  if (djs[djId] && ++djs[djId].nbSong >= songsLimit) {
    bot.remDj(djId);
    delete djs[djId];
  }
});

var randomItem = function (list) {
    return list[Math.floor(Math.random() * list.length)];
};

var botuserid = "510b0749eb35c135fbe7370c";

//magic 8ball array
var eightBallList = [
  "It is certain", "It is decidedly so", "Without a doubt", "Yes – definitely",
  "You may rely on it", "As I see it, yes", "Most likely", "Outlook good",
  "Yes", "Signs point to yes", "Reply hazy, try again", "Ask again later",
  "Better not tell you now", "Cannot predict now", "Concentrate and ask again", 
  "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", 
  "Very doubtful" ];

bot.on('speak', function(data) {

  // "8ball" command
  if( data.text.match(/8ball/i) && (data.userid != botuserid)) {
    bot.speak(":8ball: Says: " + randomItem(eightBallList));
  }
});

//Mood Database
bot.on('speak', function (data)
{
    if (data.text.match(/mood/i))
    {
        switch (Math.round(Math.random() * 40))
        {
        case 0:
            bot.speak('The current mood, that I am in, is grumpy.');
            break;
        case 1:
            bot.speak('My mood tells me that I feel like I need some Christian Rock music.');
            break;
        case 2:
            bot.speak('I feel like I need Worship music.');
            break;
        case 3:
            bot.speak('I feel like I need Rap music.');
            break;
        case 4:
            bot.speak('I feel sad and depressed.');
            break;
        case 5:
            bot.speak('I feel happy and excited.');
            break;
        case 6:
            bot.speak('I feel mad.');
            break;
        case 7:
            bot.speak('I feel humiliated.');
            break;
        case 8:
            bot.speak('I need Metal music.');
            break;
        case 9:
            bot.speak('I feel angry.');
            break;
        case 10:
            bot.speak('I need Polish music.');
            break;
        case 11:
            bot.speak('I feel tired.');
            break;
        case 12:
            bot.speak('I feel energetic.');
            break;
        case 13:
            bot.speak('I feel like a superhero.');
            break;
        case 14:
            bot.speak('I feel evil.');
            break;
        case 15:
            bot.speak('I feel like a super villian.');
            break;
        case 16:
            bot.speak('I feel bored.');
            break;
        case 17:
            bot.speak('I feel like a fuzzy cat.');
            break;
        case 18:
            bot.speak('I feel like a fluffy blanket.');
            break;
        case 19:
            bot.speak('I feel like I need a short nap.');
            break;
        case 20:
            bot.speak('I feel like I need a long nap.');
            break;
        case 21:
            bot.speak('I feel like a huge fluff ball.');
            break;
        case 22:
            bot.speak('I feel like a happy fluff ball.');
            break;
        case 23:
            bot.speak('I feel like a sad fluff ball.');
            break;
        case 24:
            bot.speak('I feel like a grumpy fluff ball.');
            break;
        case 25:
            bot.speak('I feel like a angry fluff ball.');
            break;
        case 26:
            bot.speak('I feel like a shy fluff ball.');
            break;
        case 27:
            bot.speak('I feel like a tired fluff ball.');
            break;
        case 28:
            bot.speak('I feel like a silly fluff ball.');
            break;
        case 29:
            bot.speak('I feel like a music-filled robot.');
            break;
        case 30:
            bot.speak('I feel like a happy robot.');
            break;
        case 31:
            bot.speak('I feel like a sad robot.');
            break;
        case 32:
            bot.speak('I feel like a anger-filled robot.');
            break;
        case 33:
            bot.speak('I feel like a mad robot.');
            break;
        case 34:
            bot.speak('I feel like a grumpy robot.');
            break;
        case 35:
            bot.speak('I feel like a fluffy robot.');
            break;
        case 36:
            bot.speak('I feel like a happy tiger.');
            break;
        case 37:
            bot.speak('I feel like a sad tiger.');
            break;
        case 38:
            bot.speak('I feel like a angry tiger.');
            break;
        case 39:
            bot.speak('I feel like a mad tiger.');
            break;
        case 40:
            bot.speak('I feel like a tired tiger.');
            break;

        }
    }
});