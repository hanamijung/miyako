const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", (GuildMember) => class MiyakoGuildMember extends GuildMember {

  /**
   * Alias
   * this.client.settings.members.update(`${guild.id}.${member.id}`, { points: 0 })
   * to just
   * member.update({ points: 0 })
   */
  update(obj) {
    return this.client.settings.members.update(`${this.guild.id}.${this.id}`, obj);
  }

  get settings() {
    const id = `${this.guild.id}.${this.id}`;
    return this.client.settings.members.get(id) || { id, level: 0, points: 0, daily: null };
  }

  syncSettings() {
    return this.client.settings.members.sync(`${this.guild.id}.${this.id}`);
  }

  syncSettingsCache() {
    if(!this.client.settings.members.cache.has(`${this.guild.id}.${this.id}`)) return this.syncSettings();
  }

  setLevel(level) {
    if(isNaN(level)) throw new Error("Level cannot be NaN");
    return this.update({ level });
  }

  async givePoints(amount) {
    const points = parseInt(this.settings.points) + parseInt(amount);
    if(isNaN(points)) throw new Error("Cannot give NaN points to member.");
    return this.update({ points });
  }

  takePoints(amount) {
    return this.givePoints(-amount);
  }
});
