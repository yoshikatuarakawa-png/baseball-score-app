# Google Drive Sync Setup

The app has `Drive保存` and `Drive読込` buttons, but Google requires an OAuth client ID before they can work.

Steps:

1. Open Google Cloud Console.
2. Create a project.
3. Enable the Google Drive API.
4. Configure the OAuth consent screen.
5. Create an OAuth Client ID for a Web application.
6. Add this JavaScript origin:
   `https://yoshikatuarakawa-png.github.io`
7. Copy the client ID into `GOOGLE_CLIENT_ID` in `app.js`.

The app saves one JSON file named `baseball-score-app-data.json` in Google Drive.
