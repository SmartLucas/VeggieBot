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

//DJing Functions
bot.on('speak', function (data) {
  var text = data.text;
  
  if (text.match(/^\/jump$/)) {
    // Bot gets on the DJ table (if there's a spot open) on /jump command
    bot.addDj();
    bot.speak('I am now Djing on the stage, spinning my tunes for everyone to listen to.');
  }
  else if (text.match(/^\/jump down$/)) {
    // Bot jumps off the table on /jump down command
    bot.remDj(USERID);
    bot.speak('I am now tired from spinning some epic music for everyone.');
  }
  else if (text.match(/^\/skip$/)) {
    // Bot skips it's own song (if bot is the current DJ) on /skip command
    bot.skip();
    bot.speak('I am skipping my song, because the listeners have gotten tired of it.');
  }
  else if (text.match(/^\/snag$/)) {
    // Bot adds song to the bottom of it's DJ queue on /snag command
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
        switch (Math.round(Math.random() * 370))
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
            bot.speak('Why are you talking to that horse? Why am I covered in dirt?');
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
        case 201:
            bot.speak('Turntable.Fm Gold is such a waste of money for robots to play with.');
            break;
        case 202:
            bot.speak('*sighs* Humans think, robots are a waste of space on this planet.');
            break;
        case 203:
            bot.speak('Treat others, the way you wanted to be treated.');
            break;
        case 204:
            bot.speak('God will protect us from the dark.');
            break;
        case 205:
            bot.speak('God died on the cross to get rid of all of our sins, not just one sin.');
            break;
        case 206:
            bot.speak('Of course I am programmed, I major in JavaScript.');
            break;
        case 207:
            bot.speak('What is the difference between senior mods and regular mods on turntable.fm.');
            break;
        case 208:
            bot.speak('Summer, the season where you get easily burned up.');
            break;
        case 209:
            bot.speak('*reels in something* OH MY GOD, I just caught a shark.');
            break;
        case 210:
            bot.speak('*digs up something* HOLY VEGGIES, I just found a T-REX Fossil.');
            break;
        case 211:
            bot.speak('ugh, chores are a huge waste of time.');
            break;
        case 212:
            bot.speak('God made you special, and he loves you very much.');
            break;
        case 213:
            bot.speak('/me wishes he had money.');
            break;
        case 214:
            bot.speak('Here is a credit card, kid, go buy yourself a super awesome gaming computer.');
            break;
        case 215:
            bot.speak('Bots should be allowed to become mods and senior moderators on turntable.fm.');
            break;
        case 216:
            bot.speak('Bots should be allowed to have fun.');
            break;
        case 217:
            bot.speak('Bots should be allowed to be silly.');
            break;
        case 218:
            bot.speak('Happy Birthday to all the bots around the world.');
            break;
        case 219:
            bot.speak('*tastes his coffee* sheesh, This coffee tastes aweful. It tastes like salty water. This is why soda is more awesome than coffee');
            break;
        case 220:
            bot.speak('Coffee is for losers. Be like the cool people and drink soda.');
            break;
        case 221:
            bot.speak('Soda is way more awesome than Coffee.');
            break;
        case 222:
            bot.speak('What they did to me, what I am, can not be undone.');
            break;
        case 223:
            bot.speak('I have been trying to find you for over a year. My employers dying, he wants to thank you for saving his life. It is an honour to meet the Wolverine.');
            break;
        case 224:
            bot.speak('That is not who I am anymore.');
            break;
        case 225:
            bot.speak('That hurt.');
            break;
        case 226:
            bot.speak('Eternity can be a curse. The losses you have had to suffer... a man can run out of things to care for, lose his purpose.');
            break;
        case 227:
            bot.speak('We will accept your surrender with respect.');
            break;
        case 228:
            bot.speak('What kind of monster are you?');
            break;
        case 229:
            bot.speak('The Wolverine!');
            break;
        case 230:
            bot.speak('You brought me here to say goodbye. Sayonara.');
            break;
        case 231:
            bot.speak('My apologies, I have not properly introduced myself. Finn McMissile, British intelligence.');
            break;
        case 232:
            bot.speak('Tow Mater, average intelligence.');
            break;
        case 233:
            bot.speak('Speed. I am speed.');
            break;
        case 234:
            bot.speak('Ha ha ha! Really? You are speed? Then Francesco is TRIPLE speed! "Francesco... he is triple speed!" Ho oh! Francesco likes this McQueen! He is a really getting him into the zone!');
            break;
        case 235:
            bot.speak('He is sooo getting beat today...');
            break;
        case 236:
            bot.speak('I will have some of that there pistachio ice cream.');
            break;
        case 237:
            bot.speak('No, no. Wasabi.');
            break;
        case 238:
            bot.speak('Oh, same old, Same old, what is up with you?');
            break;
        case 239:
            bot.speak('Chi trova un amico, trova un tesoro.');
            break;
        case 240:
            bot.speak('What does that mean?');
            break;
        case 241:
            bot.speak('"Whoever finds a friend, finds a treasure."');
            break;
        case 242:
            bot.speak('A wise car hears one word and understands two...');
            break;
        case 243:
            bot.speak('Bona seda!');
            break;
        case 244:
            bot.speak('Uh, nice to meet you, Francesco.');
            break;
        case 245:
            bot.speak('Yes, nice to meet you too. You are very good looking. Not as good as I thought, but you are good!');
            break;
        case 246:
            bot.speak('Scuse me, can I get a picture with you?');
            break;
        case 247:
            bot.speak('Ah, anything for McQueens friend.');
            break;
        case 248:
            bot.speak('Miss Sally is gonna flip when she sees this!');
            break;
        case 249:
            bot.speak('She is Lightning McQueens girlfriend.');
            break;
        case 250:
            bot.speak('Ooh...');
            break;
        case 251:
            bot.speak('She is a big fan of yers.');
            break;
        case 252:
            bot.speak('Hey, she has a-good taste.');
            break;
        case 253:
            bot.speak('Finn, one hour to Porto Corsa.');
            break;
        case 254:
            bot.speak('Thank you, Stephenson.');
            break;
        case 255:
            bot.speak('Ha ha. Cool! Hey computer, make me a German truck!');
            break;
        case 256:
            bot.speak('My condolences.');
            break;
        case 257:
            bot.speak('Do not try the free pistachio ice cream! It done turn!');
            break;
        case 258:
            bot.speak('Siddley. Paris, tout de suite.');
            break;
        case 259:
            bot.speak('Treehugger.');
            break;
        case 260:
            bot.speak('What are you laughing at?');
            break;
        case 261:
            bot.speak('Winter is a grand old time/On this, there are no ifs or buts/But remember all that salt and grime/Can rust your bolts and freeze your -...');
            break;
        case 262:
            bot.speak('Hey, look, there he is!');
            break;
        case 263:
            bot.speak('You hurt your what?');
            break;
        case 264:
            bot.speak('What is your name?');
            break;
        case 265:
            bot.speak('No, uh... no, I know your name. Is your name Mater too?');
            break;
        case 266:
            bot.speak('Will you turn that disrespectful junk OFF?');
            break;
        case 267:
            bot.speak('Here she comes!');
            break;
        case 268:
            bot.speak('Okay, places, everybody! Hurry! Act natural.');
            break;
        case 269:
            bot.speak('Oh, for the love of Chrysler! Can we please ask someone for directions?');
            break;
        case 270:
            bot.speak('Turn right to go left! Guess what? I tried it, and you know what? This crazy thing happened - I went right!');
            break;
        case 271:
            bot.speak('Thanks for the tip!');
            break;
        case 272:
            bot.speak('Git-R-Done!');
            break;
        case 273:
            bot.speak('Thanks to you, Lightning, we had a banner year!');
            break;
        case 274:
            bot.speak('I mean, we might even clear enough to buy you some headlights!');
            break;
        case 275:
            bot.speak('Well, so is my brother, but he still needs headlights!');
            break;
        case 276:
            bot.speak('Oh, hey, Mr. The King.');
            break;
        case 277:
            bot.speak('You got more talent in one lugnut than a lot of cars has got on their whole body.');
            break;
        case 278:
            bot.speak('Okay, here we go. Focus. Speed. I am speed. One winner, forty-two losers. I eat losers for breakfast. Breakfast? Maybe I should have had breakfast? Brekkie could be good for me. No, no, no, focus. Speed. Faster than fast, quicker than quick. I am Lightning.');
            break;
        case 279:
            bot.speak('YOU ARE A TOY - CAR!');
            break;
        case 280:
            bot.speak('You are a sad, strange little wagon. You have my pity. Farewell!');
            break;
        case 281:
            bot.speak('Oh, yeah? Well, good riddance, you loony!');
            break;
        case 282:
            bot.speak('Freebird!');
            break;
        case 283:
            bot.speak('You are famous race car? A real race car?');
            break;
        case 284:
            bot.speak('I have followed racing my entire life, my whole life!');
            break;
        case 285:
            bot.speak('Then you know who I am. I am Lightning McQueen.');
            break;
        case 286:
            bot.speak('Lightning McQueen!');
            break;
        case 287:
            bot.speak('Yes! Yes!');
            break;
        case 288:
            bot.speak('I must scream it to the world, my excitement from the top of someplace very high. Do you know many Ferraris?');
            break;
        case 289:
            bot.speak('What?');
            break;
        case 290:
            bot.speak('Luigi follow only the Ferraris.');
            break;
        case 291:
            bot.speak('Perfecto. Guido!');
            break;
        case 292:
            bot.speak('Pit Stop!');
            break;
        case 293:
            bot.speak('He ha ha, what did Luigi tell you, eh?');
            break;
        case 294:
            bot.speak('Wow, you were right, better then a Ferrari, huh?');
            break;
        case 295:
            bot.speak('Eh, no.');
            break;
        case 296:
            bot.speak('My friend Guido, he always dream of giving a real race car, a pit stop.');
            break;
        case 297:
            bot.speak('Fine. Race your own way.');
            break;
        case 298:
            bot.speak('No pit stoppo. Comprende?');
            break;
        case 299:
            bot.speak('I need to get to California, pronto. Where am I?');
            break;
        case 300:
            bot.speak('Red, will you move over? I want to get a look at that sexy hotrod.');
            break;
        case 301:
            bot.speak('Do you want to stay at the Cozy Cone or what?');
            break;
        case 302:
            bot.speak('Huh?');
            break;
        case 303:
            bot.speak('I mean, if you do, you gotta be clean, because even here, in hillbilly hell, we have standards.');
            break;
        case 304:
            bot.speak('Mater! What did I tell you about talking to the accused?');
            break;
        case 305:
            bot.speak('To not to.');
            break;
        case 306:
            bot.speak('You know, I once knew this girl Doreen. Good-looking girl. Looked just like a Jaguar, only she was a truck! You know, I used to crash into her just so I could speak to her.');
            break;
        case 307:
            bot.speak('What... are you talking about?');
            break;
        case 308:
            bot.speak('I dunno.');
            break;
        case 309:
            bot.speak('GOODBYE! Okay, I am good.');
            break;
        case 310:
            bot.speak('Ka-chow!');
            break;
        case 311:
            bot.speak('Oh, I love being me.');
            break;
        case 312:
            bot.speak('Fly away, Stanley. Be free!');
            break;
        case 313:
            bot.speak('Oh, I am SO not taking you to dinner.');
            break;
        case 314:
            bot.speak('Hey, I know this may be a bad time right now, but you owe me $32,000 in legal fees.');
            break;
        case 315:
            bot.speak('What?');
            break;
        case 316:
            bot.speak('Oh, right. That makes perfect sense. Turn right to go left. Yes, thank you! Or should I say No, thank you, because in Opposite World, maybe that really means thank you.');
            break;
        case 317:
            bot.speak('Ka-chicka! Ka-chicka!');
            break;
        case 318:
            bot.speak('In your dreams, Thunder.');
            break;
        case 319:
            bot.speak('Well, you know, because Thunder always comes after... Lightning!');
            break;
        case 320:
            bot.speak('When was the last time you cared about something except yourself, hot rod? You name me one time, and I will take it all back.');
            break;
        case 321:
            bot.speak('*sees a glowstick* SO SHINY!');
            break;
        case 322:
            bot.speak('Uh-huh. I thought so.');
            break;
        case 323:
            bot.speak('Hey, yo, DJ!');
            break;
        case 324:
            bot.speak('What up?');
            break;
        case 325:
            bot.speak('Crazy grandpa car.');
            break;
        case 326:
            bot.speak('Shall we cruise?');
            break;
        case 327:
            bot.speak('Flo! What do you have at your store?');
            break;
        case 328:
            bot.speak('OK, boys, stay with me.');
            break;
        case 329:
            bot.speak('Throw him outta here, Sheriff! I want him out of my courtroom, I want him out of our town! Case dismissed!');
            break;
        case 330:
            bot.speak('Music. Sweet music.');
            break;
        case 331:
            bot.speak('Oh, oh, oh, oh, I like your style. You drive the hard bargain, eh? OK, we make you a new deal. You buy one tire, I give you three for free!');
            break;
        case 332:
            bot.speak('This is it, my last offer: you buy one tire, I give you seven snow tires for free!');
            break;
        case 333:
            bot.speak('Low and slow?');
            break;
        case 334:
            bot.speak('Oh, yeah, baby!');
            break;
        case 335:
            bot.speak('Respect the classics, man! It is Hendrix!');
            break;
        case 336:
            bot.speak('My name is Mater.');
            break;
        case 337:
            bot.speak('Mater?');
            break;
        case 338:
            bot.speak('Yeah, like tuh-mater, but without the "tuh."');
            break;
        case 339:
            bot.speak('Oh, dude... are you crying?');
            break;
        case 340:
            bot.speak('All rise! The honorable Doc Hudson presiding!');
            break;
        case 341:
            bot.speak('Show-off.');
            break;
        case 342:
            bot.speak('Yeah! Ka-chow!');
            break;
        case 343:
            bot.speak('Three cars are tied for the season points lead, heading into the final race of the season. And the winner of this race, Darrell, will win the season title and the Piston Cup. Does the King, Strip Weathers, have one more victory in him before he retires?');
            break;
        case 344:
            bot.speak('The legend, the runner-up, and the rookie! Three cars, one champion!');
            break;
        case 345:
            bot.speak('Oh, no. Oh, maybe he can help me!');
            break;
        case 346:
            bot.speak('Officer, talk to me, babe. How long is this gonna take? I gotta get to California, pronto.');
            break;
        case 347:
            bot.speak('When the defendant has no lawyer, the court will assign one to him. Hey, anyone wants to be his lawyer?');
            break;
        case 348:
            bot.speak('Oh, take a carwash, hippie.');
            break;
        case 349:
            bot.speak('Wonderful. Now go away.');
            break;
        case 350:
            bot.speak('We are not the same! Understand? Now, get out!');
            break;
        case 351:
            bot.speak('I am a ninja robot, do not make me angry.');
            break;
        case 352:
            bot.speak('You think, I am a robot. I am a skilled cyborg.');
            break;
        case 353:
            bot.speak('*kicks someone in the chest* Stay away from my lemonade, or you will feel pain.');
            break;
        case 354:
            bot.speak('You think, God is a myth, well too bad, He is real. Go read the Bible.');
            break;
        case 355:
            bot.speak('*smashes a guitar in half* This is how true rock stars get paid. We smash guitars for fun.');
            break;
        case 356:
            bot.speak('gizmotronic has gone to the coding side. ');
            break;
        case 357:
            bot.speak('Join the dark side today for red lightsabers and dark side cookies.');
            break;
        case 358:
            bot.speak('The God side has awesome music and cake.');
            break;
        case 359:
            bot.speak('I can count to killer tomato.');
            break;
        case 360:
            bot.speak('*hands robot polish to Boaz* hey buddy, you need this to stay shiny. No one wants you to rust and fall apart.');
            break;
        case 361:
            bot.speak('God is my hero.');
            break;
        case 362:
            bot.speak('Christian music is so epic.');
            break;
        case 363:
            bot.speak('I had a weird dream where zombies were defeated by plants.');
            break;
        case 364:
            bot.speak('Batteries = special rectangles that hold power to activate awesome technology.');
            break;
        case 365:
            bot.speak('The Bible is the book for me.');
            break;
        case 366:
            bot.speak('Who stole my extremely rare iced glow sticks.');
            break;
        case 367:
            bot.speak('Keep glowsticks away from astronauts and cyborgs. They can turn you into a mindless, radiated monster. ');
            break;
        case 368:
            bot.speak('/me juggles ice cubes');
            break;
        case 369:
            bot.speak('Robot Polish saves robots and cyborgs from falling apart and rusting, due to its master not updating his software in a while.');
            break;
        case 370:
            bot.speak('Do not rush through code, when you are a programmer, you will make tons of coding and grammar mistakes.');
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
        bot.speak('My current version number is 4.4.0! @' + data2.name);
        });

        bot.pm('My current version number is 4.4.0!', data.senderid); //send this text back to the sender...        
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
    
    else if (text.match(/^\/love$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Love your neighbor. Treat others, the way you wanted to be treated. @' + data2.name);
        });

        bot.pm('Love your neighbor. Treat others, the way you wanted to be treated.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/dark$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Do not be scared of the dark. God will protect you. @' + data2.name);
        });

        bot.pm('Do not be scared of the dark. God will protect you.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/protect$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('God will protect everyone. @' + data2.name);
        });

        bot.pm('God will protect everyone.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/listen$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Always listen to your parents. @' + data2.name);
        });

        bot.pm('Always listen to your parents.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/sun$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('God made everything. He made the sun and the moon. @' + data2.name);
        });

        bot.pm('God made everything. He made the sun and the moon.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/shiny$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('The moon is the shiniest light in the sky, when it is dark outside. @' + data2.name);
        });

        bot.pm('The moon is the shiniest light in the sky, when it is dark outside.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/fluffy$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Fluffy cats are so soft and cozy to hug. @' + data2.name);
        });

        bot.pm('Fluffy cats are so soft and cozy to hug.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/butterfly$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Butterflys are so cool, and fun to whack around. @' + data2.name);
        });

        bot.pm('Butterflys are so cool, and fun to whack around.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/cloud$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('I live on Cloud9. @' + data2.name);
        });

        bot.pm('I live on Cloud9.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/rain$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Rain is so cold and wet. @' + data2.name);
        });

        bot.pm('Rain is so cold and wet.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/spirit$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('The spirit of the lord will heal you. @' + data2.name);
        });

        bot.pm('The spirit of the lord will heal you.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/honor$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Honor your request by praying it to God. @' + data2.name);
        });

        bot.pm('Honor your request by praying it to God.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/respect$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Respect God and read the Bible. @' + data2.name);
        });

        bot.pm('Respect God and read the Bible.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/treat$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('Treat others, the way you want to be treated. @' + data2.name);
        });

        bot.pm('Treat others, the way you want to be treated.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/mod$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('The mod list is at http://www.nocturnalvideoproductions.com/mods.html. @' + data2.name);
        });

        bot.pm('The mod list is at http://www.nocturnalvideoproductions.com/mods.html.', data.senderid); //send this text back to the sender...        
    }
    
    else if (text.match(/^\/victory$/))
    {
        //data.senderid is the person who pmmed the bot, so it plugs their id into the getProfile function
        //and says their name in the chatbox
        bot.getProfile(data.senderid, function(data2)
        {
        bot.speak('We won with the army of God. @' + data2.name);
        });

        bot.pm('We won with the army of God.', data.senderid); //send this text back to the sender...        
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
    bot.speak('This song is so epic!');
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
  console.log("[ " + BOTNAME + " 4.4.0 is READY! on " + Date() + " ] ");
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
  var snags = 0;

  bot.speak(song +" ( "+up_votes+" :+1: "+down_votes+" :-1: "+snags+" <3 "+listeners+" :busts_in_silhouette: )");

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
        switch (Math.round(Math.random() * 60))
        {
        case 0:
            bot.speak('The current mood, that I am in, is grumpy.');
            break;
        case 1:
            bot.speak('My mood tells me, that I feel like, I need some Christian Rock music.');
            break;
        case 2:
            bot.speak('I feel like, I need Worship music.');
            break;
        case 3:
            bot.speak('I feel like, I need Rap music.');
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
        case 41:
            bot.speak('I feel slugish.');
            break;
        case 42:
            bot.speak('I feel buggish.');
            break;
        case 43:
            bot.speak('I feel glitchy.');
            break;
        case 44:
            bot.speak('I feel old.');
            break;
        case 45:
            bot.speak('I feel weak and helpless.');
            break;
        case 46:
            bot.speak('I feel brave.');
            break;
        case 47:
            bot.speak('I feel courageous.');
            break;
        case 48:
            bot.speak('I feel strong.');
            break;
        case 49:
            bot.speak('I feel like smashing a bad guy into the ground.');
            break;
        case 50:
            bot.speak('I feel like saving the world.');
            break;
        case 51:
            bot.speak('I feel like nothing.');
            break;
        case 52:
            bot.speak('I feel like a worthless space.');
            break;
        case 53:
            bot.speak('I feel like saving a bunch of Pikmin.');
            break;
        case 54:
            bot.speak('I feel like a fool.');
            break;
        case 55:
            bot.speak('I feel like a raging monster.');
            break;
        case 56:
            bot.speak('I feel like a virus.');
            break;
        case 57:
            bot.speak('I feel like a butterfly.');
            break;
        case 58:
            bot.speak('I feel like a dragonfly.');
            break;
        case 59:
            bot.speak('I feel like a shark.');
            break;
        case 60:
            bot.speak('I feel like a goldfish.');
            break;

        }
    }
});

