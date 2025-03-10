const puppeteer = require("puppeteer");

async function fetchPage(url) {
  const browser = await puppeteer.launch({ headless: true }); // 브라우저 실행 (백그라운드 모드)
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "networkidle2" }); // 페이지 이동 및 로딩 완료 대기

  const content = await page.content(); // HTML 가져오기
  console.log(content);

  await browser.close();
}

fetchPage("https://nsso.snu.ac.kr/sso/usr/snu/mfa/login/view");
