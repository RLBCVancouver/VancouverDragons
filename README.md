# Vancouver Dragons website

Live site: https://vancouverdragons.ca

## For the club: how to edit the site

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open **VancouverDragons**.
3. Pick what you want to change on the left:
   - **Sponsors**: add, remove or reorder sponsors and upload logos
   - **Schedule and fixtures**: add games, results and the intro line
   - **Board**, **Life members**, **Club awards**
4. Click **Save**. The website updates by itself in about a minute.

Tips
- To add a sponsor logo, use a WebP or PNG with a transparent background.
- Fixtures show in date order. Add the result after the game ("Won 24-12").
- When the real fixtures are in, turn off the yellow notice and the season preview picture.
- If something won't save, or the site doesn't update, check the Deploys page in Netlify. A mistake in the content stops the update and leaves the previous version live, with a message saying what to fix.

## For developers

- Pages are static HTML in this repo. Editable content lives in `data/*.json` and is filled into marked regions (`<!--cms:name-->`) by `build.py` on every Netlify deploy. Output goes to `dist/`.
- `.pages.yml` defines the editing screens. `netlify.toml` sets the build command and publish folder.
- Run locally: `python3 build.py`, then serve `dist/`.
- Site built and maintained by McLeod Technologies Corp.
