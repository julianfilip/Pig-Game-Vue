Vue.config.devtools = true;
const button = {
  template:
    '<button class="btn" @click="onClick"><slot>{{ label }}</slot></button>',
  props: ['label'],
  methods: {
    onClick: function () {
      this.$emit('click');
    },
  },
};

const buttonContainer = {
  template:
    '<div class="btnContainer"><Jbutton label="🔄 New game" /><Jbutton label="🎲 Roll dice" @click="onRoll"/><Jbutton label="📥 Hold" @click="onHold"/></div>',
  components: {
    Jbutton: button,
  },
  methods: {
    onRoll: function () {
      this.$emit('roll');
    },
    onHold: function () {
      this.$emit('hold');
    },
  },
};

const modal = {
  template:
    '<div class="dialog"><div class="dialogContent"><slot><p>{{ text }}</p></slot><Bbutton @click="onClick">OK</Bbutton></div><div class="background"></div></div>',
  props: ['text'],
  components: {
    Bbutton: button,
  },
  methods: {
    onClick: function () {
      this.$emit('hide');
    },
  },
};

const player = {
  template: `<section class="player" :class="{'player--active': isActive}">
  <h2 class="name">{{ name }}</h2>
  <p class="score">{{ points }}</p>
  <div class="current">
    <p class="current-label">Current</p>
    <p class="current-score">{{ smallPoints }}</p>
  </div>
</section>`,
  props: ['name', 'smallPoints', 'isActive'],
  data: function () {
    return {
      points: 0,
    };
  },
};

//TODO: current score & bigPoints & NewGame btn

const playersContainer = {
  template:
    '<main><Player :name="player1Name" :isActive="whichPlayerActive===1"/><Player :name="player2Name" :isActive="whichPlayerActive===2"/></main>',
  props: ['player1Name', 'player2Name', 'whichPlayerActive'],
  components: {
    Player: player,
  },
};

const newGameModal = {
  template: `<Modal @hide="dupa"><p>Player 1 name:</p>
  <input type="text" id="player1Name" v-model="player1Name"/>
  <p>Player 2 name:</p>
  <input type="text" id="player2Name" v-model="player2Name"/></Modal>`,
  components: {
    Modal: modal,
  },
  data: function () {
    return {
      player1Name: 'Player 1',
      player2Name: 'Player 2',
    };
  },
  methods: {
    dupa: function () {
      this.$emit('hide', this.player1Name, this.player2Name);
    },
  },
};

const dice = {
  template: '<img :src="imgFile" alt="Playing dice" class="dice" />',
  props: ['number'],
  computed: {
    imgFile: function () {
      return `dice-${this.number}.png`;
    },
  },
};

const app = new Vue({
  el: '#app',
  components: {
    ButtonContainer: buttonContainer,
    Dice: dice,
    Modal: modal,
    NewGameModal: newGameModal,
    PlayersContainer: playersContainer,
  },
  template:
    '<div><PlayersContainer :player1Name="player1Name" :player2Name="player2Name" :whichPlayerActive="whichPlayerActive"/><Dice :number="dice"/><ButtonContainer @roll="onRoll" @hold="onHold"/><Modal :text="text" @hide="dupa" v-if="isModalOpen"/><NewGameModal v-show="newGame" @hide="siusiak"/></div>',
  data: function () {
    return {
      dice: 5,
      text: 'Lorem ipsum',
      isModalOpen: true,
      newGame: false,
      player1Name: 'Player 1',
      player2Name: 'Player 2',
      whichPlayerActive: 1,
    };
  },
  methods: {
    onRoll: function () {
      this.dice = Math.trunc(Math.random() * 6) + 1;
      if (this.dice === 1) {
        this.onHold();
      }
    },
    onHold: function () {
      if (this.whichPlayerActive === 1) {
        this.whichPlayerActive = 2;
      } else {
        this.whichPlayerActive = 1;
      }
    },
    dupa: function () {
      this.isModalOpen = false;
      this.newGame = true;
    },
    siusiak: function (player1, player2) {
      this.newGame = false;
      console.log(player1, player2);
      this.player1Name = player1;
      this.player2Name = player2;
    },
  },
});
