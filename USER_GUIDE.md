# Classroom Link — Quick Guide

## What is already connected

- Website: `https://melaka-ai-tuition.online/classroom-link/`
- Teacher and student views are on the same page.
- Google Sheet stores the current room title and prompt.
- Google Drive folder stores uploaded class materials.
- Students can open shared files from the Resources list.

## Before a new class

1. Open the Classroom Link URL.
2. Click **Teacher console**.
3. Replace the prompt title and prompt text.
4. Click **Publish to students**.
5. Copy the student URL and share it as a QR code or message.

## During class

1. Stay in **Teacher console**.
2. Use **Choose file** to select a PDF, image, ZIP or other lesson file.
3. Click **Upload and publish**.
4. Students will see the new file after the page refreshes (usually within 5 seconds).
5. Students click the download arrow beside a resource to open/download it.

## How to start a completely fresh class tomorrow

1. Open the Google Sheet named **Classroom Link Data**.
2. In row 2, change `title` to the new class title.
3. Clear the old `prompt`, `resourceName`, `resourceUrl` and `studentQuestion` cells if you want a clean room.
4. Open the website and publish the first prompt from **Teacher console**.
5. Upload new files during the lesson. The files will appear in the Classroom Link Google Drive folder.

## Sample content

The original sample prompt and sample resource cards were only demo placeholders. They are not real lesson files. Once the API loads, the Resources area shows only files that you actually upload to Drive.

## Important notes

- Keep the Google Sheet and Drive folder under the teaching Google account.
- Uploaded files are set to “Anyone with the link can view”, so students can download them without signing in.
- Do not upload private or sensitive documents.
- To make a QR code, use the student URL above and create a QR code from that URL.