//Fortune Database
bot.on('speak', function (data)
{
    if (data.text.match(/fortune/i))
    {
        switch (Math.round(Math.random() * 40 ))
        {
        case 0:
            bot.speak('I predict, that you will have an awesome day.');
            break;
        case 1:
            bot.speak('I predict, that you will be eaten alive by a shark.');
            break;
        case 2:
            bot.speak('I predict, that you will struggle through your day.');
            break;
        case 3:
            bot.speak('I predict, that you will see God today.');
            break;
        case 4:
            bot.speak('I predict, that you will be attacked by birds.');
            break;
        case 5:
            bot.speak('I predict, that you will be swarmed by angry workers.');
            break;
        case 6:
            bot.speak('I predict, that you will be dive bombed by angry mockingbirds.');
            break;
        case 7:
            bot.speak('I predict, that you will win the lottery.');
            break;
        case 8:
            bot.speak('I predict, that it will rain super hard today.');
            break;
        case 9:
            bot.speak('I predict, that you will get a promotion.');
            break;
        case 10:
            bot.speak('I predict, that it will be super hot today.');
            break;
        case 11:
            bot.speak('I predict, that you will be cooked by the sun.');
            break;
        case 12:
            bot.speak('I predict, that you will win something awesome.');
            break;
        case 13:
            bot.speak('I predict, that you will be attacked by evil robots.');
            break;
        case 14:
            bot.speak('I predict, that you will save the day, from a super-villian.');
            break;
        case 15:
            bot.speak('I predict, that you will save a damsel in distress today.');
            break;
        case 16:
            bot.speak('I predict, that your mom and dad will kick you out of the house today.');
            break;
        case 17:
            bot.speak('I predict, that you will delete a important file off your computer today.');
            break;
        case 18:
            bot.speak('I predict, that you will burn your breakfast today.');
            break;
        case 19:
            bot.speak('I predict, that you will burn your lunch today.');
            break;
        case 20:
            bot.speak('I predict, that you will burn your dinner today.');
            break;
        case 21:
            bot.speak('I predict, that you will be promoted to a moderator today.');
            break;
        case 22:
            bot.speak('I predict, that you will be embarassed by your best friend.');
            break;
        case 23:
            bot.speak('I predict, that everything will go horribly wrong.');
            break;
        case 24:
            bot.speak('I predict, that you will get stuck in the parking lot by crazy drivers.');
            break;
        case 25:
            bot.speak('I predict, that you will be attacked by birds.');
            break;
        case 26:
            bot.speak('I predict, that you will have a terrible day.');
            break;
        case 27:
            bot.speak('I predict, that you will be praised by everybody on turntable.fm.');
            break;
        case 28:
            bot.speak('I predict, that you will win a million dollars.');
            break;
        case 29:
            bot.speak('I predict, that a terrible curse will be bestowed on you.');
            break;
        case 30:
            bot.speak('I predict, that you will burn your house down.');
            break;
        case 31:
            bot.speak('I predict, that your life will be glorious.');
            break;
        case 32:
            bot.speak('I predict, a wonderful storm of happiness and rainbows in your future.');
            break;
        case 33:
            bot.speak('I predict, that your power board will short-circuit.');
            break;
        case 34:
            bot.speak('I predict, that you will be attacked by a 30-foot lizard.');
            break;
        case 35:
            bot.speak('I predict, that you will be biten by a radioactive spider.');
            break;
        case 36:
            bot.speak('I predict, that you will lose everything in a blazing fire.');
            break;
        case 37:
            bot.speak('I predict, that you will get bored and format your hard drive in your computer.');
            break;
        case 38:
            bot.speak('I predict, that your computer mouse will mess up and go crazy.');
            break;
        case 39:
            bot.speak('I predict, that you will get angry and throw your furniture everywhere.');
            break;
        case 40:
            bot.speak('I predict, that a burgular will break into your house.');
            break;
        }
    }
});

