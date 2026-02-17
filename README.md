# Internal Site Links Dashboard

A modern, responsive dashboard for managing and accessing internal site links. Built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

- **Dynamic Content**: Loads link data from a simple CSV file.
- **Search & Filter**: Real-time search by title/description and category filtering.
- **View Modes**: Toggle between Grid and List views.
- **Theme Support**: Built-in Dark and Light modes with persistence.
- **Responsive Design**: Mobile-friendly layout with a collapsible sidebar on smaller screens.
- **Secure Access**: Simple client-side authentication (hash-based) for restricted access.
- **Image Handling**: Automatic fallback to a custom SVG placeholder for missing images.

## 🛠️ Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/internal-site-links.git
   ```

2. **Configure Users**:
   - Edit `config/users.json` to add usernames and their SHA-256 hashed passwords.
   - *Note: This is a client-side implementation. For high security, implement server-side auth.*

3. **Add Links**:
   - Edit `assets/data.csv` to manage your links.
   - **Format**: `Title,Link,Description,Image,Category`

4. **Run**:
   - Serve the directory using any static file server (e.g., VS Code Live Server, Python `http.server`, etc.).
   - Open `index.html` in your browser.

## 📂 Project Structure

```
├── assets/
│   ├── data.csv        # Link data source
│   ├── logo.svg        # Project logo
│   └── thinking.svg    # Fallback image
├── config/
│   └── users.json      # User credentials (JSON)
├── dashboard.html      # Main dashboard interface
├── dashboard.js        # Dashboard logic (filtering, rendering)
├── index.html          # Login page
├── login.js            # Login logic
├── style.css           # Global styles & themes
└── util.js             # Utility functions
```

## 🎨 Customization

- **Styling**: Modify `style.css` to change colors, fonts, or layout.
- **Icons**: Replace SVGs in `assets/` or within the HTML files.
- **Data**: The `data.csv` file controls all displayed content. Ensure the header row remains intact.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
