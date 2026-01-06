# Contributing to Berta1Clarity

Thank you for your interest in contributing to Clarity! 🎉

Clarity is a thinking tool for breaking down complex problems and surfacing hidden assumptions. Contributions that improve the core thinking experience, add new modules, or enhance accessibility are especially welcome.

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

Found a bug? Open an issue with:

1. **Clear title** - Describe the bug in a sentence
2. **Steps to reproduce** - How can someone recreate it?
3. **Expected behavior** - What should happen?
4. **Actual behavior** - What actually happened?
5. **Environment** - Browser, OS, AI provider
6. **Screenshots** - If applicable

### Suggesting Features

Have an idea? Open an issue with:

1. **Use case** - Who benefits and how?
2. **Problem it solves** - Why is this valuable?
3. **Proposed solution** - How would it work?
4. **Alternatives** - Any other approaches?

### Pull Requests

Ready to code? Here's how:

#### Step 1: Setup
```bash
# Fork on GitHub
git clone https://github.com/YOUR_USERNAME/Clarity.git
cd Clarity
```

#### Step 2: Make Changes
- Edit `clarity-engine-v2.html`
- Test thoroughly in multiple browsers
- Keep changes focused and minimal

#### Step 3: Test
- Test with all three AI providers (Anthropic, OpenAI, Google)
- Test both free and premium features
- Check mobile responsiveness
- Verify no console errors

#### Step 4: Commit & Push
```bash
git checkout -b feature/your-feature-name
git commit -m "Add your feature description"
git push origin feature/your-feature-name
```

#### Step 5: Open Pull Request
- Go to GitHub and click "New Pull Request"
- Describe what you changed and why
- Reference any related issues

## Development Guidelines

### Code Style

Clarity uses vanilla JavaScript with no build step. Keep it simple:

- **No frameworks** - Pure JavaScript only
- **No dependencies** - Everything self-contained in one file
- **Clear variable names** - `const userGoal` not `ug`
- **Comments for complexity** - Explain the "why" not the "what"
- **Functions should be ~30 lines** - Break up large functions

### Adding a New Thinking Module

1. **Define the module object** at the top:
```javascript
const modules = {
    newModule: {
        id: 'new-module',
        name: 'New Module Name',
        description: 'What this module does',
        icon: '◆',
        systemPrompt: 'Instructions for Claude...',
        defaultButtons: [
            { text: 'AI Action 1', action: 'action1' },
            { text: 'AI Action 2', action: 'action2' }
        ]
    }
};
```

2. **Add HTML** in the module rendering section
3. **Test thoroughly** with example inputs
4. **Include in guided tour** so users know how to use it

### Improving Prompts

The prompts make or break the AI responses. When improving prompts:

- Test with multiple inputs
- Keep them concise but clear
- Include examples in the prompt
- Focus on the user's goal, not the mechanism
- Test with all three AI providers

### Performance

Clarity should feel fast and responsive:

- Minimize DOM manipulation
- Use event delegation for many elements
- Avoid heavy computations in event handlers
- Cache AI responses in localStorage
- Lazy-load if adding new features

## Testing Checklist

Before submitting a PR:

- [ ] Tested in Chrome, Firefox, Safari
- [ ] Tested on mobile (responsiveness)
- [ ] Tested with Anthropic Claude
- [ ] Tested with OpenAI GPT
- [ ] Tested with Google Gemini
- [ ] No console errors
- [ ] Saved data persists across page refresh
- [ ] Export formats work correctly
- [ ] All buttons have proper labels

## File Structure

Clarity is intentionally **single-file** for portability:

```
clarity-engine-v2.html
├── <head> - Metadata, styles, fonts
├── <body>
│   ├── Header/Navigation
│   ├── Main app container
│   └── Modal dialogs
└── <script>
    ├── Module definitions
    ├── UI management
    ├── AI integration
    ├── Storage (localStorage)
    ├── Export functions
    └── Event handlers
```

## Documentation

When you add a feature:

1. **Update README.md** - Document the new feature
2. **Update Usage Guide** - Show examples
3. **Add comments** in the code for non-obvious logic

## Questions?

- Open a [GitHub Discussion](https://github.com/luigipascal/Clarity/discussions)
- Email: hello@berta.one
- Twitter: [@BertaOne](https://twitter.com/bertaone)

## Recognition

Contributors will be listed in:
- This file
- Release notes
- Project homepage (if desired)

Thank you for making Clarity better! 🙏
