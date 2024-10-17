import { test } from '@playwright/test';
const MainPage = require('../PageObject/MainPage');
require('dotenv').config();

test('Search by track name', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.navigate();

    const addedTracks = await mainPage.selectRandomTracksAndAdd(3);

    await mainPage.getAllTracks();
    await mainPage.verifyTracksInPlaylist(addedTracks);
});