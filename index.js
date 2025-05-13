import fs from "fs";
import fetch from "node-fetch";
import fetchCookie from "fetch-cookie";
import { HttpsProxyAgent } from "https-proxy-agent";
import { CookieJar } from "tough-cookie";
import figlet from "figlet";
import chalk from "chalk";

const BASE_URL = "https://testnet.humanity.org";
const TOKENS = fs.readFileSync("token.txt", "utf-8").split("\n").map(t => t.trim()).filter(Boolean);
const PROXIES = fs.readFileSync("proxy.txt", "utf-8").split("\n").map(p => p.trim()).filter(Boolean);

// 🎨 Banner hanya tampil sekali
function showBanner() {
  console.log(chalk.green(figlet.textSync("Humanity Auto Claim", { horizontalLayout: "default" })));
}

function getRandomProxy() {
  if (PROXIES.length === 0) return null;
  const proxy = PROXIES[Math.floor(Math.random() * PROXIES.length)];
  return new HttpsProxyAgent(proxy);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function call(fetchWithCookies, agent, token, endpoint, method = "POST", body = {}) {
  const url = BASE_URL + endpoint;
  const res = await fetchWithCookies(url, {
    method,
    headers: {
      "accept": "application/json, text/plain, */*",
      "content-type": "application/json",
      "authorization": `Bearer ${token}`,
      "token": token,
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/136.0.0.0 Safari/537.36"
    },
    agent,
    body: method === "GET" ? undefined : JSON.stringify(body)
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${JSON.stringify(responseData)}`);
  return responseData;
}

async function getPublicIP(agent) {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { agent, timeout: 10000 });
    const data = await res.json();
    return data.ip;
  } catch {
    return "Unable to fetch IP";
  }
}


async function runAccount(index, token) {
  const proxy = getRandomProxy();
  const jar = new CookieJar();
  const fetchWithCookies = fetchCookie(fetch, jar);
  const publicIP = await getPublicIP(proxy);
  let firstLoop = true;

  while (true) {
    try {
      if (firstLoop) {
        await delay((index - 1) * 15000); // delay antar akun
        firstLoop = false;
      }

      const userInfo = await call(fetchWithCookies, proxy, token, "/api/user/userInfo");
      const nickname = userInfo.data.nickName;
      const wallet = userInfo.data.ethAddress;

      console.log(chalk.cyan(`[${index}] 👤 ${nickname} (${wallet})`));
      console.log(`[${index}] 🌐 Proxy IP: ${publicIP}`);

      const balance = await call(fetchWithCookies, proxy, token, "/api/rewards/balance", "GET");
      console.log(`[${index}] 💰 Total Reward: ${balance.balance.total_rewards}`);

      const rewardStatus = await call(fetchWithCookies, proxy, token, "/api/rewards/daily/check");

      if (!rewardStatus.available) {
        const nextTime = new Date(rewardStatus.next_daily_award).getTime();
        const now = Date.now();
        const waitMs = nextTime - now;
        const waitH = Math.ceil(waitMs / 3600000);
        console.log(`[${index}] ❌ ${rewardStatus.message}. Retry in ${waitH} hours.`);
        await delay(waitMs);
        continue;
      }

      const claim = await call(fetchWithCookies, proxy, token, "/api/rewards/daily/claim");
      
      if (claim?.data?.amount) {
        console.log(chalk.green(`[${index}] 🎉 Claimed ${claim.data.amount} successfully`));
      } else {
        console.log(chalk.red(`[${index}] ⚠️ Failed to claim. Response: ${JSON.stringify(claim)}`));
      }

      const updatedBalance = await call(fetchWithCookies, proxy, token, "/api/rewards/balance", "GET");
      console.log(`[${index}] 💰 Updated Reward: ${updatedBalance.balance.total_rewards}`);

      console.log(`[${index}] ⏳ Waiting 1 minute for next check...`);
      await delay(60000);

    } catch (err) {
      console.error(chalk.red(`[${index}] ❌ Error: ${err.message}`));
      console.log(`[${index}] ⏳ Retrying in 1 minute...`);
      await delay(60000);
    }
  }
}


async function main() {
  showBanner();

  if (TOKENS.length === 0) {
    console.error("❌ Tidak ada token di 'token.txt'");
    return;
  }

  console.log(`🔁 Menjalankan ${TOKENS.length} akun...\n`);
  for (let i = 0; i < TOKENS.length; i++) {
    runAccount(i + 1, TOKENS[i]);
    await delay(1000); // delay kecil antar akun
  }
}

main();
