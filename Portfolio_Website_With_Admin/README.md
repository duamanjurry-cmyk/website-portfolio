# Portfolio Website With Admin Dashboard

This upgraded template includes a browser-based admin area powered by Decap CMS.

Once the site is connected to GitHub and Netlify, you can visit:

`https://YOUR-SITE.netlify.app/admin/`

From there you can:

- Change your name, headline, introduction and contact links
- Add or delete portfolio projects
- Reorder projects
- Upload project preview images
- Upload Canva screenshots
- Upload email campaign screenshots
- Upload PDFs
- Upload videos
- Upload DOCX, XLSX, PPTX, ZIP and other files
- Add live website or landing-page links
- Enter the challenge, solution, tools and project result

Publishing from the admin dashboard commits the content/files to GitHub.
Netlify then redeploys the public portfolio.

---

## One-Time Setup

### 1. Create a GitHub Repository

Create a new repository in your GitHub account.

Example:

`professional-portfolio`

Upload all files from this folder to that repository.

### 2. Edit `admin/config.yml`

Find:

`repo: YOUR_GITHUB_USERNAME/YOUR_REPOSITORY`

Change it to your GitHub repository.

Example:

`repo: michael/professional-portfolio`

Also replace:

`https://YOUR-SITE.netlify.app`

with your actual Netlify URL.

### 3. Connect the Repository to Netlify

In Netlify, create/import a project from the GitHub repository.

This is important: the admin dashboard needs a Git-backed site so it can save/publish edits.

### 4. Add GitHub Authentication in Netlify

The Decap GitHub backend needs OAuth authentication.

In GitHub:

1. Open GitHub Settings.
2. Open Developer settings.
3. Open OAuth Apps.
4. Create a new OAuth App.
5. Homepage URL = your Netlify site URL.
6. Authorization callback URL:

`https://api.netlify.com/auth/done`

7. Copy the GitHub Client ID and generate a Client Secret.

In Netlify:

1. Open your project.
2. Go to:
   Project configuration → Access & security → OAuth → Authentication providers
3. Install/add GitHub as a provider.
4. Enter the GitHub Client ID and Client Secret.

### 5. Open the Admin

Visit:

`https://YOUR-SITE.netlify.app/admin/`

Click **Login with GitHub**.

Your GitHub account must have write/push access to the repository.

---

## Adding a Project

In `/admin/`:

1. Open **Portfolio Manager**
2. Open **Portfolio Website**
3. Scroll to **Portfolio Projects**
4. Click **Add Portfolio Projects**
5. Enter the title and category
6. Select the project type
7. Upload a card preview image
8. Upload the project file or enter its URL
9. Add the description, challenge, solution, tools and result
10. Click **Publish**

Netlify will deploy the updated site after the repository changes.

---

## Project Type Guide

### Canva Designs
Project Type: `Image / Email Screenshot / Canva`

Upload your exported JPG/PNG as both the preview and project media if desired.

### Email Campaigns
Project Type: `Image / Email Screenshot / Canva`

Take a full-page screenshot of the email and upload it.

### PDF
Project Type: `PDF`

Upload the PDF as Project File / Media.

### Videos
Project Type: `Video`

Upload MP4/WebM as Project File / Media and use a screenshot as the card preview.

For very large videos, use an external video hosting service rather than storing the video in Git.

### Website / Landing Page
Project Type: `External Website / Landing Page`

Use a screenshot as the card preview and paste the live URL into Project File / Media.

### Spreadsheet / DOCX / PPTX / ZIP
Project Type: `Other File`

Upload the file.

---

## Privacy Checklist

Before publishing client work:

- Remove or blur email addresses
- Remove or blur phone numbers
- Remove private client names where required
- Never expose passwords
- Never expose API keys
- Remove confidential lead data
- Use demo/sample CRM records where possible

---

## Files You Usually Do NOT Need to Edit

After the one-time setup, you normally will not need to manually edit:

- `index.html`
- `styles.css`
- `script.js`

Most ongoing portfolio editing is done at `/admin/`.
