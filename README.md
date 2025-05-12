# 🤖 Humanity Auto Claim Bot

**Auto-claim daily rewards on [Humanity Testnet](https://testnet.humanity.org) using multiple accounts with proxy support.**  
Supports per-account proxy, colored logs, delay handling, and intelligent retries.

---

## 🔧 Features

- ✅ **Multi-account support** – load multiple tokens from `token.txt`
- 🌐 **Proxy support** – assign a proxy to each account (from `proxy.txt`)
- ⏱️ **15-second delay per account** to avoid simultaneous claims
- 📆 **Daily reward check** – waits automatically until the next claim is available
- 💡 **Displays public IP** used by each account's proxy
- 🔁 **Auto-retry on errors**
- 🎨 **Colorful and readable console output**

---

## 📂 File Structure

```
humanity-auto-claim/
├── humanity.js          # Main script
├── token.txt            # List of Humanity tokens (one per line)
├── proxy.txt            # List of HTTP proxies (optional, one per line)
├── package.json         # Dependencies and start script
└── README.md            # You're reading this :)
```

---

## 📄 Example: `token.txt`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6...
eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## 🌐 Example: `proxy.txt`

```
http://username:password@127.0.0.1:8080
http://127.0.0.1:3128
```

If no proxy is provided, connection will run without proxy.

---

## 🚀 How to Use

1. **Clone the repository** or download the files:
   ```bash
   git clone https://github.com/your-username/humanity-auto-claim.git
   cd humanity-auto-claim
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the script**:
   ```bash
   npm start
   ```

---

## 📦 Dependencies

These packages will be installed via `npm install`:

- [`node-fetch`](https://www.npmjs.com/package/node-fetch)
- [`fetch-cookie`](https://www.npmjs.com/package/fetch-cookie)
- [`tough-cookie`](https://www.npmjs.com/package/tough-cookie)
- [`https-proxy-agent`](https://www.npmjs.com/package/https-proxy-agent)
- [`chalk`](https://www.npmjs.com/package/chalk)
- [`figlet`](https://www.npmjs.com/package/figlet)

---

## 🛡️ Disclaimer

This bot is intended for educational and testing purposes on the Humanity Testnet only.  
Use at your own risk.

---

## ✨ Contributing

Pull requests and feature suggestions are welcome!
