const HeadlessChrome = require('simple-headless-chrome')

const browser = new HeadlessChrome({
  headless: true // If you turn this off, you can actually see the browser navigate with your instructions
});

console.log('class initiated');

await browser.wait(5000)

await browser.init();

await browser.goTo('https://www.google.com/');

await browser.getScreenshot();

console.log(screenshot);

await browser.close();