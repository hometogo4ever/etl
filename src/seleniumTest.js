const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

let driver = null;

async function example2() {
    let options = new chrome.Options();
    var service = new chrome.ServiceBuilder(path).build();
    let driver = chrome.Driver.createSession(options, service);
    try {
        await driver.get("https://nsso.snu.ac.kr/sso/usr/snu/mfa/login/view");
        await driver.sleep(5000);
        await driver.findElement(By.id("tab-2")).click();
        await driver.findElement(By.id('fido2_login_id')).sendKeys('hometogo0625');
        await driver.findElement(By.id('btnIDTokenCreateFido2')).click();
        await driver.sleep(10000);
        await driver.navigate().to("https://myetl.snu.ac.kr/");
        await driver.sleep(5000);
        const classElements = await driver.findElements(By.className("ic-DashboardCard"));
        for (let element of classElements) {
            let ariaLabel = await element.getAttribute("aria-label");
            console.log(ariaLabel);
        }
        for (let element of classElements) {
            let text = await element.getText();
            console.log(text);
        }

    } finally {
        await driver.quit();
    }
}
example2();