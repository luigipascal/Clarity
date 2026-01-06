# Berta1Clarity

**Think once. Build right.**

An AI-powered thinking tool that helps you break down goals, surface hidden assumptions, and create clarity before you create chaos.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/luigipascal?style=flat&logo=github)](https://github.com/sponsors/luigipascal)

🔗 **[Live Demo](https://clarity.berta.one)** | 📖 **[Documentation](https://berta.one/clarity)** | 💬 **[Community](https://github.com/luigipascal/Clarity/discussions)**

---

## ✨ Features

Seven thinking modules, each tackling a different challenge:

- **⬡ Prerequisite Mapper** - Break any goal into what must be true first
- **◇ Assumption Register** - Surface hidden beliefs you didn't know you were making
- **⇄ Handover Machine** - Extract tacit knowledge before it walks out the door
- **◎ Constraint Ratchet** - Creativity under pressure with timed challenges
- **✧ Collision Engine** - Spark ideas by colliding problems with random domains
- **↻ Fragment Resurrector** - Revive abandoned drafts with AI suggestions
- **⊘ Inverse Brief** - Define by exclusion, map the possibility space

---

## 🚀 Quick Start

### Option 1: Use the Hosted Version (Easiest)

Just visit **[clarity.berta.one](https://clarity.berta.one)** and start using it immediately. No signup required.

### Option 2: Self-Host (Open `clarity-engine-v2.html`)

Simply open the HTML file in any modern browser:

```bash
# Clone the repository
git clone https://github.com/luigipascal/Clarity.git
cd Clarity

# Open in your browser
open clarity-engine-v2.html      # macOS
xdg-open clarity-engine-v2.html  # Linux
start clarity-engine-v2.html     # Windows (PowerShell)
```

Or drag `clarity-engine-v2.html` into your browser window.

---

## 🤖 AI Provider Setup

Go to **Settings** (⚙️) and choose your AI provider:

### Anthropic Claude (Recommended)
- **Best for:** Complex reasoning, nuanced analysis
- **Cost:** ~$0.001-0.003 per query
- **API Key:** Get from [console.anthropic.com](https://console.anthropic.com)
- **Free tier:** $5 credit to start

### OpenAI GPT-4o
- **Best for:** Speed, general-purpose
- **Cost:** ~$0.015 per query
- **API Key:** Get from [platform.openai.com](https://platform.openai.com)

### Google Gemini
- **Best for:** Long-context, affordability
- **Cost:** ~$0.00005-0.0001 per query
- **API Key:** Get from [ai.google.dev](https://ai.google.dev)

**Privacy:** Your API keys are stored **only in your browser's local storage**. We never see them or log them anywhere.

---

## 📖 Usage Guide

### Basic Workflow

1. **Choose a thinking module** from the left sidebar
2. **Enter your goal or problem** in the main input
3. **Click AI buttons** to get Claude's analysis:
   - "AI Decompose" - Break into prerequisites
   - "AI Surface Hidden" - Find blind spot assumptions
   - "AI Expand" - Generate options
4. **Export** as Markdown, JSON, or generate full Report

### Example: Breaking Down a Project Goal

```
Goal: Launch our SaaS product by Q2 2024

↓ Click "AI Decompose"

Prerequisites:
- Validate 50+ customers would pay
- Build MVP feature set
- Set up billing/payment processing
- Create marketing site
- Recruit founding customers
```

### Advanced Features

- **Guided Tour** - Learn all modules with examples
- **Export Reports** - Generate comprehensive strategic briefs
- **Cloud Sync** - Save projects (coming soon)
- **AI Summary** - Auto-generate executive summaries (coming soon)

---

## 🏗️ Architecture

- **Frontend:** Single-file vanilla JavaScript app (~1700 lines)
- **Storage:** Browser localStorage (no backend required)
- **AI:** Direct calls to OpenAI, Anthropic, or Google APIs
- **Deployment:** Works offline, entirely static (can serve from CDN)

**No backend needed.** Pure client-side execution means:
- ✅ Maximum privacy (your data stays local)
- ✅ Zero server costs
- ✅ Works completely offline
- ✅ Easy self-hosting

---

## 🔐 Privacy & Security

- **No account required** - Use immediately without signup
- **No tracking** - No analytics, no cookies, no telemetry
- **Local-first** - All data stored in browser's localStorage
- **API-direct** - AI calls go directly to the provider, never through our servers
- **Open source** - Inspect the code, fork it, host it yourself

---

## 💰 Pricing

The tool itself is **completely free**. You only pay for AI API usage:

| Provider | Cost | Free Tier |
|----------|------|-----------|
| Anthropic Claude | ~$0.001-0.003/query | $5 credit |
| OpenAI GPT-4o | ~$0.015/query | $5 credit |
| Google Gemini | ~$0.0001/query | Free tier available |

**Typical usage:** A full thinking session (5-10 AI calls) costs $0.01-0.05.

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development

```bash
# Clone
git clone https://github.com/luigipascal/Clarity.git

# Make changes to clarity-engine-v2.html
# Test in browser

# Submit PR with description
```

### Ideas for Contributions

- New thinking modules
- Improved prompt engineering
- Export formats (PDF, DOCX)
- Keyboard shortcuts
- Mobile UI improvements
- Additional AI providers
- Translations

---

## 📝 License

MIT License - feel free to use for personal or commercial projects.

See [LICENSE](LICENSE) for details.

---

## 💖 Support

If Clarity helps you think better:

- **⭐ Star this repo** - Shows support on GitHub
- **💬 Share feedback** - [Open an issue](https://github.com/luigipascal/Clarity/issues)
- **☕ [Buy me a coffee](https://ko-fi.com/bertaone)**
- **💖 [Become a GitHub Sponsor](https://github.com/sponsors/luigipascal)**

---

## 🔗 Links

- **Website:** [berta.one](https://berta.one)
- **Live App:** [clarity.berta.one](https://clarity.berta.one)
- **X/Twitter:** [@berta_one](https://x.com/berta_one)
- **Email:** hello@berta.one

---

**Made by [Rondanini Publishing](https://rondanini.com)**
