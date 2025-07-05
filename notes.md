---
### 🚀 What does `handleDownload` do?

It downloads the image that’s currently shown on the page (referenced by `imageRef`), and saves it to the user’s computer as a PNG file, with a filename based on the selected format.
---

### 🔍 Line by line explanation

```tsx
const handleDownload = () => {
    if(!imageRef.current) return;
```

- Checks if `imageRef.current` exists (i.e. the `<img>` DOM element is mounted).
- If not, exits early.

---

```tsx
fetch(imageRef.current.src).then((response) => response.blob());
```

- Downloads the image file from the image’s **`src` URL**.
- Converts the response into a **blob**, which is binary data representing the image.

---

```tsx
    .then((blob) => {
        const url = window.URL.createObjectURL(blob);
```

- Creates a **temporary local URL** pointing to that blob data in the browser’s memory.

---

```tsx
const link = document.createElement("a");
link.href = url;
```

- Creates an `<a>` tag dynamically.
- Sets its `href` to the blob URL.

---

```tsx
link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
```

- Sets the `download` attribute on the link.
- This tells the browser: when this link is clicked, **download the file instead of navigating to it**.
- The filename is based on `selectedFormat` (replacing spaces with underscores and lowercased).

---

```tsx
document.body.appendChild(link);
link.click();
```

- Adds the link to the DOM (so it can be clicked).
- Programmatically **clicks the link**, triggering the download.

---

```tsx
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    })
}
```

- Cleans up:

  - Removes the link element from the DOM.
  - Frees the memory by revoking the blob URL.

---

### ✍️ Summary in one sentence

👉 It downloads the currently displayed image to the user’s device with a name based on `selectedFormat`, by fetching the image, turning it into a blob, creating a temporary download link, and programmatically clicking it.

---
