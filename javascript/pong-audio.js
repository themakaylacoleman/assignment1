/*This File creates the sound file players and their default properties
If you create a new player, be sure to import it at the top of index.js!
*/

//import * as Tone from "../lib/Tone.js";

class soundFile {
  constructor(file) {
    this.file = file;
    this.deferPlay = false;
    this.player = null; // created later via initAudio()
  }
  //Create the Tone.Player for this sound (call when Tone is available)
  createPlayer() {
    if (typeof Tone === "undefined") return;
    this.player = new Tone.Player({
      url: "./sounds/" + this.file,
      loop: false,
      autostart: false
    }).toMaster();
  }
  //Play function with correct handling for looping sounds
play() {
  if (!this.player) {
    this.deferPlay = true;
    return;
  }

  // Defer playback if sound isn't finished loading
  if (this.player.loaded === true) {
    this.deferPlay = false;

    if (this.player.loop) {
      // Background music: start only once
      if (this.player.state !== "started") {
        this.player.start();
      }
    } else {
      // Sound effects: restart every time
      this.player.stop();
      this.player.start();
    }

  } else {
    this.deferPlay = true;
  }
}

  //Stop function that may have easier syntax
  stop() {
    if (this.player) this.player.stop();
  }
}

//Try to play sounds that had their playback deferred
export function playDeferredSounds() {
  for (var i = 0; i < soundArray.length; i++) {
    if (soundArray[i].deferPlay === true) {
      soundArray[i].play();
    }
  }
}

export var soundArray = []; //list of sounds loaded

//Here is where all the Sound File Players Start

export var wallSound = new soundFile("silence.mp3"); //load sound
soundArray.push(wallSound); //add sound to list of sounds

export var paddleSound = new soundFile("silence.mp3");
soundArray.push(paddleSound);

export var scoreSound = new soundFile("silence.mp3");
soundArray.push(scoreSound);

export var ambientSound = new soundFile("pajamaparties.mp3");
soundArray.push(ambientSound);

export var adventureMusic = new soundFile("silence.mp3");
soundArray.push(adventureMusic);

export var villageMusic = new soundFile("silence.mp3");
soundArray.push(villageMusic);

//Initialize all players when Tone becomes available. Returns a Promise that
//resolves when all players have been created (loading may still be async).
export function initAudio() {
  return new Promise(resolve => {
    if (typeof Tone === "undefined") {
      // Try again after a short delay — Tone is likely loaded as a classic script
      setTimeout(() => {
        initAudio().then(resolve);
      }, 50);
      return;
    }
    // create all players
    for (var i = 0; i < soundArray.length; i++) {
      soundArray[i].createPlayer();
    }
    // Apply per-player settings
    if (ambientSound.player) {
      ambientSound.player.loop = true;
      ambientSound.player.volume.value = -20;
    }
    if (adventureMusic.player) {
      adventureMusic.player.loop = true;
      adventureMusic.player.volume.value = -16;
    }
    if (villageMusic.player) {
      villageMusic.player.loop = true;
      villageMusic.player.volume.value = -16;
    }
    resolve();
  });
}
