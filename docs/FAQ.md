# Frequently Asked Questions (FAQ)

## General Questions

### What is the Neuro ICU Rounding App?

The Neuro ICU Rounding App is a web-based application designed to streamline neurological intensive care unit workflows. It helps clinicians organize patient data, calculate clinical scores, and generate structured progress notes using SmartPhrase templates.

### Who is this application for?

This app is designed for:
- Neurocritical care physicians
- Neurology and neurosurgery residents
- ICU fellows
- Nurse practitioners and physician assistants in neuro ICU
- Medical students rotating through neurocritical care

### Is this a replacement for my electronic health record (EHR)?

No. This is a **documentation aid** and **rounding tool**. It helps you organize information and generate notes, but the final documentation should be entered into your institution's official EHR system.

### Can I use this with real patient data?

**Use caution with protected health information (PHI)**. The app stores data locally in your browser and does not transmit data to any server. However:
- Avoid using full patient names or medical record numbers
- Consider using patient initials or study IDs only
- Be aware that browser localStorage is not HIPAA-compliant storage
- Clear browser data after use if working on shared computers
- Consult your institution's policies on using third-party tools

## Technical Questions

### What browsers are supported?

**Recommended browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Not supported**:
- Internet Explorer (discontinued by Microsoft)
- Very old browser versions

### Does this work on mobile devices?

Yes! The app is responsive and works on tablets and mobile phones. However, for the best experience with complex data entry, we recommend:
- iPad or Android tablet (landscape orientation)
- Laptop or desktop for initial patient setup
- Mobile for quick updates and viewing

### Do I need an internet connection?

**Initial load**: Yes, you need internet to load the application initially.

**After loading**: The app works offline! Once loaded, you can use it without internet because:
- All code runs in your browser
- Data is stored locally
- No server communication required

**Caveat**: If you refresh or close the browser, you'll need internet to reload the app.

### Can I install this as a desktop app?

Currently, no native desktop app exists. However:
1. **Chrome/Edge**: You can "install" as a progressive web app (PWA) using the install button in the address bar
2. **Bookmark**: Add to bookmarks for quick access
3. **Shortcut**: Create a desktop shortcut to the URL

### Where is my data stored?

All patient data is stored in your browser's **localStorage**:
- Data persists between sessions
- Data is specific to the browser and device
- Data does NOT sync across devices
- Data is cleared if you clear browser data

**Storage capacity**: Typically 5-10MB per origin, enough for 50-100 patients with full data.

### How do I backup my data?

Currently, there's no built-in export feature. Data backup options:
1. **Don't clear browser data** - keep browser cache/storage
2. **Take screenshots** of important notes
3. **Copy-paste** generated notes to external storage
4. **Future feature**: Export/import functionality is planned

### Can multiple people use this on the same computer?

Yes, but each browser profile has separate data:
- Use different browser profiles (Chrome profiles, Firefox profiles)
- Or use different browsers (Chrome vs Firefox)
- Each profile maintains separate patient lists

### Why isn't my data syncing between my phone and laptop?

Data is stored **locally only** on each device. There is no cloud sync. This is by design to:
- Avoid transmitting PHI over the internet
- Work offline
- Keep the app simple and fast

## Using the Application

### How do I start a new patient?

1. Click the "New Patient" button
2. Enter patient name (or initials)
3. Select the diagnosis type (SAH, stroke, TBI, etc.)
4. Fill in the relevant tabs (Scores, Exam, Data, Plan)

### What are SmartPhrase templates?

SmartPhrase templates are pre-formatted medical note templates with placeholder tokens (like @NAME@, @GCS@) that automatically fill in with your patient data. Similar to dot phrases in many EHR systems.

### How do I customize templates?

See the [CUSTOMIZATION.md](./CUSTOMIZATION.md) guide for detailed instructions on:
- Modifying existing templates
- Creating new templates
- Adding custom tokens
- Changing formatting

### Why is the Scores tab empty?

The Scores tab shows diagnosis-specific calculators. Make sure:
1. You've selected a diagnosis type in the patient header
2. The diagnosis type has associated scores (SAH, stroke, ICH, TBI, etc.)

### Can I add my own clinical scores?

Yes! See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for instructions on adding custom clinical score calculators.

### How do I copy a note to my EHR?

1. Navigate to the **Plan** tab
2. Review the generated note
3. Click **"Copy to Clipboard"** button
4. Paste (Ctrl+V or Cmd+V) into your EHR system
5. Review and edit as needed in your EHR

### What if "Copy to Clipboard" doesn't work?

**Alternative methods**:
1. **Manual selection**: Click and drag to select the text, then Ctrl+C / Cmd+C
2. **Browser permissions**: Check if the browser is blocking clipboard access
3. **Try different browser**: Some browsers handle clipboard API differently

### Can I save multiple versions of a note?

Not directly in the app. However:
1. Copy the note to a text file for archiving
2. Keep previous versions in your EHR if it supports note versioning
3. Consider feature request: version history within the app

### How do I delete a patient?

Currently, patient deletion must be done by:
1. Closing the browser tab (for session-only patients)
2. Clearing browser localStorage
3. **Future feature**: Individual patient delete button planned

## Clinical Questions

### Are the clinical calculators accurate?

The calculators are based on published literature and validated scoring systems. However:
- **Always verify** calculations independently
- **Follow institutional protocols** that may differ
- **Use clinical judgment** - calculators are aids, not replacements for clinical decision-making
- Report any calculation errors via GitHub issues

### Where do the mortality statistics come from?