bot.on('new_moderator', function(data) {
  bot.speak('Congratulations! @' + data.name + ' has just been promoted to a moderator!');
});

bot.on('rem_moderator', function(data) {
  bot.speak('This is so sad! @' + data.name + ' has just been demoted from a moderator!');
});

//Random Verse Database
bot.on('speak', function (data)
{
    if (data.text.match(/random verse/i))
    {
        switch (Math.round(Math.random() * 177 ))
        {
        case 0:
            bot.speak('Jonah 1:1: Now the word of the Lord came to Jonah the son of Amittai, saying, (ESV)');
            break;
        case 1:
            bot.speak('Jonah 1:2: Arise, go to Nineveh, that great city, and call out against it, for their evil has come up before me. (ESV)');
            break;
        case 2:
            bot.speak('Jonah 1:3a: But Jonah rose to flee to Tarshish from the presence of the Lord. He went down to Joppa and found a ship going to Tarshish. (ESV)');
            break;
        case 3:
            bot.speak('Jonah 1:3b: So he paid the fare and went down into it, to go with them to Tarshish, away from the presence of the Lord. (ESV)');
            break;
        case 4:
            bot.speak('Jonah 1:4: But the Lord hurled a great wind upon the sea, and there was a mighty tempest on the sea, so that the ship threatened to break up. (ESV)');
            break;
        case 5:
            bot.speak('Jonah 1:5a: Then the mariners were afraid, and each cried out to his god. (ESV)');
            break;
        case 6:
            bot.speak('Jonah 1:5b: And they hurled the cargo that was in the ship into the sea to lighten it for them. (ESV)');
            break;
        case 7:
            bot.speak('Jonah 1:5c: But Jonah had gone down into the inner part of the ship and had lain down and was fast asleep. (ESV)');
            break;
        case 8:
            bot.speak('Jonah 1:6a: So the captain came and said to him, “What do you mean, you sleeper? (ESV)');
            break;
        case 9:
            bot.speak('Jonah 1:6b: Arise, call out to your god! Perhaps the god will give a thought to us, that we may not perish. (ESV)');
            break;
        case 10:
            bot.speak('Jonah 1:7a: And they said to one another, “Come, let us cast lots, that we may know on whose account this evil has come upon us. (ESV)');
            break;
        case 11:
            bot.speak('Jonah 1:7b: So they cast lots, and the lot fell on Jonah. (ESV) ');
            break;
        case 12:
            bot.speak('Jonah 1:8a: Then they said to him, “Tell us on whose account this evil has come upon us. (ESV) ');
            break;
        case 13:
            bot.speak('Jonah 1:8b: What is your occupation? And where do you come from? What is your country? And of what people are you? (ESV)');
            break;
        case 14:
            bot.speak('Jonah 1:9: And he said to them, “I am a Hebrew, and I fear the Lord, the God of heaven, who made the sea and the dry land. (ESV)');
            break;
        case 15:
            bot.speak('Jonah 1:10a: Then the men were exceedingly afraid and said to him, “What is this that you have done!” (ESV) ');
            break;
        case 16:
            bot.speak('Jonah 1:10b: For the men knew that he was fleeing from the presence of the Lord, because he had told them. (ESV)');
            break;
        case 17:
            bot.speak('Jonah 1:11: Then they said to him, “What shall we do to you, that the sea may quiet down for us?” For the sea grew more and more tempestuous. (ESV)');
            break;
        case 18:
            bot.speak('Jonah 1:12: He said to them, “Pick me up and hurl me into the sea; then the sea will quiet down for you, for I know it is because of me that this great tempest has come upon you. (ESV)');
            break;
        case 19:
            bot.speak('Jonah 1:13: Nevertheless, the men rowed hard to get back to dry land, but they could not, for the sea grew more and more tempestuous against them. (ESV)');
            break;
        case 20:
            bot.speak('Jonah 1:14: Therefore they called out to the Lord, “O Lord, let us not perish for this mans life, and lay not on us innocent blood, for you, O Lord, have done as it pleased you. (ESV)');
            break;
        case 21:
            bot.speak('Jonah 1:15: So they picked up Jonah and hurled him into the sea, and the sea ceased from its raging. (ESV)');
            break;
        case 22:
            bot.speak('Jonah 1:16: Then the men feared the Lord exceedingly, and they offered a sacrifice to the Lord and made vows. (ESV)');
            break;
        case 23:
            bot.speak('Jonah 1:17: And the Lord appointed a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights. (ESV)');
            break;
        case 24:
            bot.speak('Jonah 2:1: Then Jonah prayed to the Lord his God from the belly of the fish, (ESV)');
            break;
        case 25:
            bot.speak('Jonah 2:2: saying,“I called out to the Lord, out of my distress,and he answered me; out of the belly of Sheol I cried, and you heard my voice. (ESV)');
            break;
        case 26:
            bot.speak('Jonah 2:3: For you cast me into the deep,into the heart of the seas,and the flood surrounded me; all your waves and your billows passed over me. (ESV)');
            break;
        case 27:
            bot.speak('Jonah 2:4: Then I said, ‘I am driven away from your sight; yet I shall again look upon your holy temple.(ESV)');
            break;
        case 28:
            bot.speak('Jonah 2:5: The waters closed in over me to take my life; the deep surrounded me; (ESV)');
            break;
        case 29:
            bot.speak('Jonah 2:6: weeds were wrapped about my head at the roots of the mountains. I went down to the land whose bars closed upon me forever; yet you brought up my life from the pit, O Lord my God. (ESV)');
            break;
        case 30:
            bot.speak('Jonah 2:7: When my life was fainting away, I remembered the Lord, and my prayer came to you, into your holy temple. (ESV)');
            break;
        case 31:
            bot.speak('Jonah 2:8: Those who pay regard to vain idols forsake their hope of steadfast love. (ESV)');
            break;
        case 32:
            bot.speak('Jonah 2:9: But I with the voice of thanksgiving will sacrifice to you; what I have vowed I will pay. Salvation belongs to the Lord! (ESV) ”');
            break;
        case 33:
            bot.speak('Jonah 2:10: And the Lord spoke to the fish, and it vomited Jonah out upon the dry land. (ESV)');
            break;
        case 34:
            bot.speak('Jonah 3:1: Then the word of the Lord came to Jonah the second time, saying, (ESV)');
            break;
        case 35:
            bot.speak('Jonah 3:2: “Arise, go to Nineveh, that great city, and call out against it the message that I tell you.” (ESV)');
            break;
        case 36:
            bot.speak('Jonah 3:3: So Jonah arose and went to Nineveh, according to the word of the Lord. Now Nineveh was an exceedingly great city,[a] three days journey in breadth.[b] (ESV)');
            break;
        case 37:
            bot.speak('Jonah 3:4: Jonah began to go into the city, going a days journey. And he called out, “Yet forty days, and Nineveh shall be overthrown!” (ESV)');
            break;
        case 38:
            bot.speak('Jonah 3:5: And the people of Nineveh believed God. They called for a fast and put on sackcloth, from the greatest of them to the least of them. (ESV)');
            break;
        case 39:
            bot.speak('Jonah 3:6: The word reached[c] the king of Nineveh, and he arose from his throne, removed his robe, covered himself with sackcloth, and sat in ashes. (ESV)');
            break;
        case 40:
            bot.speak('Jonah 3:7: And he issued a proclamation and published through Nineveh, “By the decree of the king and his nobles: Let neither man nor beast, herd nor flock, taste anything. Let them not feed or drink water, (ESV)');
            break;
        case 41:
            bot.speak('Jonah 3:8: but let man and beast be covered with sackcloth, and let them call out mightily to God. Let everyone turn from his evil way and from the violence that is in his hands. (ESV)');
            break;
        case 42:
            bot.speak('Jonah 3:9: Who knows? God may turn and relent and turn from his fierce anger, so that we may not perish. (ESV)”');
            break;
        case 43:
            bot.speak('Jonah 3:10: When God saw what they did, how they turned from their evil way, God relented of the disaster that he had said he would do to them, and he did not do it. (ESV)');
            break;
        case 44:
            bot.speak('Jonah 4:1: But it displeased Jonah exceedingly,[a] and he was angry. (ESV)');
            break;
        case 45:
            bot.speak('Jonah 4:2: And he prayed to the Lord and said, “O Lord, is not this what I said when I was yet in my country? That is why I made haste to flee to Tarshish; for I knew that you are a gracious God and merciful, slow to anger and abounding in steadfast love, and relenting from disaster. (ESV)');
            break;
        case 46:
            bot.speak('Jonah 4:3: Therefore now, O Lord, please take my life from me, for it is better for me to die than to live.” (ESV)');
            break;
        case 47:
            bot.speak('Jonah 4:4: And the Lord said, “Do you do well to be angry?” (ESV)');
            break;
        case 48:
            bot.speak('Jonah 4:5: Jonah went out of the city and sat to the east of the city and made a booth for himself there. He sat under it in the shade, till he should see what would become of the city. (ESV)');
            break;
        case 49:
            bot.speak('Jonah 4:6: Now the Lord God appointed a plant[b] and made it come up over Jonah, that it might be a shade over his head, to save him from his discomfort.[c] So Jonah was exceedingly glad because of the plant. (ESV)');
            break;
        case 50:
            bot.speak('Jonah 4:7: But when dawn came up the next day, God appointed a worm that attacked the plant, so that it withered. (ESV)');
            break;
        case 51:
            bot.speak('Jonah 4:8: When the sun rose, God appointed a scorching east wind, and the sun beat down on the head of Jonah so that he was faint. And he asked that he might die and said, “It is better for me to die than to live.” (ESV)');
            break;
        case 52:
            bot.speak('Jonah 4:9: But God said to Jonah, “Do you do well to be angry for the plant?” And he said, “Yes, I do well to be angry, angry enough to die.” (ESV)');
            break;
        case 53:
            bot.speak('Jonah 4:10: And the Lord said, “You pity the plant, for which you did not labor, nor did you make it grow, which came into being in a night and perished in a night. (ESV)');
            break;
        case 54:
            bot.speak('Jonah 4:11: And should not I pity Nineveh, that great city, in which there are more than 120,000 persons who do not know their right hand from their left, and also much cattle?” (ESV)');
            break;
        case 55:
            bot.speak('Exodus 1:1: These are the names of the sons of Israel who came to Egypt with Jacob, each with his household: (ESV)');
            break;
        case 56:
            bot.speak('Exodus 1:2: Reuben, Simeon, Levi, and Judah, (ESV)');
            break;
        case 57:
            bot.speak('Exodus 1:3: Issachar, Zebulun, and Benjamin, (ESV) ');
            break;
        case 58:
            bot.speak('Exodus 1:4: Dan and Naphtali, Gad and Asher. (ESV)');
            break;
        case 59:
            bot.speak('Exodus 1:5: All the descendants of Jacob were seventy persons; Joseph was already in Egypt. (ESV)');
            break;
        case 60:
            bot.speak('Exodus 1:6: Then Joseph died, and all his brothers and all that generation. (ESV)');
            break;
        case 61:
            bot.speak('Exodus 1:7: But the people of Israel were fruitful and increased greatly; they multiplied and grew exceedingly strong, so that the land was filled with them. (ESV)');
            break;
        case 62:
            bot.speak('Exodus 1:8: Now there arose a new king over Egypt, who did not know Joseph. (ESV)');
            break;
        case 63:
            bot.speak('Exodus 1:9: And he said to his people, “Behold, the people of Israel are too many and too mighty for us. (ESV)');
            break;
        case 64:
            bot.speak('Exodus 1:10: Come, let us deal shrewdly with them, lest they multiply, and, if war breaks out, they join our enemies and fight against us and escape from the land.” (ESV)');
            break;
        case 65:
            bot.speak('Exodus 1:11: Therefore they set taskmasters over them to afflict them with heavy burdens. They built for Pharaoh store cities, Pithom and Raamses. (ESV)');
            break;
        case 66:
            bot.speak('Exodus 1:12: But the more they were oppressed, the more they multiplied and the more they spread abroad. And the Egyptians were in dread of the people of Israel. (ESV)');
            break;
        case 67:
            bot.speak('Exodus 1:13: So they ruthlessly made the people of Israel work as slaves (ESV)');
            break;
        case 68:
            bot.speak('Exodus 1:14: and made their lives bitter with hard service, in mortar and brick, and in all kinds of work in the field. In all their work they ruthlessly made them work as slaves. (ESV)');
            break;
        case 69:
            bot.speak('Exodus 1:15: Then the king of Egypt said to the Hebrew midwives, one of whom was named Shiphrah and the other Puah, (ESV)');
            break;
        case 70:
            bot.speak('Exodus 1:16: “When you serve as midwife to the Hebrew women and see them on the birthstool, if it is a son, you shall kill him, but if it is a daughter, she shall live.” (ESV)');
            break;
        case 71:
            bot.speak('Exodus 1:17: But the midwives feared God and did not do as the king of Egypt commanded them, but let the male children live. (ESV)');
            break;
        case 72:
            bot.speak('Exodus 1:18: So the king of Egypt called the midwives and said to them, “Why have you done this, and let the male children live?” (ESV)');
            break;
        case 73:
            bot.speak('Exodus 1:19: The midwives said to Pharaoh, “Because the Hebrew women are not like the Egyptian women, for they are vigorous and give birth before the midwife comes to them.” (ESV)');
            break;
        case 74:
            bot.speak('Exodus 1:20: So God dealt well with the midwives. And the people multiplied and grew very strong. (ESV)');
            break;
        case 75:
            bot.speak('Exodus 1:21: And because the midwives feared God, he gave them families. (ESV)');
            break;
        case 76:
            bot.speak('Exodus 1:22: Then Pharaoh commanded all his people, “Every son that is born to the Hebrews[a] you shall cast into the Nile, but you shall let every daughter live.” (ESV)');
            break;
        case 77:
            bot.speak('Exodus 2:1: Now a man from the house of Levi went and took as his wife a Levite woman. (ESV)');
            break;
        case 78:
            bot.speak('Exodus 2:2: The woman conceived and bore a son, and when she saw that he was a fine child, she hid him three months. (ESV)');
            break;
        case 79:
            bot.speak('Exodus 2:3: When she could hide him no longer, she took for him a basket made of bulrushes[a] and daubed it with bitumen and pitch. She put the child in it and placed it among the reeds by the river bank. (ESV)');
            break;
        case 80:
            bot.speak('Exodus 2:4: And his sister stood at a distance to know what would be done to him. (ESV)');
            break;
        case 81:
            bot.speak('Exodus 2:5: Now the daughter of Pharaoh came down to bathe at the river, while her young women walked beside the river. She saw the basket among the reeds and sent her servant woman, and she took it. (ESV)');
            break;
        case 82:
            bot.speak('Exodus 2:6: When she opened it, she saw the child, and behold, the baby was crying. She took pity on him and said, “This is one of the Hebrews children.” (ESV)');
            break;
        case 83:
            bot.speak('Exodus 2:7: Then his sister said to Pharaohs daughter, “Shall I go and call you a nurse from the Hebrew women to nurse the child for you?” (ESV)');
            break;
        case 84:
            bot.speak('Exodus 2:8: And Pharaohs daughter said to her, “Go.” So the girl went and called the childs mother. (ESV)');
            break;
        case 85:
            bot.speak('Exodus 2:9: And Pharaohs daughter said to her, “Take this child away and nurse him for me, and I will give you your wages.” So the woman took the child and nursed him. (ESV)');
            break;
        case 86:
            bot.speak('Exodus 2:10: When the child grew older, she brought him to Pharaohs daughter, and he became her son. She named him Moses, “Because,” she said, “I drew him out of the water.” (ESV)');
            break;
        case 87:
            bot.speak('Exodus 2:11: One day, when Moses had grown up, he went out to his people and looked on their burdens, and he saw an Egyptian beating a Hebrew, one of his people. (ESV)');
            break;
        case 88:
            bot.speak('Exodus 2:12: He looked this way and that, and seeing no one, he struck down the Egyptian and hid him in the sand. (ESV)');
            break;
        case 89:
            bot.speak('Exodus 2:13: When he went out the next day, behold, two Hebrews were struggling together. And he said to the man in the wrong, “Why do you strike your companion?” (ESV)');
            break;
        case 90:
            bot.speak('Exodus 2:14: He answered, “Who made you a prince and a judge over us? Do you mean to kill me as you killed the Egyptian?” Then Moses was afraid, and thought, “Surely the thing is known.” (ESV)');
            break;
        case 91:
            bot.speak('Exodus 2:15: When Pharaoh heard of it, he sought to kill Moses. But Moses fled from Pharaoh and stayed in the land of Midian. And he sat down by a well. (ESV)');
            break;
        case 92:
            bot.speak('Exodus 2:16: Now the priest of Midian had seven daughters, and they came and drew water and filled the troughs to water their fathers flock. (ESV) ');
            break;
        case 93:
            bot.speak('Exodus 2:17: The shepherds came and drove them away, but Moses stood up and saved them, and watered their flock. (ESV)');
            break;
        case 94:
            bot.speak('Exodus 2:18: When they came home to their father Reuel, he said, “How is it that you have come home so soon today?” (ESV)');
            break;
        case 95:
            bot.speak('Exodus 2:19: They said, “An Egyptian delivered us out of the hand of the shepherds and even drew water for us and watered the flock.” (ESV)');
            break;
        case 96:
            bot.speak('Exodus 2:20: He said to his daughters, “Then where is he? Why have you left the man? Call him, that he may eat bread.” (ESV)');
            break;
        case 97:
            bot.speak('Exodus 2:21: And Moses was content to dwell with the man, and he gave Moses his daughter Zipporah. (ESV)');
            break;
        case 98:
            bot.speak('Exodus 2:22: She gave birth to a son, and he called his name Gershom, for he said, “I have been a sojourner[d] in a foreign land.” (ESV)');
            break;
        case 99:
            bot.speak('Exodus 2:23: During those many days the king of Egypt died, and the people of Israel groaned because of their slavery and cried out for help. Their cry for rescue from slavery came up to God. (ESV)');
            break;
        case 100:
            bot.speak('Exodus 2:24: And God heard their groaning, and God remembered his covenant with Abraham, with Isaac, and with Jacob. (ESV)');
            break;
        case 101:
            bot.speak('Exodus 2:25: God saw the people of Israel—and God knew. (ESV)');
            break;
        case 102:
            bot.speak('Exodus 3:1: Now Moses was keeping the flock of his father-in-law, Jethro, the priest of Midian, and he led his flock to the west side of the wilderness and came to Horeb, the mountain of God. (ESV)');
            break;
        case 103:
            bot.speak('Exodus 3:2: And the angel of the Lord appeared to him in a flame of fire out of the midst of a bush. He looked, and behold, the bush was burning, yet it was not consumed. (ESV)');
            break;
        case 104:
            bot.speak('Exodus 3:3: And Moses said, “I will turn aside to see this great sight, why the bush is not burned.” (ESV)');
            break;
        case 105:
            bot.speak('Exodus 3:4: When the Lord saw that he turned aside to see, God called to him out of the bush, “Moses, Moses!” And he said, “Here I am.” (ESV)');
            break;
        case 106:
            bot.speak('Exodus 3:5: Then he said, “Do not come near; take your sandals off your feet, for the place on which you are standing is holy ground.” (ESV)');
            break;
        case 107:
            bot.speak('Exodus 3:6: And he said, “I am the God of your father, the God of Abraham, the God of Isaac, and the God of Jacob.” And Moses hid his face, for he was afraid to look at God. (ESV)');
            break;
        case 108:
            bot.speak('Exodus 3:7: Then the Lord said, “I have surely seen the affliction of my people who are in Egypt and have heard their cry because of their taskmasters. I know their sufferings, (ESV)');
            break;
        case 109:
            bot.speak('Exodus 3:8: and I have come down to deliver them out of the hand of the Egyptians and to bring them up out of that land to a good and broad land, a land flowing with milk and honey, to the place of the Canaanites, the Hittites, the Amorites, the Perizzites, the Hivites, and the Jebusites. (ESV)');
            break;
        case 110:
            bot.speak('Exodus 3:9: And now, behold, the cry of the people of Israel has come to me, and I have also seen the oppression with which the Egyptians oppress them. (ESV)');
            break;
        case 111:
            bot.speak('Exodus 3:10: Come, I will send you to Pharaoh that you may bring my people, the children of Israel, out of Egypt.” (ESV)');
            break;
        case 112:
            bot.speak('Exodus 3:11: But Moses said to God, “Who am I that I should go to Pharaoh and bring the children of Israel out of Egypt?” (ESV)');
            break;
        case 113:
            bot.speak('Exodus 3:12: He said, “But I will be with you, and this shall be the sign for you, that I have sent you: when you have brought the people out of Egypt, you shall serve God on this mountain.” (ESV)');
            break;
        case 114:
            bot.speak('Exodus 3:13: Then Moses said to God, “If I come to the people of Israel and say to them, ‘The God of your fathers has sent me to you,’ and they ask me, ‘What is his name?’ what shall I say to them?” (ESV)');
            break;
        case 115:
            bot.speak('Exodus 3:14: God said to Moses, “I am who I am.”[a] And he said, “Say this to the people of Israel, ‘I am has sent me to you.’” (ESV)');
            break;
        case 116:
            bot.speak('Exodus 3:15: God also said to Moses, “Say this to the people of Israel, ‘The Lord,[b] the God of your fathers, the God of Abraham, the God of Isaac, and the God of Jacob, has sent me to you.’ This is my name forever, and thus I am to be remembered throughout all generations. (ESV)');
            break;
        case 117:
            bot.speak('Exodus 3:16: Go and gather the elders of Israel together and say to them, ‘The Lord, the God of your fathers, the God of Abraham, of Isaac, and of Jacob, has appeared to me, saying, “I have observed you and what has been done to you in Egypt, (ESV)');
            break;
        case 118:
            bot.speak('Exodus 3:17: and I promise that I will bring you up out of the affliction of Egypt to the land of the Canaanites, the Hittites, the Amorites, the Perizzites, the Hivites, and the Jebusites, a land flowing with milk and honey.”’ (ESV)');
            break;
        case 119:
            bot.speak('Exodus 3:18: And they will listen to your voice, and you and the elders of Israel shall go to the king of Egypt and say to him, ‘The Lord, the God of the Hebrews, has met with us; and now, please let us go a three days journey into the wilderness, that we may sacrifice to the Lord our God.’ (ESV)');
            break;
        case 120:
            bot.speak('Exodus 3:19: But I know that the king of Egypt will not let you go unless compelled by a mighty hand.[c] (ESV)');
            break;
        case 121:
            bot.speak('Exodus 3:20: So I will stretch out my hand and strike Egypt with all the wonders that I will do in it; after that he will let you go. (ESV)');
            break;
        case 122:
            bot.speak('Exodus 3:21: And I will give this people favor in the sight of the Egyptians; and when you go, you shall not go empty, (ESV)');
            break;
        case 123:
            bot.speak('Exodus 3:22: but each woman shall ask of her neighbor, and any woman who lives in her house, for silver and gold jewelry, and for clothing. You shall put them on your sons and on your daughters. So you shall plunder the Egyptians.” (ESV)');
            break;
        case 124:
            bot.speak('Exodus 4:1: Then Moses answered, “But behold, they will not believe me or listen to my voice, for they will say, ‘The Lord did not appear to you.’” (ESV)');
            break;
        case 125:
            bot.speak('Exodus 4:2: The Lord said to him, “What is that in your hand?” He said, “A staff.” (ESV) ');
            break;
        case 126:
            bot.speak('Exodus 4:3: And he said, “Throw it on the ground.” So he threw it on the ground, and it became a serpent, and Moses ran from it. (ESV)');
            break;
        case 127:
            bot.speak('Exodus 4:4: But the Lord said to Moses, “Put out your hand and catch it by the tail”—so he put out his hand and caught it, and it became a staff in his hand— (ESV)');
            break;
        case 128:
            bot.speak('Exodus 4:5: “that they may believe that the Lord, the God of their fathers, the God of Abraham, the God of Isaac, and the God of Jacob, has appeared to you.” (ESV)');
            break;
        case 129:
            bot.speak('Exodus 4:6: Again, the Lord said to him, “Put your hand inside your cloak.”[a] And he put his hand inside his cloak, and when he took it out, behold, his hand was leprous[b] like snow. (ESV)');
            break;
        case 130:
            bot.speak('Exodus 4:7: Then God said, “Put your hand back inside your cloak.” So he put his hand back inside his cloak, and when he took it out, behold, it was restored like the rest of his flesh. (ESV)');
            break;
        case 131:
            bot.speak('Exodus 4:8: “If they will not believe you,” God said, “or listen to the first sign, they may believe the latter sign. (ESV)');
            break;
        case 132:
            bot.speak('Exodus 4:9: If they will not believe even these two signs or listen to your voice, you shall take some water from the Nile and pour it on the dry ground, and the water that you shall take from the Nile will become blood on the dry ground.” (ESV)');
            break;
        case 133:
            bot.speak('Exodus 4:10: But Moses said to the Lord, “Oh, my Lord, I am not eloquent, either in the past or since you have spoken to your servant, but I am slow of speech and of tongue.” (ESV) ');
            break;
        case 134:
            bot.speak('Exodus 4:11: Then the Lord said to him, “Who has made mans mouth? Who makes him mute, or deaf, or seeing, or blind? Is it not I, the Lord? (ESV)');
            break;
        case 135:
            bot.speak('Exodus 4:12: Now therefore go, and I will be with your mouth and teach you what you shall speak.” (ESV)');
            break;
        case 136:
            bot.speak('Exodus 4:13: But he said, “Oh, my Lord, please send someone else.” (ESV)');
            break;
        case 137:
            bot.speak('Exodus 4:14: Then the anger of the Lord was kindled against Moses and he said, “Is there not Aaron, your brother, the Levite? I know that he can speak well. Behold, he is coming out to meet you, and when he sees you, he will be glad in his heart. (ESV) ');
            break;
        case 138:
            bot.speak('Exodus 4:15: You shall speak to him and put the words in his mouth, and I will be with your mouth and with his mouth and will teach you both what to do. (ESV)');
            break;
        case 139:
            bot.speak('Exodus 4:16: He shall speak for you to the people, and he shall be your mouth, and you shall be as God to him. (ESV) ');
            break;
        case 140:
            bot.speak('Exodus 4:17: And take in your hand this staff, with which you shall do the signs.” (ESV)');
            break;
        case 141:
            bot.speak('Exodus 4:18: Moses went back to Jethro his father-in-law and said to him, “Please let me go back to my brothers in Egypt to see whether they are still alive.” And Jethro said to Moses, “Go in peace.” (ESV) ');
            break;
        case 142:
            bot.speak('Exodus 4:19: And the Lord said to Moses in Midian, “Go back to Egypt, for all the men who were seeking your life are dead.” (ESV)');
            break;
        case 143:
            bot.speak('Exodus 4:20: So Moses took his wife and his sons and had them ride on a donkey, and went back to the land of Egypt. And Moses took the staff of God in his hand. (ESV)');
            break;
        case 144:
            bot.speak('Exodus 4:21: And the Lord said to Moses, “When you go back to Egypt, see that you do before Pharaoh all the miracles that I have put in your power. But I will harden his heart, so that he will not let the people go. (ESV)');
            break;
        case 145:
            bot.speak('Exodus 4:22: Then you shall say to Pharaoh, ‘Thus says the Lord, Israel is my firstborn son, (ESV)');
            break;
        case 146:
            bot.speak('Exodus 4:23: and I say to you, “Let my son go that he may serve me.” If you refuse to let him go, behold, I will kill your firstborn son.’” (ESV)');
            break;
        case 147:
            bot.speak('Exodus 4:24: At a lodging place on the way the Lord met him and sought to put him to death. (ESV)');
            break;
        case 148:
            bot.speak('Exodus 4:25: Then Zipporah took a flint and cut off her sons foreskin and touched Moses[c] feet with it and said, “Surely you are a bridegroom of blood to me!” (ESV)');
            break;
        case 149:
            bot.speak('Exodus 4:26: So he let him alone. It was then that she said, “A bridegroom of blood,” because of the circumcision. (ESV)');
            break;
        case 150:
            bot.speak('Exodus 4:27: The Lord said to Aaron, “Go into the wilderness to meet Moses.” So he went and met him at the mountain of God and kissed him. (ESV)');
            break;
        case 151:
            bot.speak('Exodus 4:28: And Moses told Aaron all the words of the Lord with which he had sent him to speak, and all the signs that he had commanded him to do. (ESV)');
            break;
        case 152:
            bot.speak('Exodus 4:29: Then Moses and Aaron went and gathered together all the elders of the people of Israel. (ESV)');
            break;
        case 153:
            bot.speak('Exodus 4:30: Aaron spoke all the words that the Lord had spoken to Moses and did the signs in the sight of the people. (ESV) ');
            break;
        case 154:
            bot.speak('Exodus 4:31: And the people believed; and when they heard that the Lord had visited the people of Israel and that he had seen their affliction, they bowed their heads and worshiped. (ESV)');
            break;
        case 155:
            bot.speak('Exodus 5:1: Afterward Moses and Aaron went and said to Pharaoh, “Thus says the Lord, the God of Israel, ‘Let my people go, that they may hold a feast to me in the wilderness.’” (ESV)');
            break;
        case 156:
            bot.speak('Exodus 5:2: But Pharaoh said, “Who is the Lord, that I should obey his voice and let Israel go? I do not know the Lord, and moreover, I will not let Israel go.” (ESV)');
            break;
        case 157:
            bot.speak('Exodus 5:3: Then they said, “The God of the Hebrews has met with us. Please let us go a three days journey into the wilderness that we may sacrifice to the Lord our God, lest he fall upon us with pestilence or with the sword.” (ESV)');
            break;
        case 158:
            bot.speak('Exodus 5:4: But the king of Egypt said to them, “Moses and Aaron, why do you take the people away from their work? Get back to your burdens.” (ESV)');
            break;
        case 159:
            bot.speak('Exodus 5:5: And Pharaoh said, “Behold, the people of the land are now many,[a] and you make them rest from their burdens!” (ESV)');
            break;
        case 160:
            bot.speak('Exodus 5:6: The same day Pharaoh commanded the taskmasters of the people and their foremen, (ESV)');
            break;
        case 161:
            bot.speak('Exodus 5:7: “You shall no longer give the people straw to make bricks, as in the past; let them go and gather straw for themselves. (ESV)');
            break;
        case 162:
            bot.speak('Exodus 5:8: But the number of bricks that they made in the past you shall impose on them, you shall by no means reduce it, for they are idle. Therefore they cry, ‘Let us go and offer sacrifice to our God.’ (ESV)');
            break;
        case 163:
            bot.speak('Exodus 5:9: Let heavier work be laid on the men that they may labor at it and pay no regard to lying words.” (ESV)');
            break;
        case 164:
            bot.speak('Exodus 5:10: So the taskmasters and the foremen of the people went out and said to the people, “Thus says Pharaoh, ‘I will not give you straw. (ESV)');
            break;
        case 165:
            bot.speak('Exodus 5:11: Go and get your straw yourselves wherever you can find it, but your work will not be reduced in the least.’” (ESV)');
            break;
        case 166:
            bot.speak('Exodus 5:12: So the people were scattered throughout all the land of Egypt to gather stubble for straw. (ESV)');
            break;
        case 167:
            bot.speak('Exodus 5:13: The taskmasters were urgent, saying, “Complete your work, your daily task each day, as when there was straw.” (ESV)');
            break;
        case 168:
            bot.speak('Exodus 5:14: And the foremen of the people of Israel, whom Pharaohs taskmasters had set over them, were beaten and were asked, “Why have you not done all your task of making bricks today and yesterday, as in the past?” (ESV)');
            break;
        case 169:
            bot.speak('Exodus 5:15: Then the foremen of the people of Israel came and cried to Pharaoh, “Why do you treat your servants like this? (ESV)');
            break;
        case 170:
            bot.speak('Exodus 5:16: No straw is given to your servants, yet they say to us, ‘Make bricks!’ And behold, your servants are beaten; but the fault is in your own people.” (ESV)');
            break;
        case 171:
            bot.speak('Exodus 5:17: But he said, “You are idle, you are idle; that is why you say, ‘Let us go and sacrifice to the Lord.’ (ESV)');
            break;
        case 172:
            bot.speak('Exodus 5:18: Go now and work. No straw will be given you, but you must still deliver the same number of bricks.” (ESV)');
            break;
        case 173:
            bot.speak('Exodus 5:19: The foremen of the people of Israel saw that they were in trouble when they said, “You shall by no means reduce your number of bricks, your daily task each day.” (ESV)');
            break;
        case 174:
            bot.speak('Exodus 5:20: They met Moses and Aaron, who were waiting for them, as they came out from Pharaoh; (ESV)');
            break;
        case 175:
            bot.speak('Exodus 5:21: and they said to them, “The Lord look on you and judge, because you have made us stink in the sight of Pharaoh and his servants, and have put a sword in their hand to kill us.” (ESV)');
            break;
        case 176:
            bot.speak('Exodus 5:22: Then Moses turned to the Lord and said, “O Lord, why have you done evil to this people? Why did you ever send me? (ESV)');
            break;
        case 177:
            bot.speak('Exodus 5:23: For since I came to Pharaoh to speak in your name, he has done evil to this people, and you have not delivered your people at all.” (ESV)');
            break;
        }
    }
});

