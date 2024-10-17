import { test } from '@playwright/test';
const MainPage = require('../PageObject/MainPage');
require('dotenv').config();

test('Search by track name', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.navigate();
    
    await mainPage.searchRandomTrack();
  });