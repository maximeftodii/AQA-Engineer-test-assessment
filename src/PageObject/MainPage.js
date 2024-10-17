const { expect } = require('@playwright/test');

class MainPage {
  constructor(page) {
    this.page = page;
    this.searchInput = `//label[@for=':r0:' and text()='Search']`;
    this.createPlaylistSection = `//div[contains(text(), "Create your own unique playlist")]`;
    this.tracklistSection = '//div[@id="tracklist"]';
    this.playlistSection = `//div[@id="playlist"]`;
    this.addTracksButton = `//button[contains(text(), 'Add') and contains(text(), 'track')]`
  }

  async navigate() {
    await this.page.goto(process.env.BASE_URL);
  }

  async searchRandomTrack() {
    const allTracks = await this.getAllTracks();
    const randomTrack = allTracks[Math.floor(Math.random() * allTracks.length)];
    console.log(`Searching for random track: ${randomTrack}`);
    await this.page.fill(this.searchInput, randomTrack);
    console.log(randomTrack);
    return randomTrack;
  }

  async verifyAddedTrackIsDisplayed() {
    const addedTracks = await this.getAddedTracks();
    const randomTrack = addedTracks[addedTracks.length - 1];
    const trackXPath = `//div[@id='playlist']//p[text()="${randomTrack}"]`;
    const trackVisible = await this.page.isVisible(trackXPath);
    expect(trackVisible).toBe(true);
  }

  async searchAndVerifyRandomTrack() {
    const trackName = await this.searchRandomTrack();
    await this.verifySearchedTrackIsDisplayed(trackName);
  }

  async addTrackByName() {
    const allTracks = await this.getAllTracks();
    const randomTrack = allTracks[Math.floor(Math.random() * allTracks.length)];
    const addButtonXPath = `//div[@id='tracklist']//p[text()="${randomTrack}"]/ancestor::div[contains(@class, 'MuiGrid-container')]//button[contains(@class, 'MuiButton-root') and contains(text(), '+')]`;

    await this.page.click(addButtonXPath);
    console.log(`Added track: ${randomTrack}`);
    return randomTrack;
  }

  async getAllTracks() {
    return await this.page.$$eval(`${this.tracklistSection} //p`, tracks =>
      tracks
        .filter(track => track.textContent.trim().match(/^[A-Za-z\s]+$/))
        .map(track => track.textContent.trim())
    );
  }

  async getAddedTracks() {
    return await this.page.$$eval(`${this.playlistSection} //p`, tracks =>
      tracks
        .map(track => track.textContent.trim())
        .filter(track => track.match(/^[A-Za-z\s]+$/)) // Allow multiple words with spaces
    );
  }

  async selectRandomTracksAndAdd(count = 3) {
    const allTracks = await this.getAllTracks();
    const randomTracks = allTracks.sort(() => 0.5 - Math.random()).slice(0, count);
    console.log(randomTracks);

    for (const trackName of randomTracks) {
      const checkboxXPath = `//p[text()="${trackName}"]/ancestor::div[contains(@class, 'MuiGrid-container')]//input[@type='checkbox']`;
      console.log(`Checking checkbox for track: ${trackName} with XPath: ${checkboxXPath}`);

      const checkbox = await this.page.locator(checkboxXPath);
      await checkbox.check();
      console.log(`Checked checkbox for track: ${trackName}`);

      await this.page.waitForTimeout(100);
    }

    await this.page.click(this.addTracksButton);
    return randomTracks;
  }

  async verifyTracksInPlaylist(addedTracks) {
    for (const trackName of addedTracks) {
      const trackXPath = `//div[@id='playlist']//p[text()='${trackName}']`;
      const isTrackVisible = await this.page.isVisible(trackXPath);
      expect(isTrackVisible).toBe(true);
    }
  }
}

module.exports = MainPage;
