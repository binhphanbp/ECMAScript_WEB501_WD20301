class PlayerList {
  #list;

  constructor(initialPlayers = []) {
    this.#list = initialPlayers;
  }

  getPlayers() {
    return this.#list;
  }

  addPlayer(player) {
    this.#list.push(player);
  }

  removePlayer(index) {
    if (index >= 0 && index < this.#list.length) {
      this.#list.splice(index, 1);
    }
  }

  getPlayerByIndex(index) {
    return this.#list[index];
  }

  getForwards() {
    return this.#list.filter((player) => player.getPosition() === 'Tiền đạo');
  }

  getGoldenBallWinners() {
    return this.#list.filter((player) => player.isGoldenBallWinner());
  }

  getTopScorers() {
    if (this.#list.length === 0) {
      return [];
    }
    const maxGoals = Math.max(...this.#list.map((p) => p.getGoals()));
    return this.#list.filter((p) => p.getGoals() === maxGoals);
  }

  getSortedByName() {
    return [...this.#list].sort((a, b) => a.name.localeCompare(b.name));
  }
}

export { PlayerList };
