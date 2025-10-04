# Perplexity Auto-hide Input & Header

A userscript that auto-hides the Perplexity chat input textbox and header to save screen space, showing them only when you hover near the respective areas of the page.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Userscript](https://img.shields.io/badge/userscript-Violentmonkey-orange)

## ✨ Features

- **🎛️ Toggle Controls**: Enable/disable features independently through Violentmonkey menu
- **📱 Input Auto-hide**: Hides chat input, shows on bottom hover (120px zone)
- **🎯 Header Auto-hide**: Hides entire header (title, Research, Steps, Share button, etc.), shows on top hover (80px zone)
- **⚡ Smooth Animations**: 300ms transitions with opacity effects
- **🔄 Dynamic Content**: Handles page changes and dynamic loading
- **💾 Persistent Settings**: Your preferences are saved between sessions

## 🚀 Installation

### Recommended: Violentmonkey (JavaScript)

1. **Install Violentmonkey extension**:
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)

2. **Install the userscript**:
   - Click here: [**Install perplexity-autohide-input.user.js**](https://github.com/YOUR_USERNAME/perplexity-autohide-userscript/raw/main/perplexity-autohide-input.user.js)
   - Or manually: Copy the code from `perplexity-autohide-input.user.js` → Violentmonkey Dashboard → "+" → Paste → Save

3. **Visit Perplexity.ai** and enjoy the extra screen space!

### Alternative: Stylus (CSS) - Input Only

For input hiding only (no header hiding):

1. **Install Stylus**: [Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/styl-us/)
2. **Copy CSS code** from `perplexity-autohide-input.css`
3. **Create new style** in Stylus for domain `perplexity.ai`

## 🎮 How to Use Toggle Controls

After installing the Violentmonkey script:

1. **Click the Violentmonkey extension icon** in your browser toolbar
2. **Look for the script menu options**:
   - ✅ Auto-hide Input Bar (enabled)
   - ✅ Auto-hide Header (enabled)
3. **Click any option to toggle it on/off**
4. **Page reloads automatically** to apply changes

You can enable/disable each feature independently!

## ⚙️ Customization

Edit the script to customize behavior:

```javascript
// Configuration (top of script)
const HOVER_ZONE_HEIGHT = 120; // Input trigger area (bottom)
const HEADER_HOVER_ZONE_HEIGHT = 80; // Header trigger area (top)
const ANIMATION_DURATION = 300; // Animation speed (ms)
```

## 🐛 Troubleshooting

If the script doesn't work:

1. **Check extension permissions**: Ensure Violentmonkey is enabled for `perplexity.ai`
2. **Refresh the page**: Try a hard refresh (Ctrl+F5)
3. **Check console**: Open Developer Tools (F12) → Console for error messages
4. **Update selectors**: Perplexity may change their HTML structure

## 📁 Files

- **`perplexity-autohide-input.user.js`** - Main userscript (recommended)
- **`perplexity-autohide-input.css`** - CSS-only version (input hiding only)
- **`README.md`** - This documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 License

MIT License - feel free to modify and distribute!

## 🔗 Related

- [Violentmonkey](https://violentmonkey.github.io/) - Userscript manager
- [Stylus](https://add0n.com/stylus.html) - CSS injection extension
- [Perplexity.ai](https://www.perplexity.ai/) - AI search engine

---

**⭐ Star this repo if it helps you!**