Each clinical score includes references to the original publications:
- **ICH Score**: Hemphill et al., Stroke. 2001
- **Hunt & Hess**: Hunt & Hess, J Neurosurg. 1968
- **Modified Fisher**: Frontera et al., Stroke. 2006
- See individual calculator documentation for full citations

### Can I trust the risk predictions?

Risk prediction tools are **population-based estimates**:
- They provide average outcomes from research cohorts
- Individual patient outcomes vary
- Use in conjunction with clinical assessment
- Not a substitute for individualized prognostication
- Discuss outcomes with your attending and team

### What if my institution uses different scoring systems?

You can customize the app to use your preferred scoring systems:
1. Modify existing calculators
2. Add new calculators
3. Change reference ranges
4. See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for instructions

### Do you support pediatric scoring systems?

Currently, the app is designed primarily for adult neurological ICU patients. Pediatric-specific scores would need to be added as custom features. Contributions welcome!

## Data and Privacy

### Is this HIPAA compliant?

**No explicit HIPAA compliance**. The app:
- Does not transmit data to servers
- Stores data only in local browser
- Has no audit logs
- Has no access controls
- Is not a "covered entity" technology

**For HIPAA compliance**:
- Consult your institution's IT and compliance teams
- Consider de-identifying patients (use initials, study IDs)
- Clear browser data regularly
- Don't use on shared/public computers

### Can others see my patient data?

**On your device**: Anyone with access to your device and browser can see the data in localStorage.

**Over the network**: No data is transmitted to external servers.

**Best practices**:
- Lock your computer when away
- Log out of browser profiles
- Use private/incognito mode for temporary sessions (data won't persist)
- Clear browser data on shared computers

### What happens if I clear my browser data?

**All patient data will be lost**. Browser localStorage is cleared when you:
- Clear browsing data/history
- Clear site data for the specific URL
- Uninstall and reinstall the browser (sometimes)

**To avoid data loss**:
- Don't clear browser data frequently
- Export important notes before clearing
- Consider this a temporary workspace, not permanent storage

## Deployment and Setup

### How do I deploy this for my team?

See the [README.md](../README.md) GitHub Pages deployment section. Options:
1. **GitHub Pages** (easiest): Free hosting, automatic updates
2. **Institutional server**: Host the `dist/` folder on your hospital's web server
3. **Local network**: Set up on an intranet server
4. **Individual use**: Each user can run locally

### Can I deploy on my hospital's intranet?

Yes! The app is just static HTML/CSS/JavaScript:
1. Run `npm run build`
2. Copy the `dist/` folder to your web server
3. Serve via IIS, Apache, nginx, or any static host
4. No server-side code or database required

### Do I need to set up a database?

No! The app uses browser localStorage only. No database required.

### How do I keep the app updated?

If using GitHub Pages:
- Updates deploy automatically when code is pushed to `main`
- Users refresh their browser to get the latest version

If self-hosting:
- Pull latest code from GitHub
- Run `npm run build`
- Deploy new `dist/` folder
- Clear browser cache to force reload

### Can I customize the app for my institution?

Absolutely! See [CUSTOMIZATION.md](./CUSTOMIZATION.md). You can:
- Add your hospital name/logo
- Customize templates
- Add institution-specific checklists
- Modify clinical scores
- Change color scheme

## Contributing and Support

### How do I report a bug?

1. Go to [GitHub Issues](https://github.com/szarbiv34-lab/neuroicu-rounds/issues)
2. Click "New Issue"
3. Describe the bug with:
   - What you expected to happen
   - What actually happened
   - Steps to reproduce
   - Browser and OS version
   - Screenshots if applicable

### How do I request a feature?

Same process as bug reports - open a GitHub Issue with:
- Clear description of the feature
- Use case / clinical scenario
- Why it would be valuable
- Any implementation suggestions

### Can I contribute code?

Yes! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines. We welcome:
- Bug fixes
- New features
- Clinical content (templates, scores)
- Documentation improvements
- UI/UX enhancements

### I found a security vulnerability. What should I do?

**Do not** post security vulnerabilities publicly in GitHub Issues.

Instead:
1. Email the maintainer directly (see GitHub profile)
2. Or open a private security advisory on GitHub
3. Provide details of the vulnerability
4. Allow time for a fix before public disclosure

### Where can I get help?

**Documentation**:
- [README.md](../README.md) - Quick start and overview
- [USER_GUIDE.md](./USER_GUIDE.md) - Detailed usage instructions
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical details
- [CUSTOMIZATION.md](./CUSTOMIZATION.md) - How to customize

**Support**:
- GitHub Issues for bugs and questions
- GitHub Discussions for general questions
- Review existing issues - your question may be answered

### Is there a community forum?

Currently, use GitHub Discussions or Issues. A dedicated forum or Slack channel may be created if there's sufficient community interest.

## Future Development

### What features are planned?

Potential future features (not guaranteed, not in any order):
- Export/import patient data
- Note version history
- Additional clinical calculators
- Team collaboration features
- Dark mode
- Offline PWA with service worker
- Custom template builder UI
- Print-friendly views

### Can I sponsor development?

Currently, this is an open-source project maintained by volunteers. If you're interested in sponsoring specific features or development, open a GitHub Discussion to start a conversation.

### Will this always be free?

The core application will remain **open source and free**. If institutional deployment services or premium features are added in the future, they would be separate from the core free product.

---

**Have a question not answered here?** Open a [GitHub Issue](https://github.com/szarbiv34-lab/neuroicu-rounds/issues) with the `question` label!
