const chrome = require('selenium-webdriver/chrome');
const webdriver = require('selenium-webdriver');
const { By, until, Key } = require('selenium-webdriver');

const chai = require('chai');
const assert = require('assert');
const expect = chai.expect;

let options = new chrome.Options();
options.addArguments('--headless=new');
options.addArguments('ignore-certificate-errors');
let driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(options)
    .usingServer('http://localhost:9515/')
    .build();

describe('Search securities ', () => {
    it('should find results for search term "Fund"', async function() {
        this.timeout(10000);
        await driver.get('https://localhost:8080');
        await driver.findElement(By.tagName('input')).sendKeys('Fund');
        await driver.wait(until.elementsLocated(By.css('.record .col.name'), 5000)).then(async elements => {
            expect(elements.length).to.be.greaterThan(0);
            assert('ok');
        });
    });

    it('should backspace until "So" remains in search input field and there should be no results visible', async function() {
        this.timeout(10000);
        await driver.findElement(By.tagName('input')).sendKeys(Key.BACK_SPACE);
        await driver.findElement(By.tagName('input')).sendKeys(Key.BACK_SPACE);
        const visible = await driver.findElement(By.css('.results .data')).isDisplayed();
        expect(visible).to.equal(false);
    });

    it('should click on the close icon and clear both results and the search input field', async function() {
        this.timeout(10000);
        await driver.findElement(By.css('.close.google-symbol')).click();
        const visible = await driver.findElement(By.css('.results .data')).isDisplayed();
        expect(visible).to.equal(false);
        const searchInputFieldValue = await driver.findElement(By.css('.input-group input')).getAttribute('value');
        expect(searchInputFieldValue).to.be.empty;
    });

    after(async () => driver.quit());
});