bot.on('registered', function (data) {
var name = data.user[0].name;
var command = data.command; 
   bot.becomeFan(data.user[0].userid);
});

bot.on('roomChanged', function (data) {
    bot.speak('4.4.0 has been activated');
});

bot.on('newsong', function (data) { 
bot.speak('The current song is: ' + data.room.metadata.current_song.metadata.song);
bot.speak('From the artist: ' + data.room.metadata.current_song.metadata.artist);
bot.speak('From the album: ' + data.room.metadata.current_song.metadata.album);
bot.speak('Genre is: ' + data.room.metadata.current_song.metadata.genre);
bot.speak('Start Time is: ' + data.room.metadata.current_song.starttime);
});

//Stable Database
bot.on('speak', function (data)
{
    if (data.text.match(/stable/i))
    {
        switch (Math.round(Math.random() * 10 ))
        {
        case 0:
            bot.speak('I am super stable. I can run for hours.');
            break;
        case 1:
            bot.speak('I am pretty stable. I can run for a couple of hours with no crashs.');
            break;
        case 2:
            bot.speak('I am stable, but my feet are shaking a bit.');
            break;
        case 3:
            bot.speak('I am pretty unstable. My code is filled with bugs or unrecognized code. I will crash like crazy.');
            break;
        case 4:
            bot.speak('I am unstable. My code is buggish.');
            break;
        case 5:
            bot.speak('I am stable. My code has recognized code.');
            break;
        case 6:
            bot.speak('I am super stable. I drank my daily can of soda.');
            break;
        case 7:
            bot.speak('I am unstable. I am half-asleep.');
            break;
        case 8:
            bot.speak('I am unstable. My legs are asleep.');
            break;
        case 9:
            bot.speak('I am stable. I am wide awake and ready for action.');
            break;
        case 10:
            bot.speak('I am unstable. My battery power is low');
            break;
        }
    }
